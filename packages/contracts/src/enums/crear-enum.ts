/** Crea un objeto { A: "A", B: "B" } a partir de una lista de valores. */
export const crearEnum = <const T extends readonly string[]>(valores: T) =>
  Object.fromEntries(valores.map((v) => [v, v])) as { [K in T[number]]: K };
