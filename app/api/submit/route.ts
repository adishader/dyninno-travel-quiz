import { NextResponse } from "next/server";
import type { SubmitPayload } from "@/lib/submit";

function isValidPayload(body: unknown): body is SubmitPayload {
  if (!body || typeof body !== "object") return false;
  const p = body as Record<string, unknown>;
  return (
    typeof p.fullName === "string" &&
    p.fullName.trim() !== "" &&
    typeof p.companyOffice === "string" &&
    p.companyOffice.trim() !== "" &&
    typeof p.score === "number" &&
    Number.isFinite(p.score) &&
    typeof p.completionTime === "string" &&
    p.completionTime.trim() !== "" &&
    typeof p.completionTimeSeconds === "number" &&
    Number.isFinite(p.completionTimeSeconds) &&
    typeof p.timestamp === "string" &&
    p.timestamp.trim() !== "" &&
    (p.language === "EN" || p.language === "ES")
  );
}

// Proxies to the Google Apps Script Web App. This runs server-side only, so
// the Apps Script URL never reaches the client and CORS/preflight doesn't
// apply (only browser-initiated cross-origin requests trigger that).
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON body" }, { status: 400 });
  }

  if (!isValidPayload(body)) {
    return NextResponse.json({ ok: false, error: "Invalid payload" }, { status: 400 });
  }

  const appsScriptUrl = process.env.APPS_SCRIPT_URL;
  if (!appsScriptUrl) {
    return NextResponse.json({ ok: false, error: "Server is not configured (APPS_SCRIPT_URL missing)" }, { status: 500 });
  }

  try {
    const upstream = await fetch(appsScriptUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data: { ok?: boolean; error?: string } | null = await upstream.json().catch(() => null);

    if (!upstream.ok || !data?.ok) {
      return NextResponse.json({ ok: false, error: data?.error || "Upstream submission failed" }, { status: 502 });
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "Failed to reach results service" }, { status: 502 });
  }
}
