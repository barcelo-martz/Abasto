import { describe, expect, it } from "vitest";
import { paginaSchema } from "./listados";
import { authRespuestaSchema, provinciaDtoSchema } from "./respuestas";

const sesion = {
  accessToken: "a",
  accessTokenExpiraEn: "2026-11-18T13:21:40.1234567Z",
  refreshToken: "r",
  usuario: {
    id: "01a1e06b-612a-77c2-a072-f05faab5edeb",
    correo: "admin@abasto.cu",
    nombres: "Administrador",
    apellidos: "del sistema",
    rol: "ADMINISTRADOR",
    provinciaId: null,
    municipioId: null,
    farmaciaId: null,
    almacenId: null,
  },
};

describe("esquemas de respuesta", () => {
  it("aceptan una sesión como la que devuelve la API", () => {
    expect(authRespuestaSchema.safeParse(sesion).success).toBe(true);
  });

  it("rechazan un rol desconocido", () => {
    const rara = { ...sesion, usuario: { ...sesion.usuario, rol: "SUPERUSUARIO" } };

    expect(authRespuestaSchema.safeParse(rara).success).toBe(false);
  });

  it("rechazan una sesión a la que le falta el token", () => {
    const { ...incompleta } = sesion;

    expect(authRespuestaSchema.safeParse(incompleta).success).toBe(false);
  });

  it("aceptan los IDs del seed", () => {
    const provincia = {
      id: "10000000-0000-0000-0000-000000000001",
      nombre: "La Habana",
      codigo: "LHA",
    };

    expect(provinciaDtoSchema.safeParse(provincia).success).toBe(true);
  });

  it("paginaSchema valida una página de resultados", () => {
    const esquema = paginaSchema(provinciaDtoSchema);
    const pagina = {
      items: [{ id: "10000000-0000-0000-0000-000000000001", nombre: "La Habana", codigo: "LHA" }],
      total: 1,
      pagina: 1,
      tamanoPagina: 20,
      totalPaginas: 1,
    };

    expect(esquema.safeParse(pagina).success).toBe(true);
    expect(esquema.safeParse({ ...pagina, total: -1 }).success).toBe(false);
  });
});
