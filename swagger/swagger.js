import fs from "fs";
import path from "path";
import swaggerUi from "swagger-ui-express";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function swaggerDocs(app) {
  const swaggerFile = path.join(__dirname, "swagger.json");
  const swaggerData = JSON.parse(fs.readFileSync(swaggerFile, "utf8"));

  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerData));
}
