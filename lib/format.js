export function formatNpr(amount) {
  if (amount == null || Number.isNaN(amount)) return "—";
  return "रु " + Math.round(amount).toLocaleString("en-IN");
}

// Short form for charts and cards: रु 45.2L, रु 1.3Cr
export function formatNprShort(amount) {
  if (amount == null) return "—";
  if (amount >= 1e7) return "रु " + (amount / 1e7).toFixed(2) + " Cr";
  if (amount >= 1e5) return "रु " + (amount / 1e5).toFixed(1) + " L";
  if (amount >= 1e3) return "रु " + Math.round(amount / 1e3) + "k";
  return "रु " + Math.round(amount);
}

export function formatLocal(amount, currency) {
  if (amount == null) return "—";
  return `${currency} ${Math.round(amount).toLocaleString("en-US")}`;
}
