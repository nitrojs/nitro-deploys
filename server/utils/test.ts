import type { EventHandler } from "nitro/h3";
import { defineEventHandler, html } from "nitro/h3";

export function defineTestHandler(
  name: string,
  serverHandler: EventHandler,
  clientHandler: (ctx: {
    log: (text: string) => void;
    assert: (condition: boolean, message: string) => void;
  }) => any,
) {
  return defineEventHandler(async (event) => {
    // Client
    if (event.req.headers.get("accept")?.includes("text/html")) {
      return html`
        <pre id="logs"></pre>
        <hr />
        <a
          href="https://github.com/nitrojs/nitro-deploys/blob/main/server/routes/tests/${name}.ts"
          target="_blank"
          >view source</a
        >
        <script type="module">
          // Log utils
          const logs = document.getElementById("logs");
          const log = (text) => {
            console.log(text);
            logs.innerHTML += "<div>" + text + "</div>";
            // Send to iframe parent
            window.parent.postMessage({
              test: "${name}",
              message: text,
            });
          };

          // Assert util
          const assert = (condition, message) => {
            if (!condition) {
              throw new Error(message);
            }
          };

          // Test impl
          const _test = ${clientHandler.toString()};

          // Run test
          log("⏳ Running test: ${name}");
          try {
            await _test({ assert, log });
            log("✅ PASS");
          } catch (error) {
            log(error.stack);
            log("❌ FAIL");
          }
        </script>
      `;
    }
    // Server
    return serverHandler(event);
  });
}
