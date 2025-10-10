import { defineEventHandler, html } from "nitro/h3";
import { deployments as _deployments } from "../../deployments";

const baseURL = "/";

const withBase = (p) => baseURL + p.replace(/^\//, "");

const tests = ["api", "form-data", "multipart-form-data", "sourcemap"];

const manualTests = ["env", "node-compat", "headers"];

export const deployments = [..._deployments];
if (import.meta.dev) {
  deployments.unshift({
    name: "dev",
    url: "http://localhost:3000/",
    dash: "",
    docs: "",
  });
}

const nitroVersion = "3.0.0-alpha"; // useRuntimeConfig().nitroVersion;
const commitHash = nitroVersion.split(".").pop();
const version = nitroVersion.split("-")[0];
const gitURL = `https://github.com/nitrojs/nitro/tree/${commitHash || `v${version}`}`;

export default defineEventHandler((event) => {
  const url = event.url;
  const currentDeployment =
    deployments.find((d) => d.url.includes(url.host)) ||
    ({
      name: url.hostname + ` (unknown)`,
    } as (typeof deployments)[number]);

  const stats = html`
    <table id="perf" class="table-auto" style="color: white"></table>
    <script>
      const perfNavTiming =
        window.performance.getEntriesByType("navigation")[0];
      const renderPerfStats = () => {
        const measure = (end, start) => {
          const diff = end - start;
          return diff >= 0 ? Math.round(diff * 1000) / 1000 + " ms" : "-";
        };
        console.log(perfNavTiming.duration);
        const measures = {
          Protocol: perfNavTiming.nextHopProtocol,
          Transfer: perfNavTiming.transferSize + " bytes",
          Request: measure(
            perfNavTiming.responseEnd,
            perfNavTiming.requestStart,
          ),
          Duration: measure(perfNavTiming.duration, 0),
        };
        document.querySelector("#perf").innerHTML = Object.entries(measures)
          .map(
            ([name, value]) =>
              "<tr><td>" + name + ": " + "</td><td>" + value + "</td></tr>",
          )
          .join("");
      };
      renderPerfStats();
      const int = setInterval(() => {
        if (perfNavTiming.loadEventEnd) {
          clearInterval(int);
          renderPerfStats();
        }
      });
    </script>
  `;

  if (url.searchParams.has("stats")) {
    return stats;
  }

  return html`<!doctype html>
  <html lang="en">

  <head>
    <meta charset="utf-8" />
    <title>Nitro Test Deployment</title>
    <link rel="icon" href="${withBase("/nitro.svg")}" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <script src="${withBase("/_dist/tailwind@3.4.5.js")}"></script>
  </head>

  <body class="bg-neutral-900">
    <div class="flex justify-center items-center h-screen">
      <div class="border border-gray-200 text-white p-8 rounded-lg max-w-lg">
        <!-- Title -->
        <h1 class="flex items-center mb-4">
          <img src="${withBase("/nitro.svg")}" class="w-8 h-8 mr-4" />
          <div>
            <a class="text-3xl font-bold" href="${currentDeployment.url + baseURL.slice(1)}">Nitro Test Deployment</a>
            <br>
            <a class="text-xl underline" href="${currentDeployment.docs}">${currentDeployment.name}</a>
          </div>
        </h1>

        <!-- Perf -->
        <div class="mb-3 pt-3">
          ${stats}
        </div>

        <!-- Tests -->
        <div class="mb-3 border-t-1">
          <ul style="list-style: circle">
            ${tests
              .map(
                (test) => /* html */ ` <li id="tests-${test}">
                <span id="tests-${test}-status">.</span>
              <a href="${withBase("/tests/" + test)}" class="underline">${test}</a>
            </li>`,
              )
              .join("\n")}
          </ul>
        </div>

        <!-- Manual tests -->
        <div class="mb-3 border-t-1">
          <ul style="list-style: circle">
            ${manualTests
              .map(
                (link) => /* html */ ` <li>
              <a href="${withBase(link)}" class="underline">${link}</a>
            </li>`,
              )
              .join("\n")}
          </ul>
        </div>

        <!-- Footer -->
        <div class="mt-3 pt-3">
          <!-- Deployment -->
          <div>
            <select onchange="window.location.href=this.value" id="countries"
              class="mt-4 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
              ${deployments
                .map((d) =>
                  d.url && !d.broken
                    ? /* html */ ` <option value="${d.url + baseURL.slice(1)}" ${d.url === currentDeployment.url ? "selected" : ""}>${d.name}</option>`
                    : /* html */ `<option disabled>${d.name}</option>`,
                )
                .join("\n")}
            </select>
          </div>
          <div class="mt-2 pt-4">
          <p class="text-xs text-gray-100">Generated at ${new Date().toUTCString()}</p>
            <p class="text-xs">
              <a href="${gitURL}" class="underline" target="_blank" rel="noopener">Nitro<span
                class="text-gray-200">@3.0.0-nightly</span>
                </a>
            </p>
            <p class="text-xs">
              <a href="https://github.com/nitrojs/nitro-deploys" class="underline" target="_blank" rel="noopener">source code</a>
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>

  </body>

  <script type="module">
    const tests = ${JSON.stringify(tests)};
    for (const test of tests) {
      const el = document.getElementById("tests-" + test + "-status");
      el.innerHTML = "⏳";
      const iframe = document.createElement("iframe");
      iframe.src = "${withBase("/tests/")}" + test;
      iframe.style.display = "none";
      document.body.appendChild(iframe);
    }
    window.addEventListener('message', (event) => {
      if (event.data.test) {
        const el = document.getElementById("tests-" + event.data.test + "-status");
        if (event.data.message.includes("PASS")) {
          el.innerHTML = "✅";
        } else if (event.data.message.includes("FAIL")) {
          el.innerHTML = "❌";
        }
      }
    });
  </script>
  </html>
  `;
});
