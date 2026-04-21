import { defineEventHandler } from "nitro/h3";

export default defineEventHandler((event) => {
  return event.context.basicAuth?.username ?? "no-auth";
});
