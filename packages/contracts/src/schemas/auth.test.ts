import { describe, expect, it } from "vitest";
import { aRegistroRequest, loginSchema, registroSchema } from "./auth";

const valido = {
  correo: "ana@abasto.cu",
  contrasena: "Clave1234",
  confirmarContrasena: "Clave1234",
  nombres: "Ana",
  apellidos: "Pérez",
  provinciaId: "10000000-0000-0000-0000-000000000001",
  municipioId: "20000000-0000-0000-0000-000000000001",
};

describe("registroSchema", () => {
  it("acepta datos válidos, incluidos los IDs del seed", () => {
    expect(registroSchema.safeParse(valido).success).toBe(true);
  });

  it("rechaza contraseñas sin letras o sin números", () => {
    expect(
      registroSchema.safeParse({
        ...valido,
        contrasena: "12345678",
        confirmarContrasena: "12345678",
      }).success,
    ).toBe(false);
    expect(
      registroSchema.safeParse({
        ...valido,
        contrasena: "abcdefgh",
        confirmarContrasena: "abcdefgh",
      }).success,
    ).toBe(false);
  });

  it("exige que las contraseñas coincidan", () => {
    const resultado = registroSchema.safeParse({ ...valido, confirmarContrasena: "Otra1234" });

    expect(resultado.success).toBe(false);
    if (!resultado.success)
      expect(resultado.error.issues[0]?.path).toEqual(["confirmarContrasena"]);
  });

  it("exige elegir provincia y municipio", () => {
    expect(registroSchema.safeParse({ ...valido, provinciaId: "" }).success).toBe(false);
    expect(registroSchema.safeParse({ ...valido, municipioId: "" }).success).toBe(false);
  });

  it("aRegistroRequest no incluye la confirmación de contraseña", () => {
    const datos = registroSchema.parse(valido);

    expect(aRegistroRequest(datos)).not.toHaveProperty("confirmarContrasena");
  });
});

describe("loginSchema", () => {
  it("exige correo válido y contraseña", () => {
    expect(loginSchema.safeParse({ correo: "ana@abasto.cu", contrasena: "x" }).success).toBe(true);
    expect(loginSchema.safeParse({ correo: "no-es-correo", contrasena: "x" }).success).toBe(false);
    expect(loginSchema.safeParse({ correo: "ana@abasto.cu", contrasena: "" }).success).toBe(false);
  });
});
