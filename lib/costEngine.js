import { toNpr } from "./currency";
import { getCityExpense } from "@/data/cityExpenses";

export const NOC_FEE_NPR = 2000;

/**
 * The single source of truth for cost math. Every page (cards, compare,
 * calculator, parents) calls this so numbers always match.
 */
export function calculateCost(college, options = {}) {
  const city = getCityExpense(college.city);
  const years = options.years ?? college.durationYears ?? 4;
  const scholarshipPct = options.scholarshipPct ?? 0;
  const monthlyPg = options.monthlyPg ?? city.monthlyPg;
  const monthlyFood = options.monthlyFood ?? city.monthlyFood;
  const includeInsurance = options.includeInsurance ?? true;
  const includeVisa = options.includeVisa ?? true;
  const includeTravel = options.includeTravel ?? true;
  const isAbroad = college.country !== "Nepal";

  const tuitionYear = toNpr(college.tuitionAnnual, college.currency) * (1 - scholarshipPct / 100);
  const livingYear = (monthlyPg + monthlyFood) * 12;
  const insuranceYear = includeInsurance ? city.insuranceAnnual : 0;

  const oneTime =
    toNpr(college.oneTimeFees, college.currency) +
    (includeVisa && isAbroad ? city.visaFee + NOC_FEE_NPR : 0) +
    (includeTravel ? city.travelOneTime : 0);

  const fullYears = Math.ceil(years);
  const yearly = [];
  let cumulative = 0;
  for (let i = 0; i < fullYears; i++) {
    // Last year may be partial (e.g. 1.5-year master's)
    const fraction = i === fullYears - 1 && years % 1 !== 0 ? years % 1 : 1;
    const row = {
      year: i + 1,
      label: `Year ${i + 1}`,
      tuition: Math.round(tuitionYear * fraction),
      living: Math.round(livingYear * fraction),
      insurance: Math.round(insuranceYear * fraction),
      oneTime: i === 0 ? Math.round(oneTime) : 0,
    };
    row.total = row.tuition + row.living + row.insurance + row.oneTime;
    cumulative += row.total;
    row.cumulative = cumulative;
    yearly.push(row);
  }

  const total = cumulative;
  const salaryNpr = college.avgPackage ? toNpr(college.avgPackage, college.currency) : null;
  const paybackYears = salaryNpr ? Math.round((total / salaryNpr) * 10) / 10 : null;

  return {
    years,
    yearly,
    total,
    perYear: Math.round(total / years),
    breakdown: {
      tuition: yearly.reduce((s, y) => s + y.tuition, 0),
      living: yearly.reduce((s, y) => s + y.living, 0),
      insurance: yearly.reduce((s, y) => s + y.insurance, 0),
      oneTime: Math.round(oneTime),
    },
    defaults: { monthlyPg: city.monthlyPg, monthlyFood: city.monthlyFood },
    salaryNpr,
    paybackYears,
  };
}

// Standard loan EMI formula
export function calculateEmi(principal, annualRatePct, years) {
  if (principal <= 0) return { emi: 0, totalInterest: 0, totalPayable: 0 };
  const r = annualRatePct / 12 / 100;
  const n = Math.max(1, Math.round(years * 12));
  const emi = r === 0 ? principal / n : (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  const totalPayable = emi * n;
  return { emi: Math.round(emi), totalInterest: Math.round(totalPayable - principal), totalPayable: Math.round(totalPayable) };
}
