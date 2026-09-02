# SimpliSite

SimpliSite is a small Google Apps Script web application for learning the architecture used by HiveHubPrototype. It performs one job: read published document metadata from a Google Sheet and display it as a list.

## Architecture

```text
Signed-in Google Workspace user
              |
              v
     Apps Script Web App
              |
              v
     Document Listing Service
              |
              v
      Google Sheet Registry
```

The browser never reads the Sheet directly. It calls the Apps Script server, which validates the registry and returns a small, display-safe object for each published row.

## Project structure

```text
src/                    Apps Script source and web UI
tests/                  Local service tests
scripts/                Repository validation
docs/                   Architecture, schema, and deployment guidance
.clasp.json.example     Local clasp configuration template
```

## Local verification

Node.js 18 or newer is required. The checks have no package dependencies.

```bash
npm test
npm run check
```

## Deployment

The registry spreadsheet is created separately in Google Drive. See [docs/deployment.md](docs/deployment.md) for the exact Apps Script and web-app deployment steps.

