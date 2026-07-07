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

    // RFC 10008 §3 / §2.3: advertise QUERY support and point at a cacheable
    // result resource. Lets the client verify response headers pass through.
    event.res.headers.set("accept-query", "application/json");
    event.res.headers.set("content-location", event.url.pathname + event.url.search);

    return {
      method: event.req.method,
      // RFC 10008 §2: Content-Type is mandatory and describes the body.
      contentType: event.req.headers.get("content-type"),
      // URL search params must survive alongside the body.
      params: Object.fromEntries(event.url.searchParams),
      echo: body,
    };
  },
  async ({ assert }) => {
    const res = await fetch("?table=users&limit=10", {
      method: "QUERY",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ sql: "select * from nitro" }),
    });

    assert(res.ok, `Unexpected status: ${res.status}`);

    // Response headers round-trip to the client (RFC 10008 §2.3, §3).
    assert(
      res.headers.get("accept-query") === "application/json",
      `Unexpected Accept-Query: ${res.headers.get("accept-query")}`,
    );
    assert(
      (res.headers.get("content-location") || "").includes("table=users"),
      `Unexpected Content-Location: ${res.headers.get("content-location")}`,
    );

    const data = await res.json();
    assert(data.method === "QUERY", `Unexpected method: ${data.method}`);

    // Request header round-trip (server saw the mandatory Content-Type).
    assert(
      (data.contentType || "").includes("application/json"),
      `Unexpected request content-type: ${data.contentType}`,
    );

    // URL search params round-trip alongside the body.
    assert(data.params.table === "users", `Unexpected table param: ${data.params.table}`);
    assert(data.params.limit === "10", `Unexpected limit param: ${data.params.limit}`);

    // Body round-trip.
    assert(
      data.echo?.sql === "select * from nitro",
      `Unexpected echo: ${JSON.stringify(data.echo)}`,
    );
  },
  "server/handlers/query.ts",
);
