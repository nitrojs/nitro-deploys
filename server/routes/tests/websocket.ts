import { defineTestHandler } from "../../utils/test";

export default defineTestHandler(
  "websocket",
  async (_event) => {
    return "Open this route in a browser to run the WebSocket test.";
  },
  async ({ assert, log }) => {
    // The `_ws` handler lives next to this test, under the same baseURL.
    const base = location.pathname.replace(/\/tests\/websocket\/?$/, "");
    const protocol = location.protocol === "https:" ? "wss://" : "ws://";
    const query = "foo=bar&hello=world";
    const url = `${protocol}${location.host}${base}/_ws?${query}`;

    // Measure how long a step takes and log it with a `123.4 ms` suffix.
    const timings: Record<string, number> = {};
    const time = async <T>(name: string, fn: () => Promise<T>): Promise<T> => {
      const start = performance.now();
      const result = await fn();
      const ms = performance.now() - start;
      timings[name] = ms;
      log(`${name}: ${ms.toFixed(1)} ms`);
      return result;
    };

    log("Connecting to " + url);
    const ws = new WebSocket(url);

    // Queue incoming messages so each request can await the matching reply.
    const inbox: string[] = [];
    const waiters: Array<(value: string) => void> = [];
    ws.addEventListener("message", async (event) => {
      const text = typeof event.data === "string" ? event.data : await event.data.text();
      const waiter = waiters.shift();
      if (waiter) waiter(text);
      else inbox.push(text);
    });

    const send = (message: string) => {
      const reply = new Promise<string>((resolve, reject) => {
        const timeout = setTimeout(
          () => reject(new Error(`Timeout waiting for reply to "${message}"`)),
          5000,
        );
        const queued = inbox.shift();
        const settle = (value: string) => {
          clearTimeout(timeout);
          resolve(value);
        };
        if (queued !== undefined) settle(queued);
        else waiters.push(settle);
      });
      ws.send(message);
      return reply;
    };

    await time(
      "connect",
      () =>
        new Promise<void>((resolve, reject) => {
          ws.addEventListener("open", () => resolve());
          ws.addEventListener("error", () => reject(new Error("WebSocket error")));
        }),
    );

    // 1. ping/pong
    const pong = await time("ping", () => send("ping"));
    assert(pong === "pong", `Unexpected ping response: ${pong}`);

    // 2. query params round-trip
    const paramsRaw = await time("params", () => send("params"));
    const params = JSON.parse(paramsRaw);
    assert(params.foo === "bar", `Unexpected foo param: ${params.foo}`);
    assert(params.hello === "world", `Unexpected hello param: ${params.hello}`);

    const total = Object.values(timings).reduce((a, b) => a + b, 0);
    log(`total: ${total.toFixed(1)} ms`);

    ws.close();
  },
);
