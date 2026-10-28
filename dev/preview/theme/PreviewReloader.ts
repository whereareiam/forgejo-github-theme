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

  /** Stamps the copy that ThemeSynchronizer staged, never the build in dist. */
  public prepare(): void {
    this.revision = randomUUID();
    const stylesheets = this.stylesheets();
    for (const name of readdirSync(stylesheets).filter(name => name.endsWith("-auto.css"))) {
      const file = join(stylesheets, name);
      const css = readFileSync(file, "utf8").replace(
        /(@import ")(\.\/theme-[^"?]+\.css(?:\?[^"]*)?)"/g,
        (_match, start: string, url: string) => `${start}${this.stamp(url)}"`
      );
      writeFileSync(file, css);
    }
    this.versionTemplateAssets(this.config.generatedTemplatesDirectory);
    mkdirSync(dirname(this.config.autoLoginTemplateFile), { recursive: true });
    appendFileSync(this.config.autoLoginTemplateFile, this.script());
  }

  /** Publish only after Forgejo has restarted with the new templates. */
  public publish(): void {
    const file = join(this.stylesheets(), "preview-revision.json");
    writeFileSync(`${file}.tmp`, JSON.stringify({ revision: this.revision }));
    renameSync(`${file}.tmp`, file);
  }

  private stylesheets(): string {
    return join(this.config.generatedAssetsDirectory, "css");
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
            /((?:src|href)=")(\{\{AssetUrlPrefix\}\}\/(?:js\/[^"?]+\.js|css\/[^"?]+\.css)(?:\?[^"]*)?)"/g,
            (_match, start: string, url: string) => `${start}${this.stamp(url)}"`
          )
        );
      }
    }
  }

  /** Sets the preview parameter beside the content version the bundle already appended, as one query. */
  private stamp(url: string): string {
    const [path, ...query] = url.split("?");
    const parameters = query
      .join("?")
      .split("&")
      .filter(parameter => parameter && !parameter.startsWith("preview="));
    return `${path}?${[...parameters, `preview=${this.revision}`].join("&")}`;
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
