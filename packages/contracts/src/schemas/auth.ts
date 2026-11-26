import { z } from "zod";
import type { RegistroRequest } from "../types";

export const loginSchema = z.object({
  correo: z.email("Escribe un correo válido."),
  contrasena: z.string().min(8, "La contraseña debe tener al menos 8 caracteres."),
});
export type LoginInput = z.infer<typeof loginSchema>;

export const contrasenaNuevaSchema = z
  .string()
  .min(8, "La contraseña debe tener al menos 8 caracteres.")
  .max(50, "La contraseña es demasiado larga.")
  .regex(/\p{L}/u, "La contraseña debe incluir al menos una letra.")
  .regex(/[0-9]/, "La contraseña debe incluir al menos un número.");

export const solicitarRecuperacionSchema = z.object({
  correo: z.email("Escribe un correo válido.").max(254, "El correo es demasiado largo."),
});
export type SolicitarRecuperacionInput = z.infer<typeof solicitarRecuperacionSchema>;

export const restablecerContrasenaSchema = z
  .object({
    token: z.string().min(1, "El enlace de recuperación no es válido."),
    contrasena: contrasenaNuevaSchema,
    confirmarContrasena: z.string().min(1, "Confirma la nueva contraseña."),
  })
  .refine((datos) => datos.contrasena === datos.confirmarContrasena, {
    path: ["confirmarContrasena"],
    message: "Las contraseñas no coinciden.",
  });
export type RestablecerContrasenaInput = z.infer<typeof restablecerContrasenaSchema>;

export const registroSchema = z
  .object({
    correo: z.email("Escribe un correo válido.").max(254, "El correo es demasiado largo."),
    contrasena: contrasenaNuevaSchema,
    confirmarContrasena: z.string().min(1, "Repite la contraseña."),
    nombres: z.string().trim().min(1, "Los nombres son obligatorios.").max(20, "Demasiado largo."),
    apellidos: z
      .string()
      .trim()
      .min(1, "Los apellidos son obligatorios.")
      .max(50, "Demasiado largo."),
    provinciaId: z.guid("Selecciona una provincia."),
    municipioId: z.guid("Selecciona un municipio."),
  })
  .refine((datos) => datos.contrasena === datos.confirmarContrasena, {
    path: ["confirmarContrasena"],
    message: "Las contraseñas no coinciden.",
  });
export type RegistroInput = z.infer<typeof registroSchema>;

export function aRegistroRequest(datos: RegistroInput): RegistroRequest {
  return {
    correo: datos.correo,
    contrasena: datos.contrasena,
    nombres: datos.nombres,
    apellidos: datos.apellidos,
    provinciaId: datos.provinciaId,
    municipioId: datos.municipioId,
  };
}
