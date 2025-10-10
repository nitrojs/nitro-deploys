import { defineEventHandler, getRequestHeaders } from "nitro/h3";

export default defineEventHandler((event) => ({
  headers: [getRequestHeaders(event)],
}));
