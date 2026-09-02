# Deployment guide

## Prerequisites

- A Google Workspace account allowed to create Apps Script projects and web-app deployments
- Editor access to the SimpliSite Document Registry Google Sheet
- Node.js 18 or newer for local verification
- `clasp` if deploying from the command line

## Verify the repository

```bash
npm run verify
```

## Create or connect an Apps Script project

1. Install and authenticate `clasp` if it is not already available.
2. Copy `.clasp.json.example` to `.clasp.json`.
3. Replace the example `scriptId` with the Apps Script project ID.
4. Run `clasp push` from the repository root.

Alternatively, create a standalone Apps Script project and copy the contents of `src/` into it, preserving filenames.

## Confirm the registry binding

`src/Config.gs` contains the generated registry spreadsheet ID and the required tab name. Confirm the deploying account can open that spreadsheet.

## Deploy the web app

1. In Apps Script, select **Deploy > New deployment**.
2. Choose **Web app**.
3. Execute as **User accessing the web app**.
4. Restrict access to the intended signed-in Google Workspace audience.
5. Deploy and authorize the requested Google Sheets scope. Apps Script's
   `SpreadsheetApp.openById()` requires the full Sheets scope even though
   SimpliSite performs read-only operations.
6. Open the deployment URL and confirm the two published sample documents appear while the draft row remains hidden.

## Updating

Push source changes with `clasp push`, then update the existing Apps Script deployment to a new version.
