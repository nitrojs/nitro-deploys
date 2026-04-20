import { defineTestHandler } from "../../utils/test";

// Route rule in nitro.config.ts sets multiple response headers on this path
// to exercise name/value edge cases that should work across all providers.
export default defineTestHandler(
  "headers",
  () => "OK",
  async ({ assert, log }) => {
    const res = await fetch("");

    const cases: Array<[string, string]> = [
      // Baseline ASCII
      ["x-nitro-test", "hello"],
      // Dots, dashes, digits in the name
      ["x-nitro.test-2", "dotted"],
      // Internal spaces in value (legal per RFC 9110)
      ["x-nitro-spaced", "hello world from nitro"],
      // Long value (1 KB)
      ["x-nitro-long", "a".repeat(1024)],
      // Special-but-legal tchars in value
      ["x-nitro-special", "a!#$%&'*+-.^_`|~b"],
      // Numeric-like value
      ["x-nitro-num", "42"],
    ];

    for (const [name, expected] of cases) {
      const actual = res.headers.get(name);
      log(`${name}: ${actual}`);
      assert(actual === expected, `Expected ${name}=${expected}, got: ${actual}`);
    }

    // Case-insensitive lookup must work regardless of how the runtime preserves case.
    assert(
      res.headers.get("X-NITRO-TEST") === "hello",
      "Expected case-insensitive header lookup to work",
    );
  },
);
