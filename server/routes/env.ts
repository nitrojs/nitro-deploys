import { eventHandler } from "nitro/h3";

export default eventHandler(() => {
  return {
    "process.env": safeObj(process.env as any),
    "process.env.TEST": process.env.TEST,
    // runtimeConfig: safeObj(useRuntimeConfig()),
  };
});

const tokenRe = /password|token|key|secret/i;

function safeObj(env: Record<string, string> = {}) {
  return Object.fromEntries(
    Object.entries(env).filter(([key]) => !tokenRe.test(key)),
  );
}
