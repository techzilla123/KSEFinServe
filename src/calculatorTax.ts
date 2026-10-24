// US state income tax brackets for 2025 tax year (most recent complete data).
// Source: state revenue department published brackets, standard deduction, and rates.
// Each entry: { standardDeduction, brackets: [[threshold, rate], ...] }
// Brackets are marginal: the rate applies to income above the threshold.
// All values in USD.

export type StateTax = {
  deduction: number
  brackets: Array<[number, number]>
  /** Flat rate states use a single bracket. */
  flat?: boolean
}

export const STATE_TAX_2025: Record<string, StateTax> = {
  Alabama: {
    deduction: 4000,
    brackets: [[0, 0.02], [500, 0.04], [3000, 0.05]],
  },
  Alaska: { deduction: 0, brackets: [[0, 0]], flat: true },
  Arizona: {
    deduction: 14600,
    brackets: [[0, 0.025]],
    flat: true,
  },
  Arkansas: {
    deduction: 5350,
    brackets: [[0, 0.02], [4500, 0.04], [9100, 0.053], [11000, 0.053]],
  },
  California: {
    deduction: 5540,
    brackets: [
      [0, 0.01], [10756, 0.02], [25499, 0.04], [40245, 0.06], [55866, 0.08],
      [70606, 0.093], [360659, 0.103], [432787, 0.113], [721314, 0.123],
    ],
  },
  Colorado: {
    deduction: 14600,
    brackets: [[0, 0.044]],
    flat: true,
  },
  Connecticut: {
    deduction: 0,
    brackets: [
      [0, 0.02], [10000, 0.045], [50000, 0.055], [100000, 0.065],
      [200000, 0.069], [250000, 0.075],
    ],
  },
  Delaware: {
    deduction: 3250,
    brackets: [[0, 0.022], [5000, 0.039], [10000, 0.048], [20000, 0.052], [25000, 0.0555], [60000, 0.066]],
  },
  Florida: { deduction: 0, brackets: [[0, 0]], flat: true },
  Georgia: {
    deduction: 12000,
    brackets: [[0, 0.01]],
    flat: true,
  },
  Hawaii: {
    deduction: 2200,
    brackets: [
      [0, 0.014], [2400, 0.032], [4800, 0.055], [9600, 0.064], [14400, 0.068],
      [19200, 0.072], [24000, 0.076], [36000, 0.079], [48000, 0.0825],
      [150000, 0.09], [175000, 0.1], [200000, 0.11],
    ],
  },
  Idaho: {
    deduction: 14600,
    brackets: [[0, 0.058]],
    flat: true,
  },
  Illinois: {
    deduction: 0,
    brackets: [[0, 0.0495]],
    flat: true,
  },
  Indiana: {
    deduction: 0,
    brackets: [[0, 0.0305]],
    flat: true,
  },
  Iowa: {
    deduction: 0,
    brackets: [[0, 0.044], [6420, 0.0482], [35220, 0.0573], [79860, 0.06]],
  },
  Kansas: {
    deduction: 3500,
    brackets: [[0, 0.031], [15000, 0.0525], [30000, 0.057]],
  },
  Kentucky: {
    deduction: 4000,
    brackets: [[0, 0.04]],
    flat: true,
  },
  Louisiana: {
    deduction: 0,
    brackets: [[0, 0.0185], [12500, 0.035], [50000, 0.0425]],
  },
  Maine: {
    deduction: 14600,
    brackets: [[0, 0.058], [26050, 0.0675], [61250, 0.0715]],
  },
  Maryland: {
    deduction: 2550,
    brackets: [[0, 0.02], [1000, 0.03], [2000, 0.04], [3000, 0.0475], [100000, 0.05], [125000, 0.0525], [150000, 0.055], [250000, 0.0575]],
  },
  Massachusetts: {
    deduction: 0,
    brackets: [[0, 0.05], [1000000, 0.09]],
  },
  Michigan: {
    deduction: 0,
    brackets: [[0, 0.0425]],
    flat: true,
  },
  Minnesota: {
    deduction: 14575,
    brackets: [[0, 0.0535], [34590, 0.068], [182740, 0.0785], [349890, 0.0985]],
  },
  Mississippi: {
    deduction: 0,
    brackets: [[0, 0], [10000, 0.047]],
  },
  Missouri: {
    deduction: 12950,
    brackets: [[0, 0.02], [1207, 0.025], [2414, 0.03], [3621, 0.035], [4828, 0.04], [6035, 0.045], [7242, 0.05], [8449, 0.055]],
  },
  Montana: {
    deduction: 26600,
    brackets: [[0, 0.047], [20500, 0.059]],
  },
  Nebraska: {
    deduction: 7900,
    brackets: [[0, 0.0246], [3700, 0.0351], [22170, 0.0501], [35730, 0.0584]],
  },
  Nevada: { deduction: 0, brackets: [[0, 0]], flat: true },
  "New Hampshire": { deduction: 0, brackets: [[0, 0]], flat: true },
  "New Jersey": {
    deduction: 0,
    brackets: [[0, 0.014], [20000, 0.0175], [35000, 0.035], [40000, 0.05525], [75000, 0.0637], [500000, 0.0897], [1000000, 0.1075]],
  },
  "New Mexico": {
    deduction: 14050,
    brackets: [[0, 0.017], [5500, 0.032], [11000, 0.047], [16000, 0.049], [210000, 0.059]],
  },
  "New York": {
    deduction: 8000,
    brackets: [[0, 0.04], [8500, 0.045], [11700, 0.0525], [13900, 0.059], [80650, 0.0597], [215400, 0.0685], [1077550, 0.0965], [5000000, 0.103], [25000000, 0.109]],
  },
  "North Carolina": {
    deduction: 12750,
    brackets: [[0, 0.0425]],
    flat: true,
  },
  "North Dakota": {
    deduction: 14600,
    brackets: [[0, 0.0195], [44725, 0.025], [225975, 0.025]],
  },
  Ohio: {
    deduction: 0,
    brackets: [[0, 0], [26050, 0.0275], [100000, 0.035], [200000, 0.0375]],
  },
  Oklahoma: {
    deduction: 6350,
    brackets: [[0, 0.0025], [1000, 0.0075], [2500, 0.0175], [3750, 0.0275], [4900, 0.0375], [7200, 0.0475]],
  },
  Oregon: {
    deduction: 2600,
    brackets: [[0, 0.0475], [4050, 0.0675], [10200, 0.0875], [125000, 0.099]],
  },
  Pennsylvania: {
    deduction: 0,
    brackets: [[0, 0.0307]],
    flat: true,
  },
  "Rhode Island": {
    deduction: 10000,
    brackets: [[0, 0.0375], [77450, 0.0475], [176050, 0.0599]],
  },
  "South Carolina": {
    deduction: 0,
    brackets: [[0, 0], [3460, 0.03], [17320, 0.062]],
  },
  "South Dakota": { deduction: 0, brackets: [[0, 0]], flat: true },
  Tennessee: { deduction: 0, brackets: [[0, 0]], flat: true },
  Texas: { deduction: 0, brackets: [[0, 0]], flat: true },
  Utah: {
    deduction: 0,
    brackets: [[0, 0.0455]],
    flat: true,
  },
  Vermont: {
    deduction: 14600,
    brackets: [[0, 0.0335], [45400, 0.066], [110050, 0.076], [229550, 0.0875]],
  },
  Virginia: {
    deduction: 8500,
    brackets: [[0, 0.02], [3000, 0.03], [5000, 0.05], [17000, 0.0575]],
  },
  Washington: { deduction: 0, brackets: [[0, 0]], flat: true },
  "West Virginia": {
    deduction: 0,
    brackets: [[0, 0.0236], [10000, 0.0315], [25000, 0.0354], [40000, 0.0472], [60000, 0.0512]],
  },
  Wisconsin: {
    deduction: 13230,
    brackets: [[0, 0.035], [14320, 0.044], [28640, 0.053], [315310, 0.0765]],
  },
  Wyoming: { deduction: 0, brackets: [[0, 0]], flat: true },
}

/** Federal 2025 brackets for a single filer. */
export const FEDERAL_2025_SINGLE: Array<[number, number]> = [
  [0, 0.1], [11925, 0.12], [48475, 0.22], [103350, 0.24],
  [197300, 0.32], [250525, 0.35], [626350, 0.37],
]

/** Federal 2025 standard deduction for a single filer. */
export const FEDERAL_STANDARD_DEDUCTION_2025 = 15000

/** FICA: Social Security 6.2% up to the wage base, Medicare 1.45% (no cap). */
export const SOCIAL_SECURITY_RATE = 0.062
export const SOCIAL_SECURITY_WAGE_BASE_2025 = 176100
export const MEDICARE_RATE = 0.0145

/** Compute tax from marginal brackets. */
export function bracketTax(taxable: number, brackets: Array<[number, number]>): number {
  if (taxable <= 0) return 0
  let tax = 0
  for (let i = 0; i < brackets.length; i++) {
    const [threshold, rate] = brackets[i]
    const next = i + 1 < brackets.length ? brackets[i + 1][0] : Infinity
    if (taxable > threshold) {
      tax += (Math.min(taxable, next) - threshold) * rate
    }
  }
  return tax
}

/** Federal income tax for a single filer. */
export function federalTax(income: number): number {
  const taxable = Math.max(0, income - FEDERAL_STANDARD_DEDUCTION_2025)
  return bracketTax(taxable, FEDERAL_2025_SINGLE)
}

/** State income tax for the given state. */
export function stateTax(state: string, income: number): number {
  const data = STATE_TAX_2025[state]
  if (!data) return 0
  const taxable = Math.max(0, income - data.deduction)
  return bracketTax(taxable, data.brackets)
}

/** FICA (Social Security + Medicare). */
export function ficaTax(income: number): number {
  const ss = Math.min(income, SOCIAL_SECURITY_WAGE_BASE_2025) * SOCIAL_SECURITY_RATE
  const medicare = income * MEDICARE_RATE
  return ss + medicare
}

/** Marginal federal rate at a given income. */
export function marginalFederalRate(income: number): number {
  const taxable = Math.max(0, income - FEDERAL_STANDARD_DEDUCTION_2025)
  let rate = 0
  for (const [threshold, r] of FEDERAL_2025_SINGLE) {
    if (taxable > threshold) rate = r
  }
  return rate
}
