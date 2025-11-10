import nodeAsyncHooks from "node:async_hooks";
import nodeCrypto from "node:crypto";
import nodePerfHooks from "node:perf_hooks";
import nodeEvents from "node:events";
import { eventHandler } from "nitro/h3";

const nodeCompatTests = {
  globals: {
    // eslint-disable-next-line unicorn/prefer-global-this
    global: () => global === globalThis.global,
    // eslint-disable-next-line unicorn/prefer-global-this
    process: () => process && globalThis.process && global.process,
    Buffer: () => Buffer.from("hello").toString("hex") === "68656c6c6f",
    BroadcastChannel: () => new BroadcastChannel("test"),
    PerformanceObserver: () => new PerformanceObserver(() => {}),
    performance: () => performance.now() > 0,
  },
  crypto: {
    createHash: () => {
      return nodeCrypto
        .createHash("sha256")
        .update("hello")
        .digest("hex")
        .startsWith("2cf24");
    },
  },
  perf_hooks: {
    performance: () => nodePerfHooks.performance.now() > 0,
    PerformanceObserver: () => new nodePerfHooks.PerformanceObserver(() => {}),
  },
  events: {
    EventEmitter: () => {
      const emitter = new nodeEvents.EventEmitter();
      return new Promise<boolean>((resolve) => {
        emitter.on("test", () => resolve(true));
        emitter.emit("test");
      });
    },
  },
  async_hooks: {
    AsyncLocalStorage: async () => {
      const ctx = new nodeAsyncHooks.AsyncLocalStorage();
      const rand = Math.random();
      return ctx.run(rand, async () => {
        await new Promise<void>((r) => r());
        if (ctx.getStore() !== rand) {
          return false;
        }
        return true;
      });
    },
  },
};

export default eventHandler(async (event) => {
  const results: Record<string, boolean> = {};
  for (const [group, groupTests] of Object.entries(nodeCompatTests)) {
    for (const [name, test] of Object.entries(groupTests)) {
      results[`${group}:${name}`] = await testFn(test);
    }
  }
  if (event.path.includes("json")) {
    return new Response(JSON.stringify(results, undefined, 2), {
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  return new Response(
    /*html*/ `<html><head><title>Node.js Compatibility Tests</title>
    <style>
      table { width: 100%; border-collapse: collapse; }
      th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
      th { background-color: #f2f2f2; }
    </style>
    </head><body>
    <h1>Node.js Compatibility Tests</h1>
    <table>
      <thead>
        <tr>
          <th>Group</th>
          <th>Test</th>
          <th>Result</th>
        </tr>
      </thead>
      <tbody>
        ${Object.entries(results)
          .map(
            ([key, value]) =>
              `<tr><td>${key.split(":")[0]}</td><td>${key.split(":")[1]}</td><td>${
                value ? "✅" : "❌"
              }</td></tr>`,
          )
          .join("")}
      </tbody>
    </table>
  `,
    {
      headers: {
        "Content-Type": "text/html",
      },
    },
  );
});

async function testFn(fn: () => any) {
  try {
    return !!(await fn());
  } catch (error) {
    console.error(error);
    return false;
  }
}
