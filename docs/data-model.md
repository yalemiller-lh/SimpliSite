# Registry data model

The app reads the `Documents` tab and requires these exact headers in row 1.

| Column | Required value | Purpose |
| --- | --- | --- |
| `Document ID` | Unique, non-empty text | Stable registry identifier |
| `Title` | Non-empty text | Primary label shown to users |
| `Description` | Text | Short summary shown beneath the title |
| `Document Type` | Text | Display type such as `Google Doc` or `PDF` |
| `Drive File ID` | Text or blank | Reserved reference for a later open-document feature |
| `Status` | `Published`, `Draft`, or `Archived` | Only `Published` rows are returned |
| `Sort Order` | Number | Ascending display order; ties use title |

Blank rows are ignored. A malformed populated row produces a server error rather than silently returning misleading data.

