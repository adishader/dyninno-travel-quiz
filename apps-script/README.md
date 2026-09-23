# Apps Script — Results intake

`Code.gs` is the Google Apps Script bound to the "Travel Day Quiz. Results" Sheet.

## Deploy

1. Open the Sheet → Extensions → Apps Script.
2. Replace the default `Code.gs` content with this file's contents.
3. Confirm the Sheet has a tab named exactly `Results` (the script creates the header row automatically on first submission if that tab is empty).
4. Deploy → New deployment → type **Web app**.
   - Execute as: **Me**
   - Who has access: **Anyone**
5. Copy the deployment's `/exec` URL — that's `APPS_SCRIPT_URL`.

## Verify

Visiting the `/exec` URL directly in a browser (GET) should return:

```json
{ "ok": true, "message": "Travel Day Quiz results endpoint is live." }
```

The app's Next.js server calls this URL directly (not the browser), so there's no CORS/preflight concern — no extra headers needed on either side.
