import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const root = path.resolve(import.meta.dirname, "..");
const requiredFiles = [
  ".clasp.json.example",
  "README.md",
  "docs/architecture.md",
  "docs/data-model.md",
  "docs/deployment.md",
  "src/appsscript.json",
  "src/Config.gs",
  "src/SheetRepository.gs",
  "src/DocumentService.gs",
  "src/WebApp.gs",
  "src/Index.html",
  "src/Styles.html",
  "src/ClientScript.html"
];

const missing = requiredFiles.filter((file) => !fs.existsSync(path.join(root, file)));
if (missing.length) {
  console.error(`Missing required files:\n${missing.map((file) => `- ${file}`).join("\n")}`);
  process.exit(1);
}

const manifest = JSON.parse(fs.readFileSync(path.join(root, "src/appsscript.json"), "utf8"));
if (manifest.runtimeVersion !== "V8") {
  throw new Error("Apps Script V8 runtime is required.");
}

const config = fs.readFileSync(path.join(root, "src/Config.gs"), "utf8");
if (config.includes("REPLACE_WITH")) {
  throw new Error("Config.gs still contains an undeployable placeholder.");
}

for (const file of ["Config.gs", "SheetRepository.gs", "DocumentService.gs", "WebApp.gs"]) {
  new vm.Script(fs.readFileSync(path.join(root, "src", file), "utf8"), { filename: file });
}

const clientHtml = fs.readFileSync(path.join(root, "src/ClientScript.html"), "utf8");
const clientMatch = clientHtml.match(/<script>([\s\S]*)<\/script>/);
if (!clientMatch) {
  throw new Error("ClientScript.html must contain one script block.");
}
new vm.Script(clientMatch[1], { filename: "ClientScript.html" });

console.log("Repository structure and Apps Script configuration are valid.");
