import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { resolve, dirname } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const deploymentsPath = resolve(__dirname, "../deployments.json");

interface Deployment {
  name: string;
  url: string;
  dash: string;
  docs: string;
  broken?: boolean;
  outdated?: boolean;
}

async function getLatestNitroVersion(): Promise<string> {
  const res = await fetch("https://registry.npmjs.org/nitro/latest");
  const data = (await res.json()) as { version: string };
  return data.version;
}

function extractVersion(html: string): string | undefined {
  // Matches: Nitro<span ...>@VERSION</span>
  const match = html.match(/">@([\d.]+(?:-[^\s<"]+)?)<\/span>/);
  return match?.[1];
}

async function validate() {
  const deployments: Deployment[] = JSON.parse(await readFile(deploymentsPath, "utf-8"));
  const latestVersion = await getLatestNitroVersion();
  console.log(`Latest Nitro version: ${latestVersion}\n`);

  let modified = false;

  const results = await Promise.all(
    deployments.map(async (deployment) => {
      if (!deployment.url) {
        return `⏭️  ${deployment.name} — no URL, skipping`;
      }

      const fetchUrl = deployment.url + "base/";
      try {
        const res = await fetch(fetchUrl, {
          redirect: "follow",
          signal: AbortSignal.timeout(15_000),
        });

        if (res.status === 404) {
          deployment.url = "";
          delete deployment.broken;
          delete deployment.outdated;
          modified = true;
          return `🗑️  ${deployment.name} — 404, removing URL`;
        }

        if (!res.ok) {
          deployment.broken = true;
          modified = true;
          return `❌ ${deployment.name} — HTTP ${res.status}, marking broken`;
        }

        const html = await res.text();
        const version = extractVersion(html);

        if (!version) {
          deployment.broken = true;
          modified = true;
          return `❌ ${deployment.name} — could not extract version, marking broken`;
        }

        if (version !== latestVersion) {
          deployment.outdated = true;
          delete deployment.broken;
          modified = true;
          return `⚠️  ${deployment.name} — version ${version} (expected ${latestVersion}), marking outdated`;
        }

        if (deployment.broken || deployment.outdated) {
          delete deployment.broken;
          delete deployment.outdated;
          modified = true;
          return `✅ ${deployment.name} — OK (was broken/outdated, now fixed)`;
        }
        return `✅ ${deployment.name} — OK`;
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        deployment.broken = true;
        modified = true;
        return `❌ ${deployment.name} — ${message}, marking broken`;
      }
    }),
  );

  for (const result of results) {
    console.log(result);
  }

  if (modified) {
    await writeFile(deploymentsPath, JSON.stringify(deployments, null, 2) + "\n");
    console.log("\n📝 deployments.json updated");
  } else {
    console.log("\n✨ No changes needed");
  }
}

validate();
