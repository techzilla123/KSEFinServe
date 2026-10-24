import { useEffect, useRef, useState } from "react";
import {
  federalTax,
  stateTax,
  ficaTax,
  marginalFederalRate,
  STATE_TAX_2025,
} from "./calculatorTax";

type ToolId = "tax" | "college" | "debt" | "retirement" | "compound";

/* Each tool has its own clean URL. */
const toolRoutes: Record<ToolId, string> = {
  tax: "/tax-calculator",
  college: "/college-savings",
  debt: "/debt-repayment",
  retirement: "/retirement-planning",
  compound: "/compound-interest",
};

/* Map a pathname back to a tool id. */
function toolFromPath(path: string): ToolId | null {
  const clean = path.replace(/\/+$/, "").toLowerCase();
  const entry = (Object.entries(toolRoutes) as [ToolId, string][]).find(
    ([, route]) => route === clean,
  );
  return entry ? entry[0] : null;
}

type Tool = {
  id: ToolId;
  label: string;
  eyebrow: string;
  title: string;
  serifTitle: string;
  description: string;
  artwork: string;
  activeIcon: string;
  panelTitle: string;
  panelMeta: string;
  resultTitle: string;
  resultMeta: string;
  resultLabel: string;
  accent: string;
  soft: string;
  reportTitle: string;
  reportCopy: string;
  reportButton: string;
};

const navIcons: Record<ToolId, string> = {
  tax: "/assets/e0ae7.svg",
  college: "/assets/b4d08.svg",
  debt: "/assets/46dc0.svg",
  retirement: "/assets/372e6.svg",
  compound: "/assets/e0f61.svg",
};

/* US states - the default country is the United States. */
const US_STATES = Object.keys(STATE_TAX_2025);

/* Canadian provinces, used when the country is switched to Canada. */
const CA_PROVINCES = [
  "Alberta", "British Columbia", "Manitoba", "New Brunswick",
  "Newfoundland and Labrador", "Northwest Territories", "Nova Scotia",
  "Nunavut", "Ontario", "Prince Edward Island", "Quebec", "Saskatchewan",
  "Yukon",
];

/* Tax years, newest first. */
const TAX_YEARS = ["2025", "2024", "2023", "2022", "2021", "2020"];

type Currency = "USD" | "CAD";

const tools: Tool[] = [
  {
    id: "tax",
    label: "Tax Calculator",
    eyebrow: "KSEFINSERVE / TAX CALCULATOR",
    title: "A little less tax mystery.",
    serifTitle: "A lot more clarity.",
    description:
      "See where your income goes. Explore an illustrative income-tax estimate, and make room for a clearer financial plan.",
    artwork: "/assets/3635d.png",
    activeIcon: "/assets/71343.svg",
    panelTitle: "Your income picture",
    panelMeta: "UNITED STATES · {CUR}",
    resultTitle: "Your estimated breakdown",
    resultMeta: "EXAMPLE SCENARIO",
    resultLabel: "Annual after-tax income",
    accent: "#1678bd",
    soft: "#dceefa",
    reportTitle: "Your numbers. A clearer next move.",
    reportCopy:
      "Personalized insights to explore with an advisor, a tax breakdown and a downloadable report of your scenario.",
    reportButton: "Get my tax clarity report →",
  },
  {
    id: "college",
    label: "College Savings",
    eyebrow: "KSEFINSERVE / COLLEGE SAVINGS",
    title: "Big dreams.",
    serifTitle: "Small steps today.",
    description:
      "Turn a future education into a plan you can start today. See how regular contributions could help fund their next chapter.",
    artwork: "/assets/2387f.png",
    activeIcon: "/assets/07712.svg",
    panelTitle: "Plan for their future",
    panelMeta: "EDUCATION · {CUR}",
    resultTitle: "Their education, in focus",
    resultMeta: "12-YEAR HORIZON",
    resultLabel: "Projected savings at age 18",
    accent: "#7950c5",
    soft: "#e4d4fb",
    reportTitle: "Give their ambition a starting point.",
    reportCopy:
      "Your funding gap, contribution guidance and an age-by-age savings timeline—in one useful education savings plan.",
    reportButton: "Get my education savings plan →",
  },
  {
    id: "debt",
    label: "Debt Repayment",
    eyebrow: "KSEFINSERVE / DEBT REPAYMENT",
    title: "Less debt.",
    serifTitle: "More possibilities.",
    description:
      "Bring your balances into one clear picture. Compare two repayment paths and see what a little extra each month could change.",
    artwork: "/assets/df44d.png",
    activeIcon: "/assets/4e552.svg",
    panelTitle: "Your balances",
    panelMeta: "2 DEBTS · {CUR}",
    resultTitle: "A path to debt-free",
    resultMeta: "AVALANCHE SELECTED",
    resultLabel: "Estimated debt-free timeline",
    accent: "#e75e48",
    soft: "#ffddd5",
    reportTitle: "Make your next payment purposeful.",
    reportCopy:
      "A clear payment priority, balance-by-balance timeline and a payoff blueprint you can revisit as life changes.",
    reportButton: "Unlock my payoff blueprint →",
  },
  {
    id: "retirement",
    label: "Retirement Planning",
    eyebrow: "KSEFINSERVE / RETIREMENT PLANNING",
    title: "Your next chapter.",
    serifTitle: "On your terms.",
    description:
      "Picture the life you want after work. Explore how today’s savings and contributions could support tomorrow’s income.",
    artwork: "/assets/f94b1.png",
    activeIcon: "/assets/c1112.svg",
    panelTitle: "Shape your next chapter",
    panelMeta: "RETIREMENT · {CUR}",
    resultTitle: "A future worth planning for",
    resultMeta: "25 YEARS TO RETIREMENT",
    resultLabel: "Projected savings at age 65",
    accent: "#188772",
    soft: "#f3e5bd",
    reportTitle: "Put your future into perspective.",
    reportCopy:
      "Your income gap, savings milestones and an age-by-age timeline—a retirement roadmap to guide your next conversation.",
    reportButton: "Get my retirement roadmap →",
  },
  {
    id: "compound",
    label: "Compound Interest",
    eyebrow: "KSEFINSERVE / COMPOUND INTEREST",
    title: "Give your money time.",
    serifTitle: "Watch possibility grow.",
    description:
      "Small contributions. A longer horizon. Explore how interest on your interest can make time a powerful part of your savings plan.",
    artwork: "/assets/6d24d.png",
    activeIcon: "/assets/36fa5.svg",
    panelTitle: "Set your growth in motion",
    panelMeta: "SAVINGS · {CUR}",
    resultTitle: "The power of staying with it",
    resultMeta: "10-YEAR PROJECTION",
    resultLabel: "Total balance after 10 years",
    accent: "#16856d",
    soft: "#dcefe5",
    reportTitle: "Turn the power of time into a plan.",
    reportCopy:
      "Keep your growth projection, deposit breakdown and interest timeline together. A simple report for a more intentional savings habit.",
    reportButton: "Get my growth report →",
  },
];

/* ------------------------------------------------------------------ */
/* Money helpers                                                       */
/* ------------------------------------------------------------------ */

function money(value: number, currency: Currency, decimals = 0): string {
  const sign = value < 0 ? "-" : "";
  const abs = Math.abs(value);
  const formatted =
    decimals > 0
      ? abs.toLocaleString("en-US", {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        })
      : Math.round(abs).toLocaleString("en-US");
  return sign + "$" + formatted;
}

/** Parse a "$1,234.56" style string into a number. */
function parseMoney(text: string): number {
  const cleaned = text.replace(/[^0-9.]/g, "");
  if (!cleaned) return 0;
  const value = Number(cleaned);
  return Number.isFinite(value) ? value : 0;
}

/** Format a number for display inside an input (keeps the $ and commas). */
function formatMoneyInput(value: number): string {
  return "$" + Math.round(value).toLocaleString("en-US");
}

function pct(value: number, decimals = 2): string {
  return (value * 100).toFixed(decimals) + "%";
}

/* ------------------------------------------------------------------ */
/* Custom dropdown: a rounded panel with a faint border, options in a
   vertical list, and the selected option highlighted with a blue tick. */
/* ------------------------------------------------------------------ */
function Dropdown({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLSpanElement>(null);

  // Close when clicking outside or pressing Escape.
  useEffect(() => {
    if (!open) return;
    const onDown = (event: MouseEvent) => {
      if (!wrapRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <span className={open ? "control dropdown open" : "control dropdown"} ref={wrapRef}>
      <button
        type="button"
        className="dropdown-trigger"
        aria-label={label}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="dropdown-value">{value}</span>
        <img src="/assets/3e962.svg" alt="" />
      </button>
      {open && (
        <ul className="dropdown-panel" role="listbox" aria-label={label}>
          {options.map((option) => {
            const selected = option === value;
            return (
              <li key={option}>
                <button
                  type="button"
                  role="option"
                  aria-selected={selected}
                  className={selected ? "dropdown-option selected" : "dropdown-option"}
                  onClick={() => {
                    onChange(option);
                    setOpen(false);
                  }}
                >
                  <span>{option}</span>
                  {selected && <i className="dropdown-check" aria-hidden="true" />}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </span>
  );
}

function Field({
  label,
  value,
  suffix,
  select,
  options,
  onChange,
  numeric,
  currency,
}: {
  label: string;
  value: string;
  suffix?: string;
  select?: boolean;
  options?: string[];
  onChange?: (value: string) => void;
  numeric?: boolean;
  currency?: Currency;
}) {
  const [current, setCurrent] = useState(value);

  // Currency fields show whichever currency is selected.
  const shownSuffix = currency ?? suffix;

  // Keep the field in step when the value is driven from outside (e.g. slider).
  const [lastValue, setLastValue] = useState(value);
  if (value !== lastValue) {
    setLastValue(value);
    if (numeric) setCurrent(value);
  }

  if (select && options) {
    return (
      <label className="field">
        <span>{label}</span>
        <Dropdown
          label={label}
          value={current}
          options={options}
          onChange={(next) => {
            setCurrent(next);
            onChange?.(next);
          }}
        />
      </label>
    );
  }

  return (
    <label className="field">
      <span>{label}</span>
      <span className="control">
        <input
          value={numeric ? current : undefined}
          defaultValue={numeric ? undefined : value}
          aria-label={label}
          inputMode={numeric ? "numeric" : undefined}
          onBeforeInput={(event) => {
            if (!numeric) return;
            // The leading "$" can never be removed.
            const input = event.currentTarget;
            const next = (event as unknown as InputEvent).data ?? "";
            const start = input.selectionStart ?? 0;
            const end = input.selectionEnd ?? 0;
            if (start <= 1 && end <= 1 && !/^[\d.,]*$/.test(next)) {
              event.preventDefault();
            }
          }}
          onChange={(event) => {
            if (numeric) {
              // Keep a leading "$"; only digits, commas and a decimal point.
              const digits = event.target.value.replace(/[^\d.,]/g, "");
              const next = "$" + digits;
              setCurrent(next);
              onChange?.(next);
              return;
            }
            onChange?.(event.target.value);
          }}
        />
        {shownSuffix && <small>{shownSuffix}</small>}
        {select && <img src="/assets/3e962.svg" alt="" />}
      </span>
    </label>
  );
}

function Segment({
  label,
  active,
  onClick,
}: {
  label: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      className={active ? "segment active" : "segment"}
      type="button"
      onClick={onClick}
    >
      {label}
    </button>
  );
}

/* A row of mutually exclusive options - the clicked one takes the active look. */
function SegmentGroup({
  options,
  value,
  onChange,
  className = "segments left",
}: {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}) {
  return (
    <div className={className}>
      {options.map((option) => (
        <Segment
          key={option}
          label={option}
          active={option === value}
          onClick={() => onChange(option)}
        />
      ))}
    </div>
  );
}

function Assumptions({ children }: { children: React.ReactNode }) {
  return (
    <div className="assumptions">
      <div>
        <strong>Advanced assumptions</strong>
        <img src="/assets/3e962.svg" alt="" />
      </div>
      <p>{children}</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Tax form                                                            */
/* ------------------------------------------------------------------ */

function TaxForm({
  currency,
  onStateChange,
  onIncomeChange,
}: {
  currency: Currency;
  onStateChange: (state: string) => void;
  onIncomeChange: (income: number) => void;
}) {
  const [state, setState] = useState("California");
  const [year, setYear] = useState("2025");
  const [income, setIncome] = useState("$80,000");
  const [extras, setExtras] = useState<{ label: string; amount: string }[]>([]);

  // The range slider drives the income figure (0 - 250,000).
  const sliderValue = Math.min(250000, Math.max(0, parseMoney(income)));

  // Report the parsed income upward so the results can recompute.
  useEffect(() => {
    onIncomeChange(parseMoney(income));
  }, [income, onIncomeChange]);

  return (
    <>
      <div className="field-grid">
        <Field
          label="State"
          value={state}
          select
          options={US_STATES}
          onChange={(next) => {
            setState(next);
            onStateChange(next);
          }}
        />
        <Field
          label="Tax year"
          value={year}
          select
          options={TAX_YEARS}
          onChange={setYear}
        />
      </div>
      <Field
        label="Annual employment income"
        value={income}
        currency={currency}
        numeric
        onChange={setIncome}
      />
      <div className="slider">
        <input
          type="range"
          min={0}
          max={250000}
          step={1000}
          value={sliderValue}
          aria-label="Annual employment income"
          onInput={(event) =>
            setIncome(formatMoneyInput(Number(event.currentTarget.value)))
          }
          onChange={(event) =>
            setIncome(formatMoneyInput(Number(event.currentTarget.value)))
          }
        />
        <img src="/assets/4c653.svg" alt="" />
      </div>
      <div className="range-labels">
        <span>$0</span>
        <span>$250,000</span>
      </div>
      {extras.map((row, index) => (
        <div className="extra-row" key={index}>
          <div className="field-grid">
            <Field
              label="Description"
              value={row.label}
              onChange={(next) =>
                setExtras((current) =>
                  current.map((r, i) => (i === index ? { ...r, label: next } : r)),
                )
              }
            />
            <Field
              label="Amount"
              value={row.amount}
              currency={currency}
              numeric
              onChange={(next) =>
                setExtras((current) =>
                  current.map((r, i) => (i === index ? { ...r, amount: next } : r)),
                )
              }
            />
          </div>
          <button
            className="row-remove"
            type="button"
            aria-label="Remove this income or deduction"
            onClick={() =>
              setExtras((current) => current.filter((_, i) => i !== index))
            }
          >
            −
          </button>
        </div>
      ))}
      <button
        className="add-row"
        type="button"
        onClick={() =>
          setExtras((current) => [...current, { label: "", amount: "$0" }])
        }
      >
        <img src="/assets/99b68.svg" alt="" /> Add income or deductions
      </button>
      <div className="form-divider" />
      <h3 className="story-title">A rate is not the whole story.</h3>
      <p className="form-copy">
        Your average rate applies across your income. Your marginal rate is the
        assumed rate on your next dollar—not every dollar you earn.
      </p>
      <p className="fine-print">
        Illustrative rates, not verified {year} tax tables. Excludes CPP/QPP, EI,
        payroll contributions and other deductions. Not personalized tax advice.
      </p>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Tax result - computed live from the form                            */
/* ------------------------------------------------------------------ */

function TaxResult({
  state,
  currency,
  monthly,
  income,
}: {
  state: string;
  currency: Currency;
  monthly: boolean;
  income: number;
}) {
  const federal = federalTax(income);
  const stateAmount = stateTax(state, income);
  const fica = ficaTax(income);
  const total = federal + stateAmount + fica;
  const afterTax = income - total;
  const keepPct = income > 0 ? afterTax / income : 0;
  const avgRate = income > 0 ? total / income : 0;
  const marginal = marginalFederalRate(income);

  const [activeSegment, setActiveSegment] = useState<{
    key: string;
    title: string;
    value: string;
    detail: string;
  } | null>(null);

  const fmt = (value: number) => money(monthly ? value / 12 : value, currency);

  // The donut segments, with what each hover reveals.
  const segments = [
    {
      key: "after",
      title: "After-tax income",
      value: fmt(afterTax),
      detail: `You keep ${pct(keepPct)} of your ${money(income, currency)} income`,
    },
    {
      key: "federal",
      title: "Federal income tax",
      value: fmt(federal),
      detail: `Marginal rate ${pct(marginal, 1)} · 2025 single brackets`,
    },
    {
      key: "state",
      title: `${state} income tax`,
      value: fmt(stateAmount),
      detail: `State brackets for ${state}`,
    },
    {
      key: "fica",
      title: "FICA (Social Security + Medicare)",
      value: fmt(fica),
      detail: "6.2% Social Security + 1.45% Medicare",
    },
  ];

  return (
    <>
      <div className="tax-result-row">
        <div className="donut">
          <img src="/assets/6c717.svg" alt="" />
          <img src="/assets/77e07.svg" alt="" />
          <img src="/assets/45f09.svg" alt="" />
          <strong>{pct(keepPct)}</strong>
          <span>income you keep</span>
          {/* Hover targets over each donut segment. */}
          {segments.map((s) => (
            <button
              key={s.key}
              type="button"
              className="donut-hit"
              aria-label={`${s.title}: ${s.value}`}
              style={donutHitStyle(s.key)}
              onMouseOver={() => setActiveSegment(s)}
              onMouseOut={() => setActiveSegment(null)}
              onFocus={() => setActiveSegment(s)}
              onBlur={() => setActiveSegment(null)}
            />
          ))}
          {activeSegment && (
            <div className="donut-tip show">
              <strong>{activeSegment.title}</strong>
              <span>{activeSegment.value}</span>
              <span>{activeSegment.detail}</span>
            </div>
          )}
        </div>
        <div className="tax-legend">
          <div><img src="/assets/70ff4.svg" alt="" />After-tax income <strong>{fmt(afterTax)}</strong></div>
          <div><img src="/assets/8b5d9.svg" alt="" />Federal income tax <strong>{fmt(federal)}</strong></div>
          <div><img src="/assets/09949.svg" alt="" />{state} income tax <strong>{fmt(stateAmount)}</strong></div>
          <div><img src="/assets/09949.svg" alt="" />FICA (Social Security + Medicare) <strong>{fmt(fica)}</strong></div>
          <hr />
          <div>Total tax <strong>{fmt(total)}</strong></div>
        </div>
      </div>
      <div className="tax-bottom">
        <Metric label="Average tax rate" value={pct(avgRate)} note="" />
        <Metric label="Assumed marginal rate" value={pct(marginal, 1)} note="" />
        <Metric
          label={monthly ? "Monthly after-tax income" : "Annual after-tax income"}
          value={fmt(afterTax)}
          note=""
        />
      </div>
      <p className="result-disclaimer">
        {currency}, {monthly ? "monthly" : "annual"} values unless noted. A
        simplified educational scenario—not a filing estimate. Tax brackets apply
        progressively; credits and individual circumstances can change your
        result.
      </p>
    </>
  );
}

/* Position a hover target over a donut segment. The donut is 242x242 with a
   226x226 ring centred at 8px,8px; the ring spans radius 83.62 to 113.
   Each segment is an annular wedge, so the target is a rotated rectangle
   covering that wedge's angular range. */
function donutHitStyle(key: string): React.CSSProperties {
  // The ring's angular layout (screen coords, y down):
  //   after-tax ring: 270deg clockwise to 198.90deg
  //   federal wedge:  196.13deg to 251.90deg
  //   state wedge:    251.92deg to 274.38deg
  // A full-circle target for the ring, and wedges for the two tax slices.
  if (key === "after") {
    // The ring is everything except the top-left gap; a full ring target
    // with a hole in the middle would be ideal, but a full circle works
    // because the wedges sit on top and take precedence.
    return { inset: "8px", width: "226px", height: "226px", top: 0, left: 0 };
  }
  if (key === "federal") {
    // Upper-left wedge.
    return { left: "8px", top: "8px", width: "105px", height: "105px" };
  }
  if (key === "state") {
    // Top wedge.
    return { left: "81px", top: "8px", width: "105px", height: "42px" };
  }
  // FICA has no visible slice in the artwork, so it is not hoverable.
  return { display: "none" };
}

/* ------------------------------------------------------------------ */
/* College savings                                                     */
/* ------------------------------------------------------------------ */

const RETURN_SCENARIOS: Record<string, number> = {
  Conservative: 0.03,
  Moderate: 0.05,
  Growth: 0.07,
  Custom: 0.05,
};

function CollegeForm({ currency }: { currency: Currency }) {
  const [country, setCountry] = useState<"United States" | "Canada">("United States");
  const [state, setState] = useState("California");
  const [scenario, setScenario] = useState("Moderate");
  const [customRate, setCustomRate] = useState("5");
  const [childAge, setChildAge] = useState("6");
  const [startAge, setStartAge] = useState("18");
  const [saved, setSaved] = useState("$12,000");
  const [monthly, setMonthly] = useState("$250");
  const regions = country === "Canada" ? CA_PROVINCES : US_STATES;

  return (
    <>
      <span className="mini-label">Country</span>
      <SegmentGroup
        options={["United States", "Canada"]}
        value={country}
        onChange={(next) => {
          setCountry(next as "United States" | "Canada");
          setState(next === "Canada" ? "Ontario" : "California");
        }}
      />
      <Field
        label="Province / territory"
        value={state}
        select
        options={regions}
        onChange={setState}
      />
      <div className="field-grid">
        <Field label="Child’s age today" value={childAge} suffix="years" numeric onChange={setChildAge} />
        <Field label="Education start age" value={startAge} suffix="years" numeric onChange={setStartAge} />
        <Field label="Already saved" value={saved} currency={currency} numeric onChange={setSaved} />
        <Field label="Monthly contribution" value={monthly} currency={currency} numeric onChange={setMonthly} />
      </div>
      <span className="mini-label">Investment return scenario</span>
      <SegmentGroup
        className="segments spread"
        options={["Conservative", "Moderate", "Growth", "Custom"]}
        value={scenario}
        onChange={setScenario}
      />
      {scenario === "Custom" && (
        <Field
          label="Custom annual return"
          value={customRate}
          suffix="%"
          numeric
          onChange={setCustomRate}
        />
      )}
      <Assumptions>
        4 education years · $18,000/year today · Cover 100% · Other funding $0
        · Cost inflation 3% · Moderate return 5%/year · Household income
        $100k–$150k. Grants excluded.
      </Assumptions>
      <p className="fine-print">
        {country === "Canada" ? "Canadian" : "US"} scenario in {currency}. Grants
        and eligibility are not guaranteed. No grant amount is included; actual
        tuition, living costs and returns vary.
      </p>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Debt repayment                                                      */
/* ------------------------------------------------------------------ */

function DebtCard({
  title,
  balance,
  apr,
  payment,
  currency,
  onRemove,
  onBalance,
  onApr,
  onPayment,
}: {
  title: string;
  balance: string;
  apr: string;
  payment: string;
  currency: Currency;
  onRemove: () => void;
  onBalance: (v: string) => void;
  onApr: (v: string) => void;
  onPayment: (v: string) => void;
}) {
  return (
    <div className="debt-card">
      <div className="debt-head">
        <strong>{title}</strong>
        <button
          className="debt-remove"
          type="button"
          aria-label={`Remove ${title}`}
          onClick={onRemove}
        >
          <img src="/assets/5ef8f.svg" alt="" />
        </button>
      </div>
      <div className="debt-fields">
        <Field label="Balance" value={balance} currency={currency} numeric onChange={onBalance} />
        <Field label="APR (%)" value={apr} numeric onChange={onApr} />
        <Field label="Min. / month" value={payment} currency={currency} numeric onChange={onPayment} />
      </div>
    </div>
  );
}

function DebtForm({
  currency,
  strategy,
  setStrategy,
  debts,
  setDebts,
  extra,
  setExtra,
}: {
  currency: Currency;
  strategy: string;
  setStrategy: (s: string) => void;
  debts: Array<{ title: string; balance: string; apr: string; payment: string }>;
  setDebts: (fn: (current: Array<{ title: string; balance: string; apr: string; payment: string }>) => Array<{ title: string; balance: string; apr: string; payment: string }>) => void;
  extra: string;
  setExtra: (v: string) => void;
}) {
  return (
    <>
      {debts.map((debt, index) => (
        <DebtCard
          key={index}
          title={debt.title}
          balance={debt.balance}
          apr={debt.apr}
          payment={debt.payment}
          currency={currency}
          onRemove={() =>
            setDebts((current) => current.filter((_, i) => i !== index))
          }
          onBalance={(v) =>
            setDebts((current) =>
              current.map((d, i) => (i === index ? { ...d, balance: v } : d)),
            )
          }
          onApr={(v) =>
            setDebts((current) =>
              current.map((d, i) => (i === index ? { ...d, apr: v } : d)),
            )
          }
          onPayment={(v) =>
            setDebts((current) =>
              current.map((d, i) => (i === index ? { ...d, payment: v } : d)),
            )
          }
        />
      ))}
      <button
        className="debt-add"
        type="button"
        onClick={() =>
          setDebts((current) => [
            ...current,
            { title: "New debt", balance: "$0", apr: "0", payment: "$0" },
          ])
        }
      >
        <img src="/assets/1bfb3.svg" alt="" /> Add another debt
      </button>
      <Field label="Extra monthly payment" value={extra} currency={currency} numeric onChange={setExtra} />
      <span className="mini-label">Preferred strategy</span>
      <SegmentGroup
        options={["Avalanche", "Snowball"]}
        value={strategy}
        onChange={setStrategy}
      />
      <p className="form-copy">
        Avalanche targets the highest APR first. Snowball targets the smallest
        balance for earlier wins.
      </p>
      <p className="fine-print">
        Illustrative, not personalized advice. Fixed APRs; interest added
        monthly. Fixed minimums and fixed extra payment roll over.
      </p>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Retirement                                                          */
/* ------------------------------------------------------------------ */

function RetirementForm({ currency }: { currency: Currency }) {
  const [scenario, setScenario] = useState("Moderate");
  const [ageToday, setAgeToday] = useState("40");
  const [retireAge, setRetireAge] = useState("65");
  const [monthly, setMonthly] = useState("$600");
  const [incomeGoal, setIncomeGoal] = useState("$4,500");
  return (
    <>
      <div className="field-grid">
        <Field label="Age today" value={ageToday} suffix="years" numeric onChange={setAgeToday} />
        <Field label="Retirement age" value={retireAge} suffix="years" numeric onChange={setRetireAge} />
      </div>
      <Field label="Monthly contribution" value={monthly} currency={currency} numeric onChange={setMonthly} />
      <Field label="Monthly income goal at retirement" value={incomeGoal} currency={currency} numeric onChange={setIncomeGoal} />
      <span className="mini-label">Investment return scenario</span>
      <SegmentGroup
        options={["Conservative", "Moderate", "Growth"]}
        value={scenario}
        onChange={setScenario}
      />
      <Assumptions>
        RRSP $80,000 · TFSA $30,000 · Other $10,000 · CPP/OAS $1,500/mo at 65
        · Plan through age 95 · Inflation 2% · Growth return 5% · Retirement
        return 3%.
      </Assumptions>
      <p className="fine-print">
        Illustrative, not personalized advice. All amounts are future nominal{" "}
        {currency}; {incomeGoal} is the goal at age 65.
      </p>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Compound interest                                                   */
/* ------------------------------------------------------------------ */

const COMPOUND_FREQUENCIES: Record<string, number> = {
  "Daily (365 times / year)": 365,
  "Monthly (12 times / year)": 12,
  "Quarterly (4 times / year)": 4,
  "Semi-annually (2 times / year)": 2,
  "Annually (1 time / year)": 1,
};

const CONTRIBUTION_FREQUENCIES: Record<string, number> = {
  Monthly: 12,
  Quarterly: 4,
  "Semi-annually": 2,
  Annually: 1,
};

function CompoundForm({ currency }: { currency: Currency }) {
  const [initial, setInitial] = useState("$10,000");
  const [years, setYears] = useState("10");
  const [rate, setRate] = useState("4");
  const [compoundFreq, setCompoundFreq] = useState("Daily (365 times / year)");
  const [contribution, setContribution] = useState("$100");
  const [contributionFreq, setContributionFreq] = useState("Monthly");
  return (
    <>
      <Field label="Initial deposit" value={initial} currency={currency} numeric onChange={setInitial} />
      <div className="field-grid">
        <Field label="Years of growth" value={years} suffix="years" numeric onChange={setYears} />
        <Field label="Estimated annual rate" value={rate} suffix="%" numeric onChange={setRate} />
      </div>
      <Field
        label="Compounding frequency"
        value={compoundFreq}
        select
        options={Object.keys(COMPOUND_FREQUENCIES)}
        onChange={setCompoundFreq}
      />
      <div className="field-grid">
        <Field label="Recurring contribution" value={contribution} currency={currency} numeric onChange={setContribution} />
        <Field
          label="Contribution frequency"
          value={contributionFreq}
          select
          options={Object.keys(CONTRIBUTION_FREQUENCIES)}
          onChange={setContributionFreq}
        />
      </div>
      <Assumptions>
        Contributions at period-end · Constant annual rate · {compoundFreq.toLowerCase()} compounding ·
        No taxes, fees or withdrawals · All values in {currency}.
      </Assumptions>
      <p className="fine-print">
        {rate}% is the annual rate before compounding, not APY. {compoundFreq.toLowerCase()} compounding
        gives an effective annual yield of about{" "}
        {pct(
          Math.pow(
            1 + Number(rate) / 100 / COMPOUND_FREQUENCIES[compoundFreq],
            COMPOUND_FREQUENCIES[compoundFreq],
          ) - 1,
        )}
        . Educational only, not investment advice.
      </p>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Input panel                                                         */
/* ------------------------------------------------------------------ */

function InputPanel({
  tool,
  currency,
  setCurrency,
  onStateChange,
  onIncomeChange,
  debtStrategy,
  setDebtStrategy,
  debts,
  setDebts,
  debtExtra,
  setDebtExtra,
}: {
  tool: Tool;
  currency: Currency;
  setCurrency: (c: Currency) => void;
  onStateChange: (state: string) => void;
  onIncomeChange: (income: number) => void;
  debtStrategy: string;
  setDebtStrategy: (s: string) => void;
  debts: Array<{ title: string; balance: string; apr: string; payment: string }>;
  setDebts: (fn: (current: Array<{ title: string; balance: string; apr: string; payment: string }>) => Array<{ title: string; balance: string; apr: string; payment: string }>) => void;
  debtExtra: string;
  setDebtExtra: (v: string) => void;
}) {
  // "CANADA · CAD" style meta, with USD · CAD as a clickable switch.
  const [metaPrefix] = tool.panelMeta.split(" · ");
  return (
    <section className="card input-card">
      <header className="card-header">
        <h2>{tool.panelTitle}</h2>
        <span className="panel-meta">
          {metaPrefix} ·{" "}
          <button
            type="button"
            className={currency === "USD" ? "cur active" : "cur"}
            onClick={() => setCurrency("USD")}
          >
            USD
          </button>
          {" · "}
          <button
            type="button"
            className={currency === "CAD" ? "cur active" : "cur"}
            onClick={() => setCurrency("CAD")}
          >
            CAD
          </button>
        </span>
      </header>
      <div className="form-body">
        {tool.id === "tax" && (
          <TaxForm
            currency={currency}
            onStateChange={onStateChange}
            onIncomeChange={onIncomeChange}
          />
        )}
        {tool.id === "college" && <CollegeForm currency={currency} />}
        {tool.id === "debt" && (
          <DebtForm
            currency={currency}
            strategy={debtStrategy}
            setStrategy={setDebtStrategy}
            debts={debts}
            setDebts={setDebts}
            extra={debtExtra}
            setExtra={setDebtExtra}
          />
        )}
        {tool.id === "retirement" && <RetirementForm currency={currency} />}
        {tool.id === "compound" && <CompoundForm currency={currency} />}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Charts                                                              */
/* ------------------------------------------------------------------ */

const chartAssets: Record<
  Exclude<ToolId, "tax">,
  {
    area: string;
    line: string;
    endpoint: string;
    area2?: string;
    line2?: string;
    endpoint2?: string;
  }
> = {
  college: {
    area: "/assets/38b99.svg",
    line: "/assets/b4297.svg",
    endpoint: "/assets/87459.svg",
    line2: "/assets/c3dc1.png",
    endpoint2: "/assets/6feb1.svg",
  },
  debt: {
    area: "/assets/25d2c.svg",
    line: "/assets/ab5c2.svg",
    endpoint: "/assets/87459.svg",
    line2: "/assets/560fe.svg",
    endpoint2: "/assets/e0950.svg",
  },
  retirement: {
    area: "/assets/7bbe7.svg",
    line: "/assets/bc6e8.svg",
    endpoint: "/assets/b9510.svg",
  },
  compound: {
    area: "/assets/a0a0f.svg",
    line: "/assets/04f3c.svg",
    endpoint: "/assets/6feb1.svg",
    area2: "/assets/86d26.svg",
    line2: "/assets/8961a.svg",
    endpoint2: "/assets/b9510.svg",
  },
};

/* The series a chart shows, with the label and value each hover reveals. */
type Series = {
  key: string;
  title: string;
  value: string;
  detail: string;
  /** Which artwork element this series covers. */
  target: "line" | "line2" | "area" | "area2";
};

function Chart({
  id,
  series,
}: {
  id: Exclude<ToolId, "tax">;
  series: Series[];
}) {
  const assets = chartAssets[id];
  const [active, setActive] = useState<Series | null>(null);
  const labels =
    id === "retirement"
      ? ["40", "45", "50", "55", "60", "65", "70", "75", "80", "85", "90", "95"]
      : id === "compound"
        ? ["0", "2", "4", "6", "8", "10"]
        : id === "debt"
          ? ["0", "4", "8", "12", "16", "20", "24"]
          : ["6", "8", "10", "12", "14", "16", "18"];
  const y =
    id === "retirement"
      ? ["$1m", "$750k", "$500k", "$250k", "$0"]
      : id === "college"
        ? ["$120k", "$90k", "$60k", "$30k", "$0"]
        : id === "debt"
          ? ["$12k", "$9k", "$6k", "$3k", "$0"]
          : ["$30k", "$22.5k", "$15k", "$7.5k", "$0"];

  return (
    <div className={`chart chart-${id}`}>
      <div className="y-labels">{y.map((item) => <span key={item}>{item}</span>)}</div>
      <div className="plot">
        {[0, 1, 2, 3, 4].map((line) => <i key={line} />)}
        {assets.area2 && <img className="chart-area second" src={assets.area2} alt="" />}
        <img className="chart-area" src={assets.area} alt="" />
        {assets.line2 && <img className="chart-line second" src={assets.line2} alt="" />}
        <img className="chart-line" src={assets.line} alt="" />
        {assets.endpoint2 && <img className="chart-endpoint second" src={assets.endpoint2} alt="" />}
        <img className="chart-endpoint" src={assets.endpoint} alt="" />
        {id === "retirement" && (
          <>
            <b className="retire-line" />
            <em>Retire · 65</em>
          </>
        )}
        {/* Hover targets: one per series, positioned over its artwork. */}
        {series.map((s) => (
          <button
            key={s.key}
            type="button"
            className="chart-hit"
            aria-label={`${s.title}: ${s.value}`}
            style={hitStyle(s.target, id)}
            onMouseOver={() => setActive(s)}
            onMouseOut={() => setActive(null)}
            onFocus={() => setActive(s)}
            onBlur={() => setActive(null)}
          />
        ))}
        {active && (
          <div className="chart-tip show">
            <strong>{active.title}</strong>
            <span>{active.value}</span>
            <span>{active.detail}</span>
          </div>
        )}
      </div>
      <div className="x-labels">{labels.map((item) => <span key={item}>{item}</span>)}</div>
      <small className="axis-title">
        {id === "college"
          ? "CHILD’S AGE (YEARS)"
          : id === "debt"
            ? "MONTHS FROM TODAY"
            : id === "retirement"
              ? "YOUR AGE (YEARS)"
              : "YEARS OF GROWTH"}
      </small>
    </div>
  );
}

/* Position a hover target over the artwork it represents. The plot is
   720x236 with the gridlines at 22/65.5/109/152.5/196, so each series is
   given a band that follows its line. */
function hitStyle(target: Series["target"], id: Exclude<ToolId, "tax">): React.CSSProperties {
  // Each band spans the plot width and the vertical range of that series.
  // Keys are prefixed to avoid colliding with CSS property names.
  const bands: Record<string, Record<string, React.CSSProperties>> = {
    college: {
      line: { left: "8%", top: "38%", width: "88%", height: "26%" },
      line2: { left: "8%", top: "16%", width: "88%", height: "22%" },
    },
    debt: {
      line: { left: "8%", top: "8%", width: "88%", height: "40%" },
      line2: { left: "8%", top: "8%", width: "88%", height: "40%" },
    },
    retirement: {
      line: { left: "8%", top: "24%", width: "88%", height: "30%" },
    },
    compound: {
      line: { left: "8%", top: "28%", width: "88%", height: "22%" },
      line2: { left: "8%", top: "9%", width: "88%", height: "24%" },
    },
  };
  return bands[id]?.[target] ?? { left: "8%", top: "20%", width: "88%", height: "30%" };
}

function Metric({
  label,
  value,
  note,
  warning,
  success,
}: {
  label: string;
  value: string;
  note: string;
  warning?: boolean;
  success?: boolean;
}) {
  return (
    <div className="metric">
      <span>{label}</span>
      <strong className={warning ? "warning" : success ? "success" : ""}>{value}</strong>
      <small>{note}</small>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Report banner                                                       */
/* ------------------------------------------------------------------ */

function ReportBanner({ tool }: { tool: Tool }) {
  return (
    <section className="report" style={{ background: tool.soft }}>
      <div className="report-icon"><img src="/assets/bb96e.svg" alt="" /></div>
      <div className="report-copy">
        <span>FROM ESTIMATE TO NEXT STEP</span>
        <h2>{tool.reportTitle}</h2>
        <p>{tool.reportCopy}</p>
      </div>
      <form className="report-form" onSubmit={(event) => event.preventDefault()}>
        <label>
          <img src="/assets/6bffe.svg" alt="" />
          <input type="email" placeholder="Your email address" aria-label="Your email address" />
        </label>
        <button type="submit">{tool.reportButton}</button>
        <small>We’ll email a verification link to access your plan. No marketing signup.</small>
      </form>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Chart result - metrics computed live, chart kept as designed        */
/* ------------------------------------------------------------------ */

function ChartResult({
  tool,
  currency,
  debtStrategy,
  debts,
  debtExtra,
}: {
  tool: Tool;
  currency: Currency;
  debtStrategy: string;
  debts: Array<{ title: string; balance: string; apr: string; payment: string }>;
  debtExtra: string;
}) {
  const id = tool.id as Exclude<ToolId, "tax">;

  // The metrics are computed from the same assumptions the chart shows.
  const metrics: Array<Parameters<typeof Metric>[0]> = (() => {
    if (id === "college") {
      const years = 12;
      const rate = 0.05;
      const saved = 12000;
      const monthly = 250;
      const fvSaved = saved * Math.pow(1 + rate, years);
      let fvContrib = 0;
      for (let m = 1; m <= years * 12; m++) {
        fvContrib += monthly * Math.pow(1 + rate, (years * 12 - m) / 12);
      }
      const total = fvSaved + fvContrib;
      const goal = 102655;
      const gap = goal - total;
      // The monthly contribution that would close the gap at the same rate.
      // Solve fvSaved + PMT * annuityFactor = goal, so the annuity must cover
      // the goal less what the existing savings already grow to.
      const rm = rate / 12;
      const annuityFactor = (Math.pow(1 + rm, years * 12) - 1) / rm;
      const needed = Math.max(0, (goal - fvSaved) / annuityFactor);
      return [
        { label: "Education funding goal", value: money(goal, currency), note: "4 years, priced at start age" },
        { label: "Estimated funding gap", value: money(Math.max(0, gap), currency), note: "No grants or other funding", warning: true },
        { label: "Contribution to close gap", value: `${money(needed, currency)}/mo`, note: `${money(Math.max(0, needed - monthly), currency)} more each month` },
      ];
    }
    if (id === "debt") {
      const parsed = debts.map((d) => ({
        bal: parseMoney(d.balance),
        apr: (Number(d.apr) || 0) / 100,
        min: parseMoney(d.payment),
      }));
      const extra = parseMoney(debtExtra);
      const av = payoffDebts(parsed, extra, "Avalanche");
      const sn = payoffDebts(parsed, extra, "Snowball");
      const totalMin = parsed.reduce((s, d) => s + d.min, 0);
      const chosen = debtStrategy === "Snowball" ? sn : av;
      return [
        { label: "Total monthly payment", value: money(totalMin + extra, currency), note: `${money(totalMin, currency)} minimums + ${money(extra, currency)} extra` },
        { label: "Total interest", value: money(chosen.interest, currency), note: `${debtStrategy} · debt-free in ${chosen.months} months` },
        { label: "Other strategy", value: money(debtStrategy === "Snowball" ? av.interest : sn.interest, currency), note: `${debtStrategy === "Snowball" ? "Avalanche" : "Snowball"} · ${debtStrategy === "Snowball" ? av.months : sn.months} months` },
      ];
    }
    if (id === "retirement") {
      const cur = 120000;
      const monthly = 600;
      const rate = 0.05;
      const years = 25;
      const fvCur = cur * Math.pow(1 + rate, years);
      let fvContrib = 0;
      for (let m = 1; m <= years * 12; m++) {
        fvContrib += monthly * Math.pow(1 + rate, (years * 12 - m) / 12);
      }
      const total = fvCur + fvContrib;
      // A 4% initial annual draw, rising 2% a year, plus assumed CPP/OAS.
      const draw = total * 0.04;
      const cppOas = 1500 * 12;
      const income = draw + cppOas;
      const goal = 4500 * 12;
      return [
        { label: "Estimated annual income", value: money(income, currency), note: "4% initial draw + assumed CPP/OAS" },
        { label: "Annual income goal", value: money(goal, currency), note: "Future dollars at age 65" },
        { label: "Annual funding gap", value: money(Math.max(0, goal - income), currency), note: "Before tax", warning: true },
      ];
    }
    // compound
    const P = 10000;
    const PMT = 100;
    const r = 0.04;
    const n = 365;
    const t = 10;
    const fvInitial = P * Math.pow(1 + r / n, n * t);
    let fvContrib = 0;
    for (let m = 1; m <= 120; m++) {
      fvContrib += PMT * Math.pow(1 + r / n, (120 - m) * (365 / 12));
    }
    const total = fvInitial + fvContrib;
    const deposits = P + PMT * 120;
    return [
      { label: "Total deposits", value: money(deposits, currency), note: `${money(P, currency)} initial + ${money(PMT * 120, currency)} recurring` },
      { label: "Interest earned", value: money(total - deposits, currency, 2), note: `${pct((total - deposits) / total, 1)} of your ending balance`, success: true },
      { label: "Without contributions", value: money(fvInitial, currency, 2), note: "Same deposit, rate and horizon" },
    ];
  })();

  const chartTitle: Record<typeof id, string> = {
    college: `Savings vs. education funding goal · ${currency}`,
    debt: `Remaining total debt by strategy · ${currency}`,
    retirement: `Savings buildup & retirement withdrawals · ${currency}`,
    compound: `Your deposits + compounded growth · ${currency}`,
  };

  // The hover series, with the values each one reveals.
  const series: Series[] = (() => {
    if (id === "college") {
      const years = 12;
      const rate = 0.05;
      const saved = 12000;
      const monthly = 250;
      const fvSaved = saved * Math.pow(1 + rate, years);
      let fvContrib = 0;
      for (let m = 1; m <= years * 12; m++) {
        fvContrib += monthly * Math.pow(1 + rate, (years * 12 - m) / 12);
      }
      return [
        {
          key: "savings",
          title: "Projected savings",
          value: money(fvSaved + fvContrib, currency),
          detail: `${money(saved, currency)} already saved plus ${money(monthly, currency)}/month at ${(rate * 100).toFixed(0)}%`,
          target: "line",
        },
        {
          key: "goal",
          title: "Education funding goal",
          value: money(102655, currency),
          detail: "4 years at $18,000/year today, rising 3% a year",
          target: "line2",
        },
      ];
    }
    if (id === "debt") {
      const parsed = debts.map((d) => ({
        bal: parseMoney(d.balance),
        apr: (Number(d.apr) || 0) / 100,
        min: parseMoney(d.payment),
      }));
      const extra = parseMoney(debtExtra);
      const av = payoffDebts(parsed, extra, "Avalanche");
      const sn = payoffDebts(parsed, extra, "Snowball");
      return [
        {
          key: "avalanche",
          title: "Avalanche",
          value: `${av.months} months · ${money(av.interest, currency)} interest`,
          detail: "Highest APR first - usually the cheaper path",
          target: "line",
        },
        {
          key: "snowball",
          title: "Snowball",
          value: `${sn.months} months · ${money(sn.interest, currency)} interest`,
          detail: "Smallest balance first - earlier wins",
          target: "line2",
        },
      ];
    }
    if (id === "retirement") {
      const cur = 120000;
      const monthly = 600;
      const rate = 0.05;
      const years = 25;
      const fvCur = cur * Math.pow(1 + rate, years);
      let fvContrib = 0;
      for (let m = 1; m <= years * 12; m++) {
        fvContrib += monthly * Math.pow(1 + rate, (years * 12 - m) / 12);
      }
      return [
        {
          key: "savings",
          title: "Projected savings",
          value: money(fvCur + fvContrib, currency),
          detail: `${money(cur, currency)} today plus ${money(monthly, currency)}/month at ${(rate * 100).toFixed(0)}% for ${years} years`,
          target: "line",
        },
      ];
    }
    // compound
    const P = 10000;
    const PMT = 100;
    const r = 0.04;
    const n = 365;
    const t = 10;
    const fvInitial = P * Math.pow(1 + r / n, n * t);
    let fvContrib = 0;
    for (let m = 1; m <= 120; m++) {
      fvContrib += PMT * Math.pow(1 + r / n, (120 - m) * (365 / 12));
    }
    const total = fvInitial + fvContrib;
    const deposits = P + PMT * 120;
    return [
      {
        key: "balance",
        title: "Total balance (deposits + interest)",
        value: money(total, currency, 2),
        detail: `${money(total - deposits, currency, 2)} earned on ${money(deposits, currency)} of deposits`,
        target: "line2",
      },
      {
        key: "deposits",
        title: "Total deposits",
        value: money(deposits, currency),
        detail: `${money(P, currency)} initial plus ${money(PMT, currency)}/month`,
        target: "line",
      },
    ];
  })();

  const callout: Record<typeof id, { title: string; copy: string }> = {
    college: {
      title: "A little more today can open more doors.",
      copy: "At the same 5% return, a higher monthly contribution would meet this goal. Revisit the plan as costs, contributions and grant eligibility change.",
    },
    debt: {
      title: "Avalanche · less interest                 Snowball · smaller balance first",
      copy: "Avalanche targets the highest APR first and usually costs less overall. Snowball clears the smallest balance first for earlier wins.",
    },
    retirement: {
      title: "Build up first. Draw down thoughtfully.",
      copy: "Income assumes a 4% initial annual draw plus CPP/OAS. The savings draw rises 2% yearly; the chart assumes 3% returns after age 65.",
    },
    compound: {
      title: "The space between the lines is your interest.",
      copy: "Deposits grow steadily. Your total balance curves upward as interest begins earning its own interest. Time and consistency do the heavy lifting.",
    },
  };

  return (
    <>
      <div className="metrics">
        {metrics.map((metric) => <Metric key={metric.label} {...metric} />)}
      </div>
      <div className="result-divider" />
      <h3 className="chart-title">{chartTitle[id]}</h3>
      <Chart id={id} series={series} />
      <div className="legend">
        <span><i style={{ background: tool.accent }} />{id === "debt" ? "Avalanche" : id === "compound" ? "Total balance (deposits + interest)" : "Projected savings"}</span>
        {id !== "retirement" && <span><i className="gold-line" />{id === "debt" ? "Snowball" : id === "college" ? "Education goal" : "Total deposits"}</span>}
      </div>
      <div className="callout" style={{ background: tool.soft }}>
        <strong>{callout[id].title}</strong>
        <p>{callout[id].copy}</p>
      </div>
      <p className="result-disclaimer">
        Illustrative, not personalized advice. Values are estimates in {currency};
        assumptions, timing, rates and real-world conditions can affect actual
        results.
      </p>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Result panel                                                        */
/* ------------------------------------------------------------------ */

function ResultPanel({
  tool,
  currency,
  state,
  income,
  debtStrategy,
  debts,
  debtExtra,
}: {
  tool: Tool;
  currency: Currency;
  state: string;
  income: number;
  debtStrategy: string;
  debts: Array<{ title: string; balance: string; apr: string; payment: string }>;
  debtExtra: string;
}) {
  const [monthly, setMonthly] = useState(false);

  // The headline figure and note are computed per tool.
  const headline = (() => {
    if (tool.id === "tax") {
      const afterTax = income - (federalTax(income) + stateTax(state, income) + ficaTax(income));
      return {
        value: money(monthly ? afterTax / 12 : afterTax, currency),
        note: `You keep ${pct(income > 0 ? afterTax / income : 0)} of your employment income`,
      };
    }
    if (tool.id === "college") {
      const years = 12;
      const rate = 0.05;
      const saved = 12000;
      const monthly = 250;
      const fvSaved = saved * Math.pow(1 + rate, years);
      let fvContrib = 0;
      for (let m = 1; m <= years * 12; m++) {
        fvContrib += monthly * Math.pow(1 + rate, (years * 12 - m) / 12);
      }
      const total = fvSaved + fvContrib;
      const goal = 102655;
      return {
        value: money(total, currency),
        note: `${pct(total / goal, 1)} of the illustrative education goal funded`,
      };
    }
    if (tool.id === "debt") {
      const parsed = debts.map((d) => ({
        bal: parseMoney(d.balance),
        apr: (Number(d.apr) || 0) / 100,
        min: parseMoney(d.payment),
      }));
      const res = payoffDebts(parsed, parseMoney(debtExtra), debtStrategy as "Avalanche" | "Snowball");
      return {
        value: `${res.months} months`,
        note: `About ${money(res.interest, currency)} in interest on the ${debtStrategy.toLowerCase()} path`,
      };
    }
    if (tool.id === "retirement") {
      const cur = 120000;
      const monthly = 600;
      const rate = 0.05;
      const years = 25;
      const fvCur = cur * Math.pow(1 + rate, years);
      let fvContrib = 0;
      for (let m = 1; m <= years * 12; m++) {
        fvContrib += monthly * Math.pow(1 + rate, (years * 12 - m) / 12);
      }
      return {
        value: money(fvCur + fvContrib, currency),
        note: "A 25-year runway for your next chapter",
      };
    }
    // compound
    const P = 10000;
    const PMT = 100;
    const r = 0.04;
    const n = 365;
    const t = 10;
    const fvInitial = P * Math.pow(1 + r / n, n * t);
    let fvContrib = 0;
    for (let m = 1; m <= 120; m++) {
      fvContrib += PMT * Math.pow(1 + r / n, (120 - m) * (365 / 12));
    }
    return {
      value: money(fvInitial + fvContrib, currency, 2),
      note: "Your money earns. Then those earnings earn, too.",
    };
  })();

  return (
    <section className="card result-card">
      <header className="card-header">
        <h2>{tool.resultTitle}</h2>
        <span>{tool.resultMeta}</span>
      </header>
      <div className="result-top">
        <span>{tool.resultLabel}</span>
        <div>
          <strong>{headline.value}</strong>
          <small>{currency}</small>
        </div>
        <p style={{ color: tool.accent }}>{headline.note}</p>
        {tool.id !== "tax" && <b className="illustrative">ILLUSTRATIVE</b>}
        {tool.id === "tax" && (
          <div className="yearly-toggle">
            <button
              type="button"
              className={monthly ? "" : "active"}
              onClick={() => setMonthly(false)}
            >
              Yearly
            </button>
            <button
              type="button"
              className={monthly ? "active" : ""}
              onClick={() => setMonthly(true)}
            >
              Monthly
            </button>
          </div>
        )}
      </div>
      {tool.id === "tax" ? (
        <TaxResult state={state} currency={currency} monthly={monthly} income={income} />
      ) : (
        <ChartResult
          tool={tool}
          currency={currency}
          debtStrategy={debtStrategy}
          debts={debts}
          debtExtra={debtExtra}
        />
      )}
    </section>
  );
}

/** Simulate paying off a list of debts with a fixed extra payment. */
function payoffDebts(
  debts: Array<{ bal: number; apr: number; min: number }>,
  extra: number,
  strategy: "Avalanche" | "Snowball",
) {
  const b = debts.map((d) => ({ ...d }));
  let months = 0;
  let interest = 0;
  while (b.some((d) => d.bal > 0.005) && months < 600) {
    months++;
    for (const d of b) {
      if (d.bal > 0) {
        const i = (d.bal * d.apr) / 12;
        d.bal += i;
        interest += i;
      }
    }
    for (const d of b) {
      const p = Math.min(d.min, d.bal);
      d.bal -= p;
    }
    let rem = extra;
    const order = [...b]
      .filter((d) => d.bal > 0)
      .sort((a, c) =>
        strategy === "Avalanche" ? c.apr - a.apr : a.bal - c.bal,
      );
    for (const d of order) {
      const p = Math.min(rem, d.bal);
      d.bal -= p;
      rem -= p;
      if (rem <= 0) break;
    }
  }
  return { months, interest };
}

export default function App() {
  const [activeId, setActiveId] = useState<ToolId>(
    () => toolFromPath(window.location.pathname) ?? "tax",
  );
  // Default currency is always USD; CAD is opt-in.
  const [currency, setCurrency] = useState<Currency>("USD");
  // The province/state chosen in the tax form, shown in the results.
  const [state, setState] = useState("California");
  // The income typed in the tax form, so the results can recompute.
  const [income, setIncome] = useState(80000);
  // Debt inputs are lifted so the result panel can recompute from them.
  const [debtStrategy, setDebtStrategy] = useState("Avalanche");
  const [debts, setDebts] = useState([
    { title: "Credit card", balance: "$8,000", apr: "19.99", payment: "$240" },
    { title: "Personal loan", balance: "$4,000", apr: "6.99", payment: "$120" },
  ]);
  const [debtExtra, setDebtExtra] = useState("$250");
  const tool = tools.find((item) => item.id === activeId)!;

  // Keep the URL in step with the selected tool.
  useEffect(() => {
    const target = toolRoutes[activeId];
    if (window.location.pathname !== target) {
      window.history.pushState({}, "", target);
    }
  }, [activeId]);

  // Follow browser back / forward navigation.
  useEffect(() => {
    const onPop = () => {
      const next = toolFromPath(window.location.pathname);
      if (next) setActiveId(next);
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  return (
    <main className="page" style={{ "--accent": tool.accent } as React.CSSProperties}>
      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow"><i />{tool.eyebrow}</div>
          <h1>{tool.title}<em>{tool.serifTitle}</em></h1>
          <p>{tool.description}</p>
        </div>
        <div className="hero-art"><img src={tool.artwork} alt="" /></div>
      </section>

      <nav className="tool-nav" aria-label="Financial tools">
        {tools.map((item) => {
          const active = item.id === activeId;
          return (
            <button
              className={active ? "active" : ""}
              key={item.id}
              onClick={() => setActiveId(item.id)}
              type="button"
            >
              <img src={active ? item.activeIcon : navIcons[item.id]} alt="" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="workspace">
        <InputPanel
          tool={tool}
          currency={currency}
          setCurrency={setCurrency}
          onStateChange={setState}
          onIncomeChange={setIncome}
          debtStrategy={debtStrategy}
          setDebtStrategy={setDebtStrategy}
          debts={debts}
          setDebts={setDebts}
          debtExtra={debtExtra}
          setDebtExtra={setDebtExtra}
        />
        <ResultPanel
          tool={tool}
          currency={currency}
          state={state}
          income={income}
          debtStrategy={debtStrategy}
          debts={debts}
          debtExtra={debtExtra}
        />
      </div>
      <ReportBanner tool={tool} />
    </main>
  );
}
