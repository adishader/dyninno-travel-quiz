export interface SubmitPayload {
  fullName: string;
  companyOffice: string;
  score: number;
  completionTime: string;
  completionTimeSeconds: number;
  timestamp: string;
  language: "EN" | "ES";
}

export async function submitQuizResult(payload: SubmitPayload): Promise<void> {
  const response = await fetch("/api/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data: { ok?: boolean; error?: string } | null = await response.json().catch(() => null);

  if (!response.ok || !data?.ok) {
    throw new Error(data?.error || "Failed to submit result");
  }
}
