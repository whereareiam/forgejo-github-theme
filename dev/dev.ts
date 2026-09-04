import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { PreviewApplication } from "./preview/PreviewApplication.ts";
import { PreviewConfig } from "./preview/config/PreviewConfig.ts";

const config = new PreviewConfig(resolve(dirname(fileURLToPath(import.meta.url)), ".."));
const application = new PreviewApplication(config);
await application.run(process.argv[2] ?? "start");
