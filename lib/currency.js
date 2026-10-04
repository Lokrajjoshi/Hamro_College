// 1 unit of currency -> NPR. INR is pegged at 1.6. Others are indicative;
// update them here (one place) whenever you want fresher numbers.
export const RATES_TO_NPR = {
  NPR: 1,
  INR: 1.6,
  USD: 140,
  AUD: 92,
  CAD: 101,
  GBP: 187,
  JPY: 0.95,
};

export function rateToNpr(currency) {
  return RATES_TO_NPR[currency] ?? 1;
}

export function toNpr(amount, currency) {
  return Math.round((amount || 0) * rateToNpr(currency));
}
