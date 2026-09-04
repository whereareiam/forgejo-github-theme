import { cpSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

import { AUTO_LOGIN } from "../config/constants.ts";
import { PreviewConfig } from "../config/PreviewConfig.ts";

export class AutoLoginTemplate {
  private readonly config: PreviewConfig;

  public constructor(config: PreviewConfig) {
    this.config = config;
  }

  public prepare(): void {
    rmSync(this.config.generatedTemplatesDirectory, { force: true, recursive: true });
    cpSync(this.config.themeTemplatesDirectory, this.config.generatedTemplatesDirectory, { recursive: true });
    if (!this.config.autoLoginEnabled) return;

    mkdirSync(dirname(this.config.autoLoginTemplateFile), { recursive: true });
    writeFileSync(this.config.autoLoginTemplateFile, this.content());
  }

  private content(): string {
    const username = JSON.stringify(this.config.previewUser);
    const password = JSON.stringify(this.config.previewPassword);
    const loginPath = JSON.stringify(AUTO_LOGIN.loginPath);

    return `{{if not .SignedUserID}}<script>
(() => {
  const loginPath = ${loginPath};
  if (window.location.pathname !== loginPath) {
    const redirect = window.location.pathname + window.location.search + window.location.hash;
    window.location.replace(loginPath + "?redirect_to=" + encodeURIComponent(redirect));
    return;
  }

  const submit = () => {
    const form = document.querySelector('form[action$="/user/login"]');
    const username = form?.elements.namedItem("user_name");
    const password = form?.elements.namedItem("password");
    if (!(username instanceof HTMLInputElement) || !(password instanceof HTMLInputElement)) return;
    username.value = ${username};
    password.value = ${password};
    form.requestSubmit();
  };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", submit, { once: true });
  else submit();
})();
</script>{{end}}`;
  }
}
