import { defineConfig } from "vite";
import { nitro } from "nitro/vite";

console.log(process.env)

export default defineConfig({
  plugins: [nitro()],
  nitro: {
    preset: "edgeone-pages",
        output: {
      dir: "{{ rootDir }}/.edgeone",
      serverDir: "{{ output.dir }}/cloud-functions/ssr-node",
      publicDir: "{{ output.dir }}/assets/{{ baseURL }}",
    },
  }
});
