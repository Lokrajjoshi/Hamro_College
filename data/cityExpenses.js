// All values are already in NPR. Monthly = per month, others = per year / one-time.
// Indicative figures for a single student sharing accommodation.
export const CITY_EXPENSES = {
  Kathmandu:  { monthlyPg: 8000,   monthlyFood: 8000,  insuranceAnnual: 3000,   visaFee: 0,      travelOneTime: 0 },
  Dhulikhel:  { monthlyPg: 6000,   monthlyFood: 7000,  insuranceAnnual: 3000,   visaFee: 0,      travelOneTime: 1000 },
  Lalitpur:   { monthlyPg: 8000,   monthlyFood: 8000,  insuranceAnnual: 3000,   visaFee: 0,      travelOneTime: 0 },
  Bangalore:  { monthlyPg: 13000,  monthlyFood: 9000,  insuranceAnnual: 8000,   visaFee: 0,      travelOneTime: 25000 },
  Delhi:      { monthlyPg: 12000,  monthlyFood: 9000,  insuranceAnnual: 8000,   visaFee: 0,      travelOneTime: 15000 },
  Sydney:     { monthlyPg: 92000,  monthlyFood: 46000, insuranceAnnual: 64000,  visaFee: 184000, travelOneTime: 120000 },
  Melbourne:  { monthlyPg: 85000,  monthlyFood: 44000, insuranceAnnual: 64000,  visaFee: 184000, travelOneTime: 125000 },
  Toronto:    { monthlyPg: 101000, monthlyFood: 45000, insuranceAnnual: 75000,  visaFee: 24000,  travelOneTime: 180000 },
  Manchester: { monthlyPg: 112000, monthlyFood: 47000, insuranceAnnual: 145000, visaFee: 98000,  travelOneTime: 130000 },
  Tempe:      { monthlyPg: 98000,  monthlyFood: 49000, insuranceAnnual: 400000, visaFee: 75000,  travelOneTime: 170000 },
  Tokyo:      { monthlyPg: 57000,  monthlyFood: 38000, insuranceAnnual: 19000,  visaFee: 5000,   travelOneTime: 90000 },
};

export const DEFAULT_CITY = { monthlyPg: 15000, monthlyFood: 10000, insuranceAnnual: 10000, visaFee: 0, travelOneTime: 20000 };

export function getCityExpense(city) {
  return CITY_EXPENSES[city] || DEFAULT_CITY;
}
