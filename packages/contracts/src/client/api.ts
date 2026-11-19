import {
  authRespuestaSchema,
  municipiosSchema,
  provinciasSchema,
  registroRespuestaSchema,
  sesionActualDtoSchema,
  usuarioAdminDtoSchema,
  type AuthRespuesta,
  type MunicipioDto,
  type ProvinciaDto,
  type RegistroRespuesta,
  type SesionActualDto,
  type UsuarioAdminDto,
} from "../schemas";
import type {
  CrearUsuarioPanelRequest,
  LoginRequest,
  RefreshRequest,
  RegistroRequest,
  VerificarCorreoRequest,
} from "../types";
import type { ClienteHttp, OpcionesBasicas } from "./http";

const sinSesion = { sinRenovacion: true } as const;

export function crearApi(http: ClienteHttp) {
  return {
    auth: {
      registro: (datos: RegistroRequest, o?: OpcionesBasicas) =>
        http.post<RegistroRespuesta>("/api/auth/register", datos, {
          ...o,
          ...sinSesion,
          esquema: registroRespuestaSchema,
        }),
      verificarCorreo: (datos: VerificarCorreoRequest, o?: OpcionesBasicas) =>
        http.post<void>("/api/auth/verify-email", datos, { ...o, ...sinSesion }),
      login: (datos: LoginRequest, o?: OpcionesBasicas) =>
        http.post<AuthRespuesta>("/api/auth/login", datos, {
          ...o,
          ...sinSesion,
          esquema: authRespuestaSchema,
        }),
      refresh: (datos: RefreshRequest, o?: OpcionesBasicas) =>
        http.post<AuthRespuesta>("/api/auth/refresh", datos, {
          ...o,
          ...sinSesion,
          esquema: authRespuestaSchema,
        }),
      logout: (datos: RefreshRequest, o?: OpcionesBasicas) =>
        http.post<void>("/api/auth/logout", datos, { ...o, ...sinSesion }),
      yo: (o?: OpcionesBasicas) =>
        http.get<SesionActualDto>("/api/auth/me", { ...o, esquema: sesionActualDtoSchema }),
    },
    territorio: {
      provincias: (o?: OpcionesBasicas) =>
        http.get<ProvinciaDto[]>("/api/provinces", { ...o, esquema: provinciasSchema }),
      municipios: (provinciaId: string, o?: OpcionesBasicas) =>
        http.get<MunicipioDto[]>(
          `/api/provinces/${encodeURIComponent(provinciaId)}/municipalities`,
          {
            ...o,
            esquema: municipiosSchema,
          },
        ),
    },
    admin: {
      crearUsuario: (datos: CrearUsuarioPanelRequest, o?: OpcionesBasicas) =>
        http.post<UsuarioAdminDto>("/api/admin/users", datos, {
          ...o,
          esquema: usuarioAdminDtoSchema,
        }),
    },
  };
}

export type AbastoApi = ReturnType<typeof crearApi>;
