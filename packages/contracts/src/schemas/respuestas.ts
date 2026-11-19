import { z } from "zod";
import { EstadoUsuario, RolUsuario } from "../enums";

const id = z.guid();
const idOpcional = z.guid().nullable();
const fechaIso = z.iso.datetime({ offset: true });

export const provinciaDtoSchema = z.object({
  id,
  nombre: z.string(),
  codigo: z.string(),
});
export type ProvinciaDto = z.infer<typeof provinciaDtoSchema>;

export const municipioDtoSchema = z.object({
  id,
  provinciaId: id,
  nombre: z.string(),
  codigo: z.string(),
});
export type MunicipioDto = z.infer<typeof municipioDtoSchema>;

export const provinciasSchema = z.array(provinciaDtoSchema);
export const municipiosSchema = z.array(municipioDtoSchema);

export const usuarioSesionDtoSchema = z.object({
  id,
  correo: z.string(),
  nombres: z.string(),
  apellidos: z.string(),
  rol: z.enum(RolUsuario),
  provinciaId: idOpcional,
  municipioId: idOpcional,
  farmaciaId: idOpcional,
  almacenId: idOpcional,
});
export type UsuarioSesionDto = z.infer<typeof usuarioSesionDtoSchema>;

export const authRespuestaSchema = z.object({
  accessToken: z.string(),
  accessTokenExpiraEn: fechaIso,
  refreshToken: z.string(),
  usuario: usuarioSesionDtoSchema,
});
export type AuthRespuesta = z.infer<typeof authRespuestaSchema>;

export const registroRespuestaSchema = z.object({
  usuarioId: id,
  requiereVerificacion: z.boolean(),
});
export type RegistroRespuesta = z.infer<typeof registroRespuestaSchema>;

export const sesionActualDtoSchema = z.object({
  id: idOpcional,
  correo: z.string().nullable(),
  rol: z.enum(RolUsuario).nullable(),
  farmaciaId: idOpcional,
  almacenId: idOpcional,
  municipioId: idOpcional,
});
export type SesionActualDto = z.infer<typeof sesionActualDtoSchema>;

export const usuarioAdminDtoSchema = z.object({
  id,
  correo: z.string(),
  nombres: z.string(),
  apellidos: z.string(),
  rol: z.enum(RolUsuario),
  estado: z.enum(EstadoUsuario),
  farmaciaId: idOpcional,
  almacenId: idOpcional,
  municipioId: idOpcional,
});
export type UsuarioAdminDto = z.infer<typeof usuarioAdminDtoSchema>;
