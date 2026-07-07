const SPREADSHEET_ID = '1robxjndv0LbaLMc2-OPVhkSFmr9tY3yLkfYHoKNJP6g';
const SHEET_NAME = 'Links';
const HEADERS = [
  'ID',
  'Created At',
  'Updated At',
  'Title',
  'URL',
  'Category',
  'Note',
  'Thumbnail',
  'Host'
];

function doGet() {
  const sheet = getSheet_();
  return json_({
    ok: true,
    sheetName: sheet.getName(),
    rows: Math.max(sheet.getLastRow() - 1, 0)
  });
}

function doPost(event) {
  try {
    const payload = JSON.parse(event.postData.contents || '{}');
    const action = payload.action;
    const item = payload.item || {};

    if (!item.id) {
      throw new Error('Missing item.id');
    }

    if (action === 'upsert') {
      upsertItem_(item);
      return json_({ ok: true, action: 'upsert', id: item.id });
    }

    if (action === 'delete') {
      deleteItem_(item.id);
      return json_({ ok: true, action: 'delete', id: item.id });
    }

    throw new Error('Unsupported action');
  } catch (error) {
    return json_({ ok: false, error: String(error.message || error) });
  }
}

function getSheet_() {
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = spreadsheet.getSheetByName(SHEET_NAME) || spreadsheet.getSheets()[0] || spreadsheet.insertSheet(SHEET_NAME);
  if (sheet.getName() !== SHEET_NAME) {
    sheet.setName(SHEET_NAME);
  }
  ensureHeaders_(sheet);
  return sheet;
}

function ensureHeaders_(sheet) {
  const current = sheet.getRange(1, 1, 1, HEADERS.length).getValues()[0];
  const needsHeader = HEADERS.some((header, index) => current[index] !== header);
  if (!needsHeader) return;

  sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
  sheet.setFrozenRows(1);
  sheet.getRange(1, 1, 1, HEADERS.length)
    .setFontWeight('bold')
    .setBackground('#113f32')
    .setFontColor('#ffffff');
  sheet.autoResizeColumns(1, HEADERS.length);
}

function upsertItem_(item) {
  const sheet = getSheet_();
  const rowNumber = findRowById_(sheet, item.id);
  const now = new Date().toISOString();
  const values = [[
    item.id,
    item.createdAt || now,
    item.updatedAt || now,
    item.title || '',
    item.url || '',
    item.category || '',
    item.note || '',
    item.thumb || '',
    item.host || ''
  ]];

  if (rowNumber) {
    sheet.getRange(rowNumber, 1, 1, HEADERS.length).setValues(values);
  } else {
    sheet.appendRow(values[0]);
  }
}

function deleteItem_(id) {
  const sheet = getSheet_();
  const rowNumber = findRowById_(sheet, id);
  if (rowNumber) {
    sheet.deleteRow(rowNumber);
  }
}

function findRowById_(sheet, id) {
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return null;

  const ids = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
  for (let index = 0; index < ids.length; index += 1) {
    if (String(ids[index][0]) === String(id)) {
      return index + 2;
    }
  }
  return null;
}

function json_(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
