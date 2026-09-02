/**
 * Returns published documents for the browser client.
 *
 * @return {{id: string, title: string, description: string, type: string}[]}
 */
function listDocuments() {
  return normalizeDocumentRows_(readDocumentRegistry_(), SIMPLISITE_CONFIG);
}

/**
 * Validates, filters, sorts, and serializes registry values.
 * Kept pure so the behavior can be tested without Google services.
 *
 * @param {string[][]} values
 * @param {Object} config
 * @return {{id: string, title: string, description: string, type: string}[]}
 */
function normalizeDocumentRows_(values, config) {
  if (!Array.isArray(values) || values.length === 0) {
    throw new Error('The document registry is empty.');
  }

  const headers = values[0].map(function (value) {
    return String(value || '').trim();
  });
  const headerIndexes = buildHeaderIndexes_(headers, config.requiredHeaders);
  const seenIds = {};
  const documents = [];

  values.slice(1).forEach(function (row, offset) {
    const rowNumber = offset + 2;
    if (isBlankRow_(row)) {
      return;
    }

    const id = readCell_(row, headerIndexes['Document ID']);
    const title = readCell_(row, headerIndexes.Title);
    const description = readCell_(row, headerIndexes.Description);
    const type = readCell_(row, headerIndexes['Document Type']);
    const status = readCell_(row, headerIndexes.Status);
    const sortText = readCell_(row, headerIndexes['Sort Order']);

    if (!id) {
      throw new Error('Registry row ' + rowNumber + ' is missing Document ID.');
    }
    if (!title) {
      throw new Error('Registry row ' + rowNumber + ' is missing Title.');
    }
    if (!status) {
      throw new Error('Registry row ' + rowNumber + ' is missing Status.');
    }
    if (seenIds[id]) {
      throw new Error('Duplicate Document ID "' + id + '" in row ' + rowNumber + '.');
    }
    seenIds[id] = true;

    let sortOrder = Number.MAX_SAFE_INTEGER;
    if (sortText) {
      sortOrder = Number(sortText);
      if (!Number.isFinite(sortOrder)) {
        throw new Error('Registry row ' + rowNumber + ' has an invalid Sort Order.');
      }
    }

    if (status === config.publishedStatus) {
      documents.push({
        id: id,
        title: title,
        description: description,
        type: type,
        sortOrder: sortOrder
      });
    }
  });

  documents.sort(function (left, right) {
    return left.sortOrder - right.sortOrder || left.title.localeCompare(right.title);
  });

  return documents.map(function (document) {
    return {
      id: document.id,
      title: document.title,
      description: document.description,
      type: document.type
    };
  });
}

function buildHeaderIndexes_(headers, requiredHeaders) {
  const indexes = {};

  headers.forEach(function (header, index) {
    if (header && Object.prototype.hasOwnProperty.call(indexes, header)) {
      throw new Error('Duplicate registry header "' + header + '".');
    }
    if (header) {
      indexes[header] = index;
    }
  });

  requiredHeaders.forEach(function (header) {
    if (!Object.prototype.hasOwnProperty.call(indexes, header)) {
      throw new Error('Missing required registry header "' + header + '".');
    }
  });

  return indexes;
}

function isBlankRow_(row) {
  return !row.some(function (value) {
    return String(value || '').trim() !== '';
  });
}

function readCell_(row, index) {
  return String(row[index] || '').trim();
}

