import { defineEventHandler, getRequestHeaders } from "h3";

export default defineEventHandler((event) => ({
  headers: [getRequestHeaders(event)],
}));
