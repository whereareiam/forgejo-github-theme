import { randomUUID } from "node:crypto";
import { appendFileSync, existsSync, mkdirSync, readdirSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { PreviewConfig } from "../config/PreviewConfig.ts";

/** Cache busting and live reload belong only to the local preview, never release assets. */
export class PreviewReloader {
  private readonly config: PreviewConfig;
  private revision = "";

  public constructor(config: PreviewConfig) {
    this.config = config;
  }

  public prepare(): void {
    this.revision = randomUUID();
    const dist = join(this.config.projectDirectory, "dist");
    for (const name of readdirSync(dist).filter(name => name.endsWith("-auto.css"))) {
      const file = join(dist, name);
      const css = readFileSync(file, "utf8").replace(
        /(theme-github-[^"?]+\.css)(?:\?preview=[^" ]*)?/g,
        `$1?preview=${this.revision}`
      );
      writeFileSync(file, css);
    }
    this.versionTemplateAssets(this.config.generatedTemplatesDirectory);
    mkdirSync(dirname(this.config.autoLoginTemplateFile), { recursive: true });
    appendFileSync(this.config.autoLoginTemplateFile, this.script());
  }

  /** Publish only after Forgejo has restarted with the new templates. */
  public publish(): void {
    const file = join(this.config.projectDirectory, "dist", "preview-revision.json");
    writeFileSync(`${file}.tmp`, JSON.stringify({ revision: this.revision }));
    renameSync(`${file}.tmp`, file);
  }

  private versionTemplateAssets(directory: string): void {
    if (!existsSync(directory)) return;
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const file = join(directory, entry.name);
      if (entry.isDirectory()) this.versionTemplateAssets(file);
      else if (entry.name.endsWith(".tmpl")) {
        const template = readFileSync(file, "utf8");
        writeFileSync(
          file,
          template.replace(
            /((?:src="{{AssetUrlPrefix}}\/js\/[^"?]+\.js|href="{{AssetUrlPrefix}}\/css\/[^"?]+\.css))(?:\?preview=[^"]*)?/g,
            `$1?preview=${this.revision}`
          )
        );
      }
    }
  }

  private script(): string {
    return `<script>
(() => {
  const revision = ${JSON.stringify(this.revision)};
  const signedIn = {{if .SignedUserID}}true{{else}}false{{end}};
  const returnKey = "forgejo-preview-return-to";
  try {
    const returnTo = sessionStorage.getItem(returnKey);
    if (signedIn && returnTo) {
      sessionStorage.removeItem(returnKey);
      if (returnTo.startsWith("/") && !returnTo.startsWith("//") && returnTo !== location.pathname + location.search + location.hash) {
        location.replace(returnTo);
        return;
      }
    }
  } catch { /* Reload still works without optional session storage. */ }
  for (const link of document.querySelectorAll('link[rel="stylesheet"][href*="theme-"]')) {
    const url = new URL(link.href);
    url.searchParams.set("preview", revision);
    link.href = url.href;
  }
  const check = async () => {
    try {
      const response = await fetch({{AssetUrlPrefix}} + "/css/preview-revision.json", {cache: "no-store"});
      if (response.ok && (await response.json()).revision !== revision) {
        try { sessionStorage.setItem(returnKey, location.pathname + location.search + location.hash); } catch { /* Optional navigation restoration. */ }
        location.reload();
        return;
      }
    } catch { /* Keep polling while Forgejo restarts. */ }
    setTimeout(check, 1000);
  };
  setTimeout(check, 1000);
})();
</script>`;
  }
}
