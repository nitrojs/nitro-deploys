import { defineConfig } from "vite";
import { nitro } from "nitro/vite";

console.log(process.env);

export default defineConfig({
  plugins: [nitro()],
  nitro: {
    preset: "edgeone-pages",
    serveStatic: false,
    output: {
      publicDir: "{{ output.dir }}/assets/{{ baseURL }}",
    },
  },
});
