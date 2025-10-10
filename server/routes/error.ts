import { defineEventHandler, createError } from "h3";

export default defineEventHandler(() => {
  throw createError({
    statusMessage: "Intentionally broken",
    statusCode: 500,
    unhandled: true, // Force logging
    cause: new Error("This is a test error"),
  });
});
