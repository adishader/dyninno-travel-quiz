/**
 * Travel Day Quiz — results intake.
 *
 * Deploy: bind this script to the "Travel Day Quiz. Results" Sheet
 * (Extensions > Apps Script), then Deploy > New deployment > Web app,
 * with "Execute as: Me" and "Who has access: Anyone". Copy the resulting
 * /exec URL into the app's APPS_SCRIPT_URL environment variable.
 *
 * The app's Next.js server (not the browser) calls this URL directly, so
 * CORS/preflight doesn't apply here — no special headers are needed.
 */

const SHEET_NAME = "Results";
const HEADER_ROW = [
  "Full Name",
  "Company Office",
  "Score",
  "Completion Time",
  "Completion Time (seconds)",
  "Language",
  "Timestamp",
];

function doGet() {
  return jsonResponse({ ok: true, message: "Travel Day Quiz results endpoint is live." });
}

function doPost(e) {
  try {
    const payload = parsePayload(e);
    const error = validate(payload);
    if (error) {
      return jsonResponse({ ok: false, error: error });
    }

    const sheet = getResultsSheet();
    const lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      ensureHeaderRow(sheet);
      sheet.appendRow([
        payload.fullName,
        payload.companyOffice,
        payload.score,
        payload.completionTime,
        payload.completionTimeSeconds,
        payload.language,
        parseTimestamp(payload.timestamp),
      ]);
    } finally {
      lock.releaseLock();
    }

    return jsonResponse({ ok: true });
  } catch (err) {
    return jsonResponse({ ok: false, error: String(err && err.message ? err.message : err) });
  }
}

function parsePayload(e) {
  if (!e || !e.postData || !e.postData.contents) {
    throw new Error("Missing request body");
  }
  return JSON.parse(e.postData.contents);
}

function validate(payload) {
  if (!payload || typeof payload !== "object") return "Invalid payload";
  if (typeof payload.fullName !== "string" || payload.fullName.trim() === "") return "fullName is required";
  if (typeof payload.companyOffice !== "string" || payload.companyOffice.trim() === "") return "companyOffice is required";
  if (typeof payload.score !== "number" || !isFinite(payload.score)) return "score must be a number";
  if (typeof payload.completionTime !== "string" || payload.completionTime.trim() === "") return "completionTime is required";
  if (typeof payload.completionTimeSeconds !== "number" || !isFinite(payload.completionTimeSeconds)) {
    return "completionTimeSeconds must be a number";
  }
  if (payload.language !== "EN" && payload.language !== "ES") return 'language must be "EN" or "ES"';
  if (typeof payload.timestamp !== "string" || payload.timestamp.trim() === "") return "timestamp is required";
  return null;
}

function parseTimestamp(raw) {
  const date = new Date(raw);
  return isNaN(date.getTime()) ? raw : date;
}

function getResultsSheet() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  if (!sheet) {
    throw new Error('Sheet tab "' + SHEET_NAME + '" not found');
  }
  return sheet;
}

function ensureHeaderRow(sheet) {
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADER_ROW);
  }
}

function jsonResponse(body) {
  return ContentService.createTextOutput(JSON.stringify(body)).setMimeType(ContentService.MimeType.JSON);
}
