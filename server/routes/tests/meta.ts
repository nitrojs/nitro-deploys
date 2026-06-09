import { version } from "nitro/meta";
import { defineTestHandler } from "../../utils/test";

export default defineTestHandler(
  "meta",
  () => ({ version }),
  async ({ assert, log }) => {
    const res = await fetch("").then((r) => r.json());
    log(`Nitro version: ${res.version}`);
    assert(
      typeof res.version === "string" && res.version.length > 0,
      `Expected non-empty version string, got: ${res.version}`,
    );
    assert(/^\d+\.\d+\.\d+/.test(res.version), `Expected semver-like version, got: ${res.version}`);
  },
);
