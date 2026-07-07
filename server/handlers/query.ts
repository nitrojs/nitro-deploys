import { defineTestHandler } from "../utils/test";

// RFC 10008 — The HTTP QUERY method: https://datatracker.ietf.org/doc/rfc10008/
//
// File-based routing only understands the standard method suffixes
// (`.get`, `.post`, ...), so there is no `.query.ts`. This handler therefore
// lives outside the scanned `routes/` dir and is registered manually with an
// explicit `method: "QUERY"` in `nitro.config.ts`.
export default defineTestHandler(
  "query",
  async (event) => {
    // A QUERY request carries content (like POST) but is safe & idempotent.
    const body = await event.req.json();
    return { method: event.req.method, echo: body };
  },
  async ({ assert }) => {
    const res = await fetch("", {
      method: "QUERY",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ sql: "select * from nitro" }),
    }).then((r) => r.json());
    assert(res.method === "QUERY", `Unexpected method: ${res.method}`);
    assert(res.echo?.sql === "select * from nitro", `Unexpected echo: ${JSON.stringify(res.echo)}`);
  },
  "server/handlers/query.ts",
);
