import { defineTestHandler } from "../../utils/test";

// https://github.com/nitrojs/nitro/issues/1721
export default defineTestHandler(
  "api",
  async (_event) => {
    return "Hello, world!";
  },
  async ({ assert }) => {
    const res = await fetch("").then((res) => res.text());
    assert(res === "Hello, world!", `Unexpected response: ${res}`);
  },
);
