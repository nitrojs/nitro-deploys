import { eventHandler } from "h3";

export default eventHandler((event) => {
  event.res.headers.set("Content-Type", "text/html; charset=utf-8");

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const write = (chunk: string) => {
        controller.enqueue(encoder.encode(chunk));
      };

      write(/* html */ `<!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8" />
              <title>Nitro Streaming Demo</title>
              <style>
                body {
                  font-family: monospace;
                  color: #fff;
                  background: #333;
                  font-size: 1.5em;
                  padding: 5em;
                  justify-content: center;
                  flex-direction: column;
                }
                a {
                  color: #fff;
                }
              </style>
            </head>
            <body>
              <h1>Nitro Streaming Demo</h1>
              <br />
              <a
                href="https://github.com/nitrojs/nitro-deploys/blob/main/routes/stream.ts"
                >Source Code</a
              ><br /><br />
            <!-- </body> -->
          </html> `);

      const text = `Nitro, an open source TypeScript framework, empowers you to create web servers that run anywhere, offering a range of impressive features such as rapid development through a zero config setup with hot module replacement for server code in development, a versatile deployment capability that allows for codebase deployment to any provider without extra configuration, and a portable and compact design, effectively eliminating the need for 'node_modules' with an output size of less than 1MB. Its filesystem routing feature automatically registers server and API routes, while maintaining a minimal design to fit into any solution with minimum overhead. The framework supports asynchronous chunk loading via code-splitting for a fast server startup time and response. Inherent TypeScript support is provided with several additional enhancements. Nitro also offers a multi-driver, platform-agnostic storage system, a powerful built-in caching API, and is highly customizable through its plugins hooks system. It further enhances code clarity with an auto imports feature, which automatically imports utilities for a minimal and clean codebase, adding only the used ones to the final bundle. Remarkably, Nitro maintains backward compatibility, enabling the use of legacy npm packages, CommonJS, and mocking Node.js modules for workers. This engine, openly powering Nuxt, is accessible to all, paving the way for a versatile and user-friendly web server development experience.
      `;
      for (const token of text.split(" ")) {
        write(token + " ");
        await waitFor(50);
      }

      controller.close();
    },
  });

  return stream;
});

function waitFor(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
