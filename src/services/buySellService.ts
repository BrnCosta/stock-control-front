export async function getBuySellHistory() {
  const res = await fetch('/api/buysell/history.json');
  return res.json();
} 