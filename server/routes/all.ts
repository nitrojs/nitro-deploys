import { deployments } from "./index";

const { baseURL } = useRuntimeConfig().app;

const getURL = (p) => baseURL + p.replace(/^\//, "");

export default defineEventHandler(() => {
  return /* html */ `<!doctype html>
  <html lang="en">

  <head>
    <meta charset="utf-8" />
    <title>Nitro Test Deployments</title>
    <link rel="icon" href="/nitro.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <script src="${getURL("/_dist/tailwind@3.4.5.js")}"></script>
  </head>
  <body class="bg-neutral-900">
    <div class="grid grid-cols-3 h-screen">
    ${deployments
      .filter((deployment) => deployment.url && !deployment.broken)
      .map(
        (deployment) => /* html */ `
      <div class="border-t border-gray-200 text-white relative">
        <a class="absolute top-2 right-5 p-1 text-xs bg-purple-500 shadow-lg rounded-lg" href="${deployment.url}">${deployment.name}</a>
        <iframe src="${deployment.url}?stats" class="w-full h-full"></iframe>
      </div>
    `,
      )
      .join("")}
  </div>


  </body>
  </html>
  `;
});
