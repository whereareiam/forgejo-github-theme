import { join, resolve } from "node:path";

import { AUTO_LOGIN, COMPOSE, ENVIRONMENT, FIXTURES, PREVIEW, SOURCE_PATHS } from "./constants.ts";

export class PreviewConfig {
  public readonly projectDirectory: string;
  public readonly composeFile: string;
  public readonly composeService = COMPOSE.service;
  public readonly previewUrl: string;
  public readonly previewGitUrl: string;
  public readonly healthUrl: string;
  public readonly previewUser: string;
  public readonly previewPassword: string;
  public readonly previewEmail: string;
  public readonly autoLoginEnabled: boolean;
  public readonly themeTemplatesDirectory: string;
  public readonly generatedTemplatesDirectory: string;
  public readonly autoLoginTemplateFile: string;
  public readonly fixturesDirectory: string;
  public readonly fixtureDatabaseFile: string;
  public readonly sourcePaths: readonly string[];
  public readonly pollIntervalMs = PREVIEW.pollIntervalMs;
  public readonly maxHealthAttempts = PREVIEW.maxHealthAttempts;
  public readonly watchIntervalMs = PREVIEW.watchIntervalMs;

  public constructor(projectDirectory: string, environment: NodeJS.ProcessEnv = process.env) {
    this.projectDirectory = resolve(projectDirectory);
    this.composeFile = join(this.projectDirectory, COMPOSE.file);
    this.previewUrl = `http://${PREVIEW.host}:${PREVIEW.port}`;
    this.previewGitUrl = `http://${this.previewUserCredentials(environment)}@${PREVIEW.host}:${PREVIEW.port}`;
    this.healthUrl = `${this.previewUrl}${PREVIEW.healthPath}`;
    this.previewUser = environment[ENVIRONMENT.user] ?? PREVIEW.defaultUser;
    this.previewPassword = environment[ENVIRONMENT.password] ?? PREVIEW.defaultPassword;
    this.previewEmail = environment[ENVIRONMENT.email] ?? PREVIEW.defaultEmail;
    this.autoLoginEnabled = environment[AUTO_LOGIN.environment] !== AUTO_LOGIN.disabledValue;
    this.themeTemplatesDirectory = join(this.projectDirectory, "templates");
    this.generatedTemplatesDirectory = join(this.projectDirectory, "dev/.generated/templates");
    this.autoLoginTemplateFile = join(this.projectDirectory, AUTO_LOGIN.templateDirectory, AUTO_LOGIN.templateFile);
    this.fixturesDirectory = join(this.projectDirectory, FIXTURES.directory);
    this.fixtureDatabaseFile = join(this.projectDirectory, FIXTURES.localDatabaseFile);
    this.sourcePaths = SOURCE_PATHS.map(path => join(this.projectDirectory, path));
  }

  private previewUserCredentials(environment: NodeJS.ProcessEnv): string {
    const user = environment[ENVIRONMENT.user] ?? PREVIEW.defaultUser;
    const password = environment[ENVIRONMENT.password] ?? PREVIEW.defaultPassword;
    return `${encodeURIComponent(user)}:${encodeURIComponent(password)}`;
  }
}
