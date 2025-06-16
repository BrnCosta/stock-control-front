export async function getDividendProgression() {
  const res = await fetch('/api/dividend/progression.json');
  return res.json();
}

export async function getMonthlyBreakdown() {
  const res = await fetch('/api/dividend/monthly_breakdown.json');
  return res.json();
} 