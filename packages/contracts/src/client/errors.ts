export interface ProblemDetails {
  type?: string;
  title?: string;
  status?: number;
  detail?: string;
  traceId?: string;
  errors?: Record<string, string[]>;
}

export type CausaError = "http" | "red" | "timeout" | "respuesta-invalida";

export class ApiError extends Error {
  readonly status: number;
  readonly problema: ProblemDetails;
  readonly causa: CausaError;

  constructor(status: number, problema: ProblemDetails = {}, causa: CausaError = "http") {
    super(problema.detail ?? problema.title ?? "Error de API");
    this.name = "ApiError";
    this.status = status;
    this.problema = problema;
    this.causa = causa;
  }

  get erroresPorCampo(): Record<string, string[]> {
    return this.problema.errors ?? {};
  }

  get traceId(): string | undefined {
    return this.problema.traceId;
  }

  get esErrorDeRed(): boolean {
    return this.causa === "red" || this.causa === "timeout";
  }
  get esTimeout(): boolean {
    return this.causa === "timeout";
  }
  get esRespuestaInvalida(): boolean {
    return this.causa === "respuesta-invalida";
  }
  get esNoAutorizado(): boolean {
    return this.status === 401;
  }
  get esProhibido(): boolean {
    return this.status === 403;
  }
  get esNoEncontrado(): boolean {
    return this.status === 404;
  }
  get esConflicto(): boolean {
    return this.status === 409;
  }
  get esErrorDeServidor(): boolean {
    return this.status >= 500;
  }
}

export function esApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}
