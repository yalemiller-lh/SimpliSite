import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import vm from "node:vm";

const root = path.resolve(import.meta.dirname, "..");
const context = vm.createContext({ console });
vm.runInContext(fs.readFileSync(path.join(root, "src/Config.gs"), "utf8"), context);
vm.runInContext(fs.readFileSync(path.join(root, "src/DocumentService.gs"), "utf8"), context);

const headers = [
  "Document ID",
  "Title",
  "Description",
  "Document Type",
  "Drive File ID",
  "Status",
  "Sort Order",
];
const config = {
  requiredHeaders: headers,
  publishedStatus: "Published",
};

function normalize(rows) {
  return context.normalizeDocumentRows_([headers, ...rows], config);
}

test("returns only published documents in sort order", () => {
  const result = normalize([
    ["DOC-002", "Beta", "Second", "PDF", "", "Published", "20"],
    ["DOC-003", "Hidden", "Draft", "Doc", "", "Draft", "5"],
    ["DOC-001", "Alpha", "First", "Doc", "", "Published", "10"],
  ]);

  assert.deepEqual(JSON.parse(JSON.stringify(result)), [
    { id: "DOC-001", title: "Alpha", description: "First", type: "Doc" },
    { id: "DOC-002", title: "Beta", description: "Second", type: "PDF" },
  ]);
});

test("ignores fully blank rows", () => {
  assert.equal(normalize([["", "", "", "", "", "", ""]]).length, 0);
});

test("rejects a missing required header", () => {
  const incompleteHeaders = headers.slice(0, -1);
  assert.throws(
    () => context.normalizeDocumentRows_([incompleteHeaders], config),
    /Missing required registry header "Sort Order"/
  );
});

test("rejects duplicate document identifiers", () => {
  assert.throws(
    () =>
      normalize([
        ["DOC-001", "Alpha", "", "Doc", "", "Published", "10"],
        ["DOC-001", "Beta", "", "PDF", "", "Published", "20"],
      ]),
    /Duplicate Document ID/
  );
});

test("rejects non-numeric sort order values", () => {
  assert.throws(
    () => normalize([["DOC-001", "Alpha", "", "Doc", "", "Published", "first"]]),
    /invalid Sort Order/
  );
});
