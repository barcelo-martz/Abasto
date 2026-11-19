type ValorQuery = string | number | boolean | Date | null | undefined;

type ParametrosQuery = Record<string, ValorQuery | readonly ValorQuery[]>;

export function construirQuery(parametros: ParametrosQuery): string {
  const query = new URLSearchParams();

  for (const [clave, valor] of Object.entries(parametros)) {
    const valores = Array.isArray(valor) ? valor : [valor];

    for (const elemento of valores) {
      if (elemento === undefined || elemento === null || elemento === "") {
        continue;
      }

      let texto: string;

      if (elemento instanceof Date) {
        if (Number.isNaN(elemento.getTime())) {
          throw new TypeError(`La fecha del parámetro "${clave}" no es válida.`);
        }

        texto = elemento.toISOString();
      } else if (typeof elemento === "number") {
        if (!Number.isFinite(elemento)) {
          throw new TypeError(`El parámetro "${clave}" debe ser un número finito.`);
        }

        texto = String(elemento);
      } else {
        texto = String(elemento);
      }

      query.append(clave, texto);
    }
  }

  const resultado = query.toString();

  return resultado ? `?${resultado}` : "";
}
