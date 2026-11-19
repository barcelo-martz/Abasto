import { afterEach, describe, expect, it, vi } from "vitest";
import { z } from "zod";
import { ApiError } from "./errors";
import { crearClienteHttp, type OpcionesClienteHttp } from "./http";

const json = (cuerpo: unknown, estado = 200) =>
  new Response(JSON.stringify(cuerpo), {
    status: estado,
    headers: { "Content-Type": "application/json" },
  });

const html = (estado: number) =>
  new Response("<html>Bad Gateway</html>", {
    status: estado,
    headers: { "Content-Type": "text/html" },
  });

const crear = (extra: Partial<OpcionesClienteHttp> & Pick<OpcionesClienteHttp, "fetchImpl">) =>
  crearClienteHttp({ baseUrl: "http://api", esperar: async () => {}, ...extra });

const capturar = (promesa: Promise<unknown>) =>
  promesa.then(
    () => undefined,
    (error: unknown) => error,
  );

/** fetch que nunca responde; solo termina si se cancela. */
const colgada = (_url: RequestInfo | URL, init?: RequestInit) =>
  new Promise<Response>((_ok, rechazar) => {
    const abortar = () => rechazar(new DOMException("Aborted", "AbortError"));
    if (init?.signal?.aborted) abortar();
    else init?.signal?.addEventListener("abort", abortar);
  });

afterEach(() => vi.restoreAllMocks());

describe("peticiones básicas", () => {
  it("envía el token y el cuerpo como JSON", async () => {
    let url = "";
    let init: RequestInit = {};
    const http = crear({
      baseUrl: "http://api/",
      obtenerToken: () => "abc",
      fetchImpl: async (entrada, opciones) => {
        url = String(entrada);
        init = opciones ?? {};
        return json({ ok: true });
      },
    });

    const respuesta = await http.post<{ ok: boolean }>("/api/x", { a: 1 });

    expect(respuesta.ok).toBe(true);
    expect(url).toBe("http://api/api/x");
    expect((init.headers as Record<string, string>).Authorization).toBe("Bearer abc");
    expect(init.body).toBe(JSON.stringify({ a: 1 }));
  });

  it("convierte un ProblemDetails en ApiError con errores por campo", async () => {
    const http = crear({
      fetchImpl: async () =>
        json(
          {
            title: "Datos inválidos",
            status: 400,
            errors: { correo: ["Escribe un correo válido."] },
          },
          400,
        ),
    });

    const error = await capturar(http.post("/api/auth/registro", {}));

    expect(error).toBeInstanceOf(ApiError);
    expect((error as ApiError).status).toBe(400);
    expect((error as ApiError).erroresPorCampo.correo).toEqual(["Escribe un correo válido."]);
  });

  it("usa el detalle del problema como mensaje", async () => {
    const http = crear({
      fetchImpl: async () =>
        json({ title: "Conflicto", detail: "Ya existe una cuenta con ese correo." }, 409),
    });

    const error = await capturar(http.get("/x"));

    expect((error as ApiError).message).toBe("Ya existe una cuenta con ese correo.");
    expect((error as ApiError).esConflicto).toBe(true);
  });

  it("devuelve undefined en una respuesta 204", async () => {
    const http = crear({ fetchImpl: async () => new Response(null, { status: 204 }) });

    expect(await http.post<void>("/x")).toBeUndefined();
  });

  it("envía FormData sin convertirlo a JSON", async () => {
    let init: RequestInit = {};
    const http = crear({
      fetchImpl: async (_url, opciones) => {
        init = opciones ?? {};
        return json({});
      },
    });
    const datos = new FormData();
    datos.append("archivo", new Blob(["a,b"]), "stock.csv");

    await http.post("/x", datos);

    expect(init.body).toBe(datos);
    expect((init.headers as Record<string, string>)["Content-Type"]).toBeUndefined();
  });

  it("devuelve texto y blob cuando se piden", async () => {
    const http = crear({
      fetchImpl: async () => new Response("abc", { headers: { "Content-Type": "text/csv" } }),
    });

    expect(await http.get<string>("/x", { formato: "texto" })).toBe("abc");
    const blob = await http.get<Blob>("/x", { formato: "blob" });
    expect(await blob.text()).toBe("abc");
  });
});

describe("tiempo de espera y red", () => {
  it("corta la petición cuando se agota el tiempo", async () => {
    const http = crear({ reintentos: false, timeoutMs: 20, fetchImpl: colgada });

    const error = await capturar(http.get("/x"));

    expect((error as ApiError).esTimeout).toBe(true);
    expect((error as ApiError).esErrorDeRed).toBe(true);
  });

  it("respeta la cancelación del llamador sin convertirla en error de red", async () => {
    const control = new AbortController();
    const http = crear({ reintentos: false, fetchImpl: colgada });

    const promesa = capturar(http.get("/x", { signal: control.signal }));
    control.abort();
    const error = await promesa;

    expect(error).toBeDefined();
    expect(error).not.toBeInstanceOf(ApiError);
  });

  it("un fallo de red en GET se reintenta y después se informa", async () => {
    let llamadas = 0;
    const http = crear({
      fetchImpl: async () => {
        llamadas++;
        throw new TypeError("fetch failed");
      },
    });

    const error = await capturar(http.get("/x"));

    expect(llamadas).toBe(3); // 1 intento + 2 reintentos
    expect((error as ApiError).esErrorDeRed).toBe(true);
  });
});

describe("reintentos", () => {
  it("un GET se recupera tras un fallo de red y un 503", async () => {
    const pasos = [
      () => {
        throw new TypeError("fetch failed");
      },
      () => json({}, 503),
      () => json({ ok: true }),
    ];
    let i = 0;
    const http = crear({ fetchImpl: async () => pasos[i++]!() });

    const respuesta = await http.get<{ ok: boolean }>("/x");

    expect(respuesta.ok).toBe(true);
    expect(i).toBe(3);
  });

  it("un POST no se reintenta solo", async () => {
    let llamadas = 0;
    const http = crear({
      fetchImpl: async () => {
        llamadas++;
        return json({}, 503);
      },
    });

    const error = await capturar(http.post("/x", {}));

    expect(llamadas).toBe(1);
    expect((error as ApiError).status).toBe(503);
  });

  it("un POST se reintenta si se pide expresamente", async () => {
    let llamadas = 0;
    const http = crear({
      fetchImpl: async () => (++llamadas === 1 ? json({}, 503) : json({ ok: true })),
    });

    await http.post("/x", {}, { reintentos: 1 });

    expect(llamadas).toBe(2);
  });

  it("un error 4xx no se reintenta", async () => {
    let llamadas = 0;
    const http = crear({
      fetchImpl: async () => {
        llamadas++;
        return json({ title: "No encontrado" }, 404);
      },
    });

    const error = await capturar(http.get("/x"));

    expect(llamadas).toBe(1);
    expect((error as ApiError).esNoEncontrado).toBe(true);
  });
});

describe("renovación de sesión", () => {
  const conToken = (token: string) => (init?: RequestInit) =>
    (init?.headers as Record<string, string>).Authorization === `Bearer ${token}`;

  it("ante un 401 renueva una sola vez aunque haya varias llamadas a la vez", async () => {
    let renovaciones = 0;
    const http = crear({
      obtenerToken: () => "viejo",
      renovarSesion: async () => {
        renovaciones++;
        await new Promise((r) => setTimeout(r, 10));
        return "nuevo";
      },
      fetchImpl: async (_url, init) =>
        conToken("nuevo")(init) ? json({ ok: true }) : json({ title: "x" }, 401),
    });

    const [a, b] = await Promise.all([
      http.get<{ ok: boolean }>("/a"),
      http.get<{ ok: boolean }>("/b"),
    ]);

    expect(a.ok && b.ok).toBe(true);
    expect(renovaciones).toBe(1);
  });

  it("si no se pudo renovar, devuelve el 401", async () => {
    const http = crear({
      obtenerToken: () => "viejo",
      renovarSesion: async () => null,
      fetchImpl: async () => json({ title: "No autorizado" }, 401),
    });

    const error = await capturar(http.get("/x"));

    expect((error as ApiError).esNoAutorizado).toBe(true);
  });

  it("con sinRenovacion no intenta renovar", async () => {
    let renovaciones = 0;
    const http = crear({
      renovarSesion: async () => {
        renovaciones++;
        return "nuevo";
      },
      fetchImpl: async () => json({ title: "No autorizado" }, 401),
    });

    await capturar(http.post("/api/auth/login", {}, { sinRenovacion: true }));

    expect(renovaciones).toBe(0);
  });
});

describe("respuestas que no son JSON", () => {
  it("un 200 con HTML se informa como respuesta inválida", async () => {
    const http = crear({
      fetchImpl: async () =>
        new Response("<html>portal</html>", { headers: { "Content-Type": "text/html" } }),
    });

    const error = await capturar(http.get("/x"));

    expect((error as ApiError).esRespuestaInvalida).toBe(true);
  });

  it("un 502 con página HTML se informa como error de servidor", async () => {
    const http = crear({ fetchImpl: async () => html(502) });

    const error = await capturar(http.get("/x"));

    expect((error as ApiError).status).toBe(502);
    expect((error as ApiError).esErrorDeServidor).toBe(true);
    expect((error as ApiError).message).toContain("no está disponible");
  });
});

describe("validación de respuestas", () => {
  const esquema = z.object({ id: z.number() });

  it("en modo error rechaza una respuesta que no cumple el esquema", async () => {
    const http = crear({
      validacion: "error",
      fetchImpl: async () => json({ id: "no-es-numero" }),
    });

    const error = await capturar(http.get("/x", { esquema }));

    expect((error as ApiError).esRespuestaInvalida).toBe(true);
    expect((error as ApiError).erroresPorCampo.id).toBeDefined();
  });

  it("en modo advertencia avisa y devuelve los datos tal cual", async () => {
    const aviso = vi.spyOn(console, "warn").mockImplementation(() => {});
    const http = crear({
      validacion: "advertencia",
      fetchImpl: async () => json({ id: "no-es-numero" }),
    });

    const datos = await http.get<unknown>("/x", { esquema });

    expect(datos).toEqual({ id: "no-es-numero" });
    expect(aviso).toHaveBeenCalledOnce();
  });

  it("devuelve los datos ya validados cuando cumplen el esquema", async () => {
    const http = crear({ fetchImpl: async () => json({ id: 7, extra: "se descarta" }) });

    expect(await http.get("/x", { esquema })).toEqual({ id: 7 });
  });
});
