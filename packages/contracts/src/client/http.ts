import type { ZodType } from "zod";
import { ApiError, type ProblemDetails } from "./errors";

type FetchLike = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;

export type FormatoRespuesta = "json" | "texto" | "blob";
export type ModoValidacion = "error" | "advertencia" | "desactivada";

export interface PoliticaReintentos {
  maximo: number; // reintentos adicionales al primer intento
  esperaBaseMs: number;
  esperaMaximaMs: number;
}

export interface OpcionesSolicitud<T = unknown> {
  signal?: AbortSignal;
  headers?: HeadersInit;
  /** Token para esta llamada. Si se omite se usa `obtenerToken()`; con `null` no se envía ninguno. */
  token?: string | null;
  /** Opciones extra de fetch (por ejemplo `next` o `cache` en Next.js). */
  init?: Omit<RequestInit, "method" | "body" | "headers" | "signal">;
  /** Tiempo máximo en ms. 0 lo desactiva. Por defecto el del cliente. */
  timeoutMs?: number;
  /** Reintentos de esta llamada: un número, o false para ninguno. Por defecto solo los GET se reintentan. */
  reintentos?: number | false;
  /** No intentar renovar la sesión si responde 401 (login, refresh, logout...). */
  sinRenovacion?: boolean;
  formato?: FormatoRespuesta;
  /** Valida la respuesta en ejecución. */
  esquema?: ZodType<T>;
}

/** Lo que cada función de `api` deja configurar al llamador (por ejemplo la señal de cancelación). */
export type OpcionesBasicas = Omit<OpcionesSolicitud, "esquema">;

export interface OpcionesClienteHttp {
  baseUrl: string;
  obtenerToken?: () => string | null | undefined | Promise<string | null | undefined>;
  /** Se llama ante un 401: debe renovar la sesión y devolver el token nuevo, o null si no se pudo. */
  renovarSesion?: () => Promise<string | null | undefined>;
  /** Por defecto 20 000 ms. */
  timeoutMs?: number;
  /** Por defecto: 2 reintentos con espera exponencial. false los desactiva. */
  reintentos?: Partial<PoliticaReintentos> | false;
  /** Por defecto "error". En producción conviene "advertencia". */
  validacion?: ModoValidacion;
  fetchImpl?: FetchLike;
  /** Sustituible en pruebas para no esperar de verdad. */
  esperar?: (ms: number, signal?: AbortSignal) => Promise<void>;
}

export interface ClienteHttp {
  get<T>(ruta: string, opciones?: OpcionesSolicitud<T>): Promise<T>;
  post<T>(ruta: string, cuerpo?: unknown, opciones?: OpcionesSolicitud<T>): Promise<T>;
  put<T>(ruta: string, cuerpo?: unknown, opciones?: OpcionesSolicitud<T>): Promise<T>;
  delete<T>(ruta: string, opciones?: OpcionesSolicitud<T>): Promise<T>;
}

interface RespuestaLeida {
  estado: number;
  ok: boolean;
  estadoTexto: string;
  tipoContenido: string;
  retryAfter: string | null;
  cuerpo: string | Blob;
}

type OpcionesFetch = Pick<OpcionesSolicitud, "signal" | "headers" | "init">;

const METODOS_REINTENTABLES = new Set(["GET", "HEAD"]);
const ESTADOS_REINTENTABLES = new Set([408, 429, 502, 503, 504]);

function esperar(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolver, rechazar) => {
    if (signal?.aborted) {
      rechazar(new DOMException("Aborted", "AbortError"));
      return;
    }
    const alAbortar = () => {
      clearTimeout(temporizador);
      rechazar(new DOMException("Aborted", "AbortError"));
    };
    const temporizador = setTimeout(() => {
      signal?.removeEventListener("abort", alAbortar);
      resolver();
    }, ms);
    signal?.addEventListener("abort", alAbortar, { once: true });
  });
}

function esperaReintento(
  politica: PoliticaReintentos | null,
  intento: number,
  retryAfter: string | null,
): number {
  const base = politica?.esperaBaseMs ?? 400;
  const maxima = politica?.esperaMaximaMs ?? 4_000;
  const segundos = retryAfter === null ? Number.NaN : Number(retryAfter);
  if (Number.isFinite(segundos) && segundos >= 0) return Math.min(segundos * 1000, 10_000);
  return Math.min(maxima, base * 2 ** (intento - 1)) * (0.5 + Math.random() / 2);
}

function respuestaInvalida(estado: number, errores?: Record<string, string[]>): ApiError {
  return new ApiError(
    estado,
    {
      title: "Respuesta inesperada",
      detail: "El servidor devolvió una respuesta con un formato inesperado.",
      errors: errores,
    },
    "respuesta-invalida",
  );
}

function problemaDe(leida: RespuestaLeida): ProblemDetails {
  const alternativa: ProblemDetails = {
    status: leida.estado,
    title: leida.estadoTexto || undefined,
    detail:
      leida.estado >= 500
        ? "El servidor no está disponible en este momento. Inténtalo más tarde."
        : undefined,
  };
  const texto = typeof leida.cuerpo === "string" ? leida.cuerpo : "";
  if (!texto) return alternativa;
  try {
    const datos: unknown = JSON.parse(texto);
    return datos !== null && typeof datos === "object" ? (datos as ProblemDetails) : alternativa;
  } catch {
    return alternativa;
  }
}

export function crearClienteHttp(opciones: OpcionesClienteHttp): ClienteHttp {
  const base = opciones.baseUrl.replace(/\/+$/, "");
  const timeoutPorDefecto = opciones.timeoutMs ?? 20_000;
  const politica: PoliticaReintentos | null =
    opciones.reintentos === false
      ? null
      : { maximo: 2, esperaBaseMs: 400, esperaMaximaMs: 4_000, ...opciones.reintentos };
  const modoValidacion = opciones.validacion ?? "error";
  const dormir = opciones.esperar ?? esperar;

  let renovacionEnCurso: Promise<string | null> | null = null;
  let tokenRenovado: string | null = null;

  function renovar(): Promise<string | null> {
    renovacionEnCurso ??= Promise.resolve(opciones.renovarSesion?.())
      .then((token) => {
        tokenRenovado = token ?? null;
        return tokenRenovado;
      })
      .catch(() => null)
      .finally(() => {
        renovacionEnCurso = null;
      });
    return renovacionEnCurso;
  }

  async function peticion(
    metodo: string,
    ruta: string,
    cuerpo: unknown,
    token: string | null | undefined,
    o: OpcionesFetch,
    timeoutMs: number,
    formato: FormatoRespuesta,
  ): Promise<RespuestaLeida> {
    const esFormData = typeof FormData !== "undefined" && cuerpo instanceof FormData;
    const tieneCuerpo = cuerpo !== undefined;
    const init: RequestInit = {
      ...o.init,
      method: metodo,
      headers: {
        Accept: formato === "json" ? "application/json" : "*/*",
        ...(tieneCuerpo && !esFormData ? { "Content-Type": "application/json" } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...o.headers,
      },
      body: !tieneCuerpo ? undefined : esFormData ? (cuerpo as FormData) : JSON.stringify(cuerpo),
    };

    const control = new AbortController();
    let vencio = false;
    const temporizador =
      timeoutMs > 0
        ? setTimeout(() => {
            vencio = true;
            control.abort();
          }, timeoutMs)
        : undefined;
    const alCancelar = () => control.abort();
    if (o.signal?.aborted) control.abort();
    else o.signal?.addEventListener("abort", alCancelar, { once: true });

    try {
      const respuesta = await (opciones.fetchImpl ?? fetch)(`${base}${ruta}`, {
        ...init,
        signal: control.signal,
      });
      const cuerpoLeido =
        formato === "blob" && respuesta.ok ? await respuesta.blob() : await respuesta.text();
      return {
        estado: respuesta.status,
        ok: respuesta.ok,
        estadoTexto: respuesta.statusText,
        tipoContenido: respuesta.headers.get("content-type") ?? "",
        retryAfter: respuesta.headers.get("retry-after"),
        cuerpo: cuerpoLeido,
      };
    } catch (error) {
      if (vencio) {
        throw new ApiError(
          0,
          {
            title: "Tiempo de espera agotado",
            detail: "El servidor tardó demasiado en responder. Inténtalo de nuevo.",
          },
          "timeout",
        );
      }
      if (o.signal?.aborted) throw error;
      throw new ApiError(
        0,
        {
          title: "Sin conexión",
          detail: "No se pudo conectar con el servidor. Revisa tu conexión e inténtalo de nuevo.",
        },
        "red",
      );
    } finally {
      if (temporizador !== undefined) clearTimeout(temporizador);
      o.signal?.removeEventListener("abort", alCancelar);
    }
  }

  function interpretar<T>(
    leida: RespuestaLeida,
    formato: FormatoRespuesta,
    esquema?: ZodType<T>,
  ): T {
    if (leida.estado === 204 || leida.estado === 205) return undefined as T;
    if (formato === "blob") return leida.cuerpo as T;

    const texto = typeof leida.cuerpo === "string" ? leida.cuerpo : "";
    if (formato === "texto") return texto as T;
    if (!texto) return undefined as T;

    if (!leida.tipoContenido.toLowerCase().includes("json")) throw respuestaInvalida(leida.estado);

    let datos: unknown;
    try {
      datos = JSON.parse(texto);
    } catch {
      throw respuestaInvalida(leida.estado);
    }

    if (!esquema || modoValidacion === "desactivada") return datos as T;

    const resultado = esquema.safeParse(datos);
    if (resultado.success) return resultado.data;

    const errores: Record<string, string[]> = {};
    for (const problema of resultado.error.issues) {
      const campo = problema.path.map(String).join(".") || "(raíz)";
      (errores[campo] ??= []).push(problema.message);
    }
    if (modoValidacion === "advertencia") {
      console.warn("La respuesta del servidor no coincide con el contrato esperado.", errores);
      return datos as T;
    }
    throw respuestaInvalida(leida.estado, errores);
  }

  async function solicitar<T>(
    metodo: string,
    ruta: string,
    cuerpo: unknown,
    o: OpcionesSolicitud<T> = {},
  ): Promise<T> {
    const timeoutMs = o.timeoutMs ?? timeoutPorDefecto;
    const formato = o.formato ?? "json";
    const maxReintentos =
      o.reintentos === false
        ? 0
        : typeof o.reintentos === "number"
          ? o.reintentos
          : politica && METODOS_REINTENTABLES.has(metodo)
            ? politica.maximo
            : 0;

    let token = o.token !== undefined ? o.token : await opciones.obtenerToken?.();
    let renovada = false;
    let reintentos = 0;

    for (;;) {
      let leida: RespuestaLeida;
      try {
        leida = await peticion(metodo, ruta, cuerpo, token, o, timeoutMs, formato);
      } catch (error) {
        if (error instanceof ApiError && reintentos < maxReintentos) {
          reintentos++;
          await dormir(esperaReintento(politica, reintentos, null), o.signal);
          continue;
        }
        throw error;
      }

      if (leida.ok) return interpretar<T>(leida, formato, o.esquema);

      if (leida.estado === 401 && !o.sinRenovacion && opciones.renovarSesion) {
        if (tokenRenovado && token !== tokenRenovado) {
          token = tokenRenovado;
          continue;
        }
        if (!renovada) {
          renovada = true;
          const nuevo = await renovar();
          if (nuevo) {
            token = nuevo;
            continue;
          }
        }
      }

      if (ESTADOS_REINTENTABLES.has(leida.estado) && reintentos < maxReintentos) {
        reintentos++;
        await dormir(esperaReintento(politica, reintentos, leida.retryAfter), o.signal);
        continue;
      }

      throw new ApiError(leida.estado, problemaDe(leida));
    }
  }

  return {
    get: <T>(ruta: string, o?: OpcionesSolicitud<T>) => solicitar<T>("GET", ruta, undefined, o),
    post: <T>(ruta: string, cuerpo?: unknown, o?: OpcionesSolicitud<T>) =>
      solicitar<T>("POST", ruta, cuerpo, o),
    put: <T>(ruta: string, cuerpo?: unknown, o?: OpcionesSolicitud<T>) =>
      solicitar<T>("PUT", ruta, cuerpo, o),
    delete: <T>(ruta: string, o?: OpcionesSolicitud<T>) =>
      solicitar<T>("DELETE", ruta, undefined, o),
  };
}
