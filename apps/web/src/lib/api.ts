import { crearApi, crearClienteHttp } from "@abasto/contracts";

const http = crearClienteHttp({
  baseUrl: process.env.API_URL ?? "http://localhost:5239",
});

export const api = crearApi(http);
