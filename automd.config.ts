export default {
  input: ["README.md"],
  generators: {
    deployments: {
      async generate() {
        const deployments = (await import("./deployments.json")).default;
        const md = deployments
          .map((d) => {
            const status = d.broken
              ? " (broken)"
              : d.outdated
                ? " (outdated)"
                : !d.url
                  ? " (not available)"
                  : "";
            const link = d.url ? `[deployment](${d.url}base/)` : "~~deployment~~";
            return `- ${d.name}${status} ([docs](${d.docs}) | ${link})`;
          })
          .join("\n");
        return { contents: md };
      },
    },
    tests: {
      async generate() {
        const { results } = await import("./test/tests.ts");
        const md = `
        | Deployment | ${results[0][1].map(([name]) => name).join(" | ")} |
        | --- | ${results[0][1].map(() => "---").join(" | ")} |
        ${results.map(([name, tests]) => `| ${name} | ${tests.map(([, fail]) => (fail ? `❌` : "✅")).join(" | ")} |`).join("\n")}
                `;
        return { contents: md };
      },
    },
  },
};
