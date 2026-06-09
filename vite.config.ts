import { defineConfig } from "vite";
import { nitro } from "nitro/vite";

export default defineConfig({
  base: "/base",
  plugins: [nitro()],
});
