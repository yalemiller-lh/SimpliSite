/**
 * Reads the complete populated registry rectangle from Google Sheets.
 * The returned matrix includes the header row.
 *
 * @return {string[][]}
 */
function readDocumentRegistry_() {
  const spreadsheet = SpreadsheetApp.openById(
    SIMPLISITE_CONFIG.registrySpreadsheetId
  );
  const sheet = spreadsheet.getSheetByName(
    SIMPLISITE_CONFIG.registrySheetName
  );

  if (!sheet) {
    throw new Error(
      'Registry tab "' + SIMPLISITE_CONFIG.registrySheetName + '" was not found.'
    );
  }

  const lastRow = sheet.getLastRow();
  const lastColumn = sheet.getLastColumn();

  if (lastRow < 1 || lastColumn < 1) {
    throw new Error('The document registry is empty.');
  }

  if (lastRow > SIMPLISITE_CONFIG.maximumRegistryRows) {
    throw new Error(
      'The document registry exceeds the supported row limit of ' +
        SIMPLISITE_CONFIG.maximumRegistryRows +
        '.'
    );
  }

  return sheet.getRange(1, 1, lastRow, lastColumn).getDisplayValues();
}

