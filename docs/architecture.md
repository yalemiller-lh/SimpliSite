# SimpliSite architecture

## Scope

SimpliSite lists published document metadata. It does not search, filter, edit, administer, audit, send reminders, or manage access roles.

## Components

### Google Sheet registry

The `Documents` tab is the source of truth for list metadata. It contains one row per document and does not store document contents.

### Apps Script server

The server opens the configured spreadsheet, validates the required headers, filters rows to `Published`, sorts them by `Sort Order`, and returns only fields needed by the page.

### HTML client

The client is served by `doGet()`. It calls `listDocuments()` through `google.script.run` and renders loading, empty, success, and error states.

## Request flow

1. A signed-in user opens the deployed Apps Script web app.
2. `doGet()` serves `Index.html` with the shared styles and client script.
3. The client calls the server-side `listDocuments()` function.
4. `SheetRepository.gs` reads the `Documents` sheet.
5. `DocumentService.gs` validates, filters, sorts, and serializes rows.
6. The client safely renders the returned document list.

## Security boundaries

- Deploy the web app for signed-in users; do not allow anonymous access.
- Deploy as the user accessing the web app when Workspace identity is required.
- The spreadsheet ID stays in server-side code and is never sent to the browser.
- The server returns only allowlisted metadata fields.
- Google Drive permissions remain a separate boundary if document-opening functionality is added later.

