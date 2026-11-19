import { describe, expect, it } from "vitest";
import { construirQuery } from "./query";

describe("construirQuery", () => {
  it("serializa los parámetros de un listado", () => {
    expect(construirQuery({ pagina: 2, tamanoPagina: 20, busqueda: "para cetamol" })).toBe(
      "?pagina=2&tamanoPagina=20&busqueda=para+cetamol",
    );
  });

  it("omite los valores vacíos pero conserva false y 0", () => {
    expect(construirQuery({ a: undefined, b: null, c: "", d: false, e: 0 })).toBe("?d=false&e=0");
  });

  it("repite la clave para los arrays", () => {
    expect(construirQuery({ estado: ["ACTIVA", "INACTIVA"] })).toBe(
      "?estado=ACTIVA&estado=INACTIVA",
    );
  });

  it("serializa las fechas en ISO", () => {
    expect(construirQuery({ desde: new Date("2026-11-01T00:00:00Z") })).toBe(
      "?desde=2026-11-01T00%3A00%3A00.000Z",
    );
  });

  it("devuelve una cadena vacía si no hay parámetros", () => {
    expect(construirQuery({})).toBe("");
  });
});
