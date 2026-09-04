export const COMMANDS = {
  bun: "bun",
  docker: "docker",
  git: "git",
  ssh: "ssh",
  shell: "sh",
} as const;

export const COMPOSE = {
  file: "dev/docker-compose.yml",
  service: "forgejo",
  container: "forgejo-github-theme-dev",
  image: "code.forgejo.org/forgejo/forgejo:16.0.3-rootless",
} as const;

export const PREVIEW = {
  host: "127.0.0.1",
  port: 3000,
  healthPath: "/api/healthz",
  defaultUser: "whereareiam",
  defaultPassword: "preview",
  defaultEmail: "whereareiam@fixtures.local",
  defaultTheme: "github-auto",
  pollIntervalMs: 1_000,
  maxHealthAttempts: 60,
  watchIntervalMs: 500,
} as const;

export const AUTO_LOGIN = {
  environment: "FORGEJO_PREVIEW_AUTO_LOGIN",
  disabledValue: "false",
  templateDirectory: "dev/.generated/templates/custom",
  templateFile: "header.tmpl",
  loginPath: "/user/login",
} as const;

export const CONTAINER_PATHS = {
  css: "/var/lib/gitea/custom/public/assets/css",
  fonts: "/var/lib/gitea/custom/public/assets/fonts",
  templates: "/var/lib/gitea/custom/templates",
  themeDist: "/workspace/theme-dist",
  themeTemplates: "/workspace/theme-templates",
} as const;

export const SOURCE_PATHS = [
  "theme.config.ts",
  "vite.config.ts",
  "src",
  "styles",
  "templates",
  "themes",
  "primer",
] as const;

export const ENVIRONMENT = {
  user: "FORGEJO_PREVIEW_USER",
  password: "FORGEJO_PREVIEW_PASSWORD",
  email: "FORGEJO_PREVIEW_EMAIL",
} as const;

export const PREVIEW_COMMANDS = {
  start: "start",
  stop: "stop",
  sync: "sync",
  watch: "watch",
  seedFixtures: "seed",
} as const;

export const ADMIN_CREATE_ARGS = ["admin", "user", "create"] as const;

export const FIXTURES = {
  directory: "dev/fixtures",
  databaseFile: "/var/lib/gitea/data/gitea.db",
  actionLogDirectory: "/var/lib/gitea/actions_log",
  localDatabaseFile: "dev/.generated/fixture-gitea.db",
} as const;
