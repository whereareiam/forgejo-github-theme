import { cpSync, mkdirSync, readdirSync, rmSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const output = join(root, "dist", "forgejo");
const templates = join(output, "templates");
const css = join(output, "public", "assets", "css");
const js = join(output, "public", "assets", "js");

rmSync(output, { recursive: true, force: true });
mkdirSync(templates, { recursive: true });
mkdirSync(css, { recursive: true });
mkdirSync(js, { recursive: true });

cpSync(join(root, "templates"), templates, { recursive: true });

const copyTemplates = (source: string, target: string): void => {
  for (const entry of readdirSync(source, { withFileTypes: true })) {
    const sourcePath = join(source, entry.name);
    const targetPath = join(target, entry.name);
    if (entry.isDirectory()) copyTemplates(sourcePath, targetPath);
    else if (entry.name.endsWith(".tmpl")) {
      mkdirSync(target, { recursive: true });
      cpSync(sourcePath, targetPath);
    }
  }
};
copyTemplates(join(root, "components"), join(templates, "components"));

for (const directory of ["common", "repository"]) {
  const source = join(root, "components", directory);
  for (const component of readdirSync(source, { withFileTypes: true })) {
    if (!component.isDirectory()) continue;
    const componentDirectory = join(source, component.name);
    const target = join(css, "components", directory, component.name);
    mkdirSync(target, { recursive: true });
    for (const file of readdirSync(componentDirectory)) {
      if (file.endsWith(".css")) cpSync(join(componentDirectory, file), join(target, file));
      if (file.endsWith(".js"))
        cpSync(join(componentDirectory, file), join(js, "components", directory, component.name, file));
    }
  }
}

for (const file of ["organization.css", "profile-subpages.css", "user-profile.css"]) {
  cpSync(join(root, "styles", "pages", file), join(css, "components", "pages", file));
}
for (const file of readdirSync(join(root, "public"))) {
  if (file.endsWith(".css")) cpSync(join(root, "public", file), join(css, file));
}
for (const file of readdirSync(join(root, "public", "assets", "js"))) {
  cpSync(join(root, "public", "assets", "js", file), join(js, file));
}
cpSync(join(root, "dist", "assets", "fonts"), join(output, "public", "assets", "fonts"), { recursive: true });
for (const file of readdirSync(join(root, "dist"))) {
  if (file.endsWith(".css")) cpSync(join(root, "dist", file), join(css, file));
}
