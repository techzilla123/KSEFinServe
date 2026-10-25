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
  const cleaned = text.replace(/[^\d.]/g, "");
  if (!cleaned) return 0;
  const value = Number(cleaned);
  return Number.isFinite(value) ? value : 0;
}

/** Format a number for a money input (keeps the $ and grouped commas). */
function formatMoneyInput(value: number): string {
  return "$" + groupThousands(String(Math.round(value)));
}

function pct(value: number, decimals = 2): string {
  return (value * 100).toFixed(decimals) + "%";
}

/** Group thousands with commas: 1000000 -> "1,000,000". */
function groupThousands(digits: string): string {
  // Split off any decimal part so grouping only applies to the whole number.
  const [whole, ...rest] = digits.split(".");
  const grouped = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return rest.length ? grouped + "." + rest.join(".") : grouped;
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
    setCurrent(value);
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
          value={current}
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
              // Money fields keep a leading "$" and group thousands as you type.
              const digits = event.target.value.replace(/[^\d]/g, "");
              const next = "$" + groupThousands(digits);
              setCurrent(next);
              onChange?.(next);
              return;
            }
            setCurrent(event.target.value);
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
  // Where the donut tooltip sits, relative to the donut.
  const [donutTipPos, setDonutTipPos] = useState({ x: 0, y: 0 });
  const donutRef = useRef<HTMLDivElement>(null);

  /** Keep the donut tooltip next to the pointer, clamped inside the row. */
  function moveDonutTip(event: React.MouseEvent) {
    const row = donutRef.current?.closest(".tax-result-row") as HTMLElement | null;
    if (!row) return;
    const rect = row.getBoundingClientRect();
    const rawX = event.clientX - rect.left + 16;
    const rawY = event.clientY - rect.top + 16;
    const x = Math.max(8, Math.min(rawX, rect.width - 232));
    const y = Math.max(8, Math.min(rawY, rect.height - 110));
    setDonutTipPos({ x, y });
  }

  const fmt = (value: number) => money(monthly ? value / 12 : value, currency);

  // The donut is drawn from the computed amounts, so the slices always match
  // the numbers. Each slice is an annular wedge in a 226x226 box.
  const donutSlices = (() => {
    const cx = 113;
    const cy = 113;
    const outer = 113;
    const inner = 83.62;
    const parts = [
      { key: "after", value: Math.max(0, afterTax), color: "#1678BD" },
      { key: "federal", value: Math.max(0, federal), color: "#7650B2" },
      { key: "state", value: Math.max(0, stateAmount), color: "#C9A963" },
      { key: "fica", value: Math.max(0, fica), color: "#7A8B99" },
    ];
    const sum = parts.reduce((s, p) => s + p.value, 0) || 1;
    // Start at the top and sweep clockwise, matching the original artwork.
    let angle = -90;
    return parts
      .filter((p) => p.value > 0)
      .map((p) => {
        const sweep = (p.value / sum) * 360;
        const start = angle;
        const end = angle + sweep;
        angle = end;
        const rad = (a: number) => (a * Math.PI) / 180;
        const pt = (r: number, a: number) =>
          `${(cx + r * Math.cos(rad(a))).toFixed(2)} ${(cy + r * Math.sin(rad(a))).toFixed(2)}`;
        const large = sweep > 180 ? 1 : 0;
        const d =
          `M${pt(outer, start)} ` +
          `A${outer} ${outer} 0 ${large} 1 ${pt(outer, end)} ` +
          `L${pt(inner, end)} ` +
          `A${inner} ${inner} 0 ${large} 0 ${pt(inner, start)} Z`;
        return { key: p.key, path: d, color: p.color };
      });
  })();

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
        <div className="donut" ref={donutRef}>
          <svg className="donut-svg" viewBox="0 0 226 226" aria-hidden="true">
            {donutSlices.map((s) => (
              <path key={s.key} d={s.path} fill={s.color} />
            ))}
          </svg>
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
              onMouseMove={(e) => moveDonutTip(e)}
              onMouseOver={() => setActiveSegment(s)}
              onMouseOut={() => setActiveSegment(null)}
              onFocus={() => setActiveSegment(s)}
              onBlur={() => setActiveSegment(null)}
            />
          ))}
        </div>
        <div className="tax-legend">
          <div><img src="/assets/70ff4.svg" alt="" />After-tax income <strong>{fmt(afterTax)}</strong></div>
          <div><img src="/assets/8b5d9.svg" alt="" />Federal income tax <strong>{fmt(federal)}</strong></div>
          <div><img src="/assets/09949.svg" alt="" />{state} income tax <strong>{fmt(stateAmount)}</strong></div>
          <div><img src="/assets/09949.svg" alt="" />FICA (Social Security + Medicare) <strong>{fmt(fica)}</strong></div>
          <hr />
          <div>Total tax <strong>{fmt(total)}</strong></div>
        </div>
        {/* The tooltip lives outside the donut so it is never clipped. */}
        {activeSegment && (
          <div
            className="donut-tip show"
            style={{ left: donutTipPos.x, top: donutTipPos.y }}
          >
            <strong>{activeSegment.title}</strong>
            <span>{activeSegment.value}</span>
            <span>{activeSegment.detail}</span>
          </div>
        )}
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
   Each target is a rotated rectangle covering that slice's angular range. */
function donutHitStyle(key: string): React.CSSProperties {
  // The slices are drawn from the computed amounts, so the targets follow the
  // same layout: after-tax first (from the top, clockwise), then federal,
  // state and FICA. A full-ring target for the largest slice and wedges for
  // the rest; the later targets sit on top so the smaller slices win.
  if (key === "after") {
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
  // FICA is the last slice; a thin band on the right.
  return { left: "150px", top: "8px", width: "84px", height: "60px" };
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

function CollegeForm({
  currency,
  country,
  setCountry,
  state,
  setState,
  scenario,
  setScenario,
  customRate,
  setCustomRate,
  childAge,
  setChildAge,
  startAge,
  setStartAge,
  saved,
  setSaved,
  monthly,
  setMonthly,
}: {
  currency: Currency;
  country: string;
  setCountry: (v: string) => void;
  state: string;
  setState: (v: string) => void;
  scenario: string;
  setScenario: (v: string) => void;
  customRate: string;
  setCustomRate: (v: string) => void;
  childAge: string;
  setChildAge: (v: string) => void;
  startAge: string;
  setStartAge: (v: string) => void;
  saved: string;
  setSaved: (v: string) => void;
  monthly: string;
  setMonthly: (v: string) => void;
}) {
  const regions = country === "Canada" ? CA_PROVINCES : US_STATES;
  const rate = scenario === "Custom" ? Number(customRate) / 100 : RETURN_SCENARIOS[scenario] ?? 0.05;

  return (
    <>
      <span className="mini-label">Country</span>
      <SegmentGroup
        options={["United States", "Canada"]}
        value={country}
        onChange={(next) => {
          setCountry(next);
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
        <Field label="Child’s age today" value={childAge} suffix="years" onChange={setChildAge} />
        <Field label="Education start age" value={startAge} suffix="years" onChange={setStartAge} />
        <Field label="Already saved" value={saved} currency={currency} numeric onChange={setSaved} />
        <Field label="Monthly contribution" value={monthly} currency={currency} numeric onChange={setMonthly} />
      </div>
      {Number(startAge) < Number(childAge) && (
        <p className="field-warning">
          Education start age cannot be earlier than the child’s current age.
        </p>
      )}
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
          onChange={setCustomRate}
        />
      )}
      <Assumptions>
        4 education years · $18,000/year today · Cover 100% · Other funding $0
        · Cost inflation 3% · Return {(rate * 100).toFixed(0)}%/year · Household income
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
        <Field label="APR (%)" value={apr} onChange={onApr} />
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

const RETIREMENT_SCENARIOS: Record<string, number> = {
  Conservative: 0.03,
  Moderate: 0.05,
  Growth: 0.07,
};

function RetirementForm({
  currency,
  scenario,
  setScenario,
  ageToday,
  setAgeToday,
  retireAge,
  setRetireAge,
  monthly,
  setMonthly,
  incomeGoal,
  setIncomeGoal,
}: {
  currency: Currency;
  scenario: string;
  setScenario: (v: string) => void;
  ageToday: string;
  setAgeToday: (v: string) => void;
  retireAge: string;
  setRetireAge: (v: string) => void;
  monthly: string;
  setMonthly: (v: string) => void;
  incomeGoal: string;
  setIncomeGoal: (v: string) => void;
}) {
  const rate = RETIREMENT_SCENARIOS[scenario] ?? 0.05;
  return (
    <>
      <div className="field-grid">
        <Field label="Age today" value={ageToday} suffix="years" onChange={setAgeToday} />
        <Field label="Retirement age" value={retireAge} suffix="years" onChange={setRetireAge} />
      </div>
      {Number(retireAge) <= Number(ageToday) && (
        <p className="field-warning">
          Retirement age must be later than your current age.
        </p>
      )}
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
        · Plan through age 95 · Inflation 2% · Growth return {(rate * 100).toFixed(0)}% · Retirement
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

function CompoundForm({
  currency,
  initial,
  setInitial,
  years,
  setYears,
  rate,
  setRate,
  compoundFreq,
  setCompoundFreq,
  contribution,
  setContribution,
  contributionFreq,
  setContributionFreq,
}: {
  currency: Currency;
  initial: string;
  setInitial: (v: string) => void;
  years: string;
  setYears: (v: string) => void;
  rate: string;
  setRate: (v: string) => void;
  compoundFreq: string;
  setCompoundFreq: (v: string) => void;
  contribution: string;
  setContribution: (v: string) => void;
  contributionFreq: string;
  setContributionFreq: (v: string) => void;
}) {
  const n = COMPOUND_FREQUENCIES[compoundFreq] ?? 365;
  const apy = Math.pow(1 + Number(rate) / 100 / n, n) - 1;
  return (
    <>
      <Field label="Initial deposit" value={initial} currency={currency} numeric onChange={setInitial} />
      <div className="field-grid">
        <Field label="Years of growth" value={years} suffix="years" onChange={setYears} />
        <Field label="Estimated annual rate" value={rate} suffix="%" onChange={setRate} />
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
        gives an effective annual yield of about {pct(apy)}. Educational only, not
        investment advice.
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
  college,
  setCollege,
  retirement,
  setRetirement,
  compound,
  setCompound,
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
  college: CollegeInputs;
  setCollege: (fn: (c: CollegeInputs) => CollegeInputs) => void;
  retirement: RetirementInputs;
  setRetirement: (fn: (r: RetirementInputs) => RetirementInputs) => void;
  compound: CompoundInputs;
  setCompound: (fn: (c: CompoundInputs) => CompoundInputs) => void;
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
        {tool.id === "college" && (
          <CollegeForm
            currency={currency}
            country={college.country}
            setCountry={(v) => setCollege((c) => ({ ...c, country: v }))}
            state={college.state}
            setState={(v) => setCollege((c) => ({ ...c, state: v }))}
            scenario={college.scenario}
            setScenario={(v) => setCollege((c) => ({ ...c, scenario: v }))}
            customRate={college.customRate}
            setCustomRate={(v) => setCollege((c) => ({ ...c, customRate: v }))}
            childAge={college.childAge}
            setChildAge={(v) => setCollege((c) => ({ ...c, childAge: v }))}
            startAge={college.startAge}
            setStartAge={(v) => setCollege((c) => ({ ...c, startAge: v }))}
            saved={college.saved}
            setSaved={(v) => setCollege((c) => ({ ...c, saved: v }))}
            monthly={college.monthly}
            setMonthly={(v) => setCollege((c) => ({ ...c, monthly: v }))}
          />
        )}
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
        {tool.id === "retirement" && (
          <RetirementForm
            currency={currency}
            scenario={retirement.scenario}
            setScenario={(v) => setRetirement((r) => ({ ...r, scenario: v }))}
            ageToday={retirement.ageToday}
            setAgeToday={(v) => setRetirement((r) => ({ ...r, ageToday: v }))}
            retireAge={retirement.retireAge}
            setRetireAge={(v) => setRetirement((r) => ({ ...r, retireAge: v }))}
            monthly={retirement.monthly}
            setMonthly={(v) => setRetirement((r) => ({ ...r, monthly: v }))}
            incomeGoal={retirement.incomeGoal}
            setIncomeGoal={(v) => setRetirement((r) => ({ ...r, incomeGoal: v }))}
          />
        )}
        {tool.id === "compound" && (
          <CompoundForm
            currency={currency}
            initial={compound.initial}
            setInitial={(v) => setCompound((c) => ({ ...c, initial: v }))}
            years={compound.years}
            setYears={(v) => setCompound((c) => ({ ...c, years: v }))}
            rate={compound.rate}
            setRate={(v) => setCompound((c) => ({ ...c, rate: v }))}
            compoundFreq={compound.compoundFreq}
            setCompoundFreq={(v) => setCompound((c) => ({ ...c, compoundFreq: v }))}
            contribution={compound.contribution}
            setContribution={(v) => setCompound((c) => ({ ...c, contribution: v }))}
            contributionFreq={compound.contributionFreq}
            setContributionFreq={(v) => setCompound((c) => ({ ...c, contributionFreq: v }))}
          />
        )}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Charts                                                              */
/* ------------------------------------------------------------------ */

/* The series a chart shows, with the label and value each hover reveals. */
type Series = {
  key: string;
  title: string;
  value: string;
  detail: string;
  /** Which drawn path this series covers. */
  target: "line" | "line2";
};

/* A single point on a drawn series. */
type Point = { x: number; y: number };

/* Chart geometry, shared by the SVG and the hover targets. The SVG fills the
   plot box, so x is a percentage of the plot width and y a percentage of the
   plot height (0 = top, 100 = bottom). */
const PLOT = { left: 8.0556, width: 88.3333, top: 9.32, bottom: 83.01 };

/** Build an SVG path from points, scaled into the plot. */
function linePath(points: Point[], yMax: number): string {
  if (!points.length) return "";
  const { left, width, top, bottom } = PLOT;
  const span = bottom - top;
  const px = (i: number) => left + (i / Math.max(1, points.length - 1)) * width;
  const py = (v: number) => bottom - (Math.max(0, Math.min(v, yMax)) / yMax) * span;
  return points
    .map((p, i) => `${i === 0 ? "M" : "L"}${px(i).toFixed(2)} ${py(p.y).toFixed(2)}`)
    .join(" ");
}

/** Build the filled area under a line. */
function areaPath(points: Point[], yMax: number): string {
  if (!points.length) return "";
  const { left, width, bottom } = PLOT;
  const line = linePath(points, yMax);
  const lastX = left + width;
  return `${line} L${lastX.toFixed(2)} ${bottom} L${left} ${bottom} Z`;
}

/** Round a value up to a tidy axis maximum that divides evenly into 4 steps. */
function niceMax(value: number): number {
  if (value <= 0) return 1;
  const pow = Math.pow(10, Math.floor(Math.log10(value)));
  const n = value / pow;
  // Prefer a maximum whose quarters are whole numbers.
  const nice = n <= 1 ? 1 : n <= 2 ? 2 : n <= 2.5 ? 2.5 : n <= 5 ? 5 : 10;
  return nice * pow;
}

/** Format an axis value compactly, keeping the steps readable. */
function axisLabel(value: number): string {
  if (value >= 1_000_000) {
    const m = value / 1_000_000;
    return `$${Number.isInteger(m) ? m : m.toFixed(1)}m`;
  }
  if (value >= 1000) {
    const k = value / 1000;
    return `$${Number.isInteger(k) ? k : k.toFixed(1)}k`;
  }
  return `$${Number.isInteger(value) ? value : value.toFixed(1)}`;
}

/** Build five tidy y-axis labels for a given maximum. */
function axisLabels(yMax: number): string[] {
  return [4, 3, 2, 1, 0].map((i) => axisLabel((yMax * i) / 4));
}

function Chart({
  id,
  series,
  points,
  points2,
  yMax,
  xLabels,
  retireIndex,
  retireAgeLabel,
}: {
  id: Exclude<ToolId, "tax">;
  series: Series[];
  points: Point[];
  points2?: Point[];
  yMax: number;
  xLabels: string[];
  /** Index of the retirement marker, when the chart shows one. */
  retireIndex?: number;
  /** The age shown on the retirement marker. */
  retireAgeLabel?: string;
}) {
  const [active, setActive] = useState<Series | null>(null);
  // Where the tooltip sits, relative to the plot.
  const [tipPos, setTipPos] = useState({ x: 0, y: 0 });
  const plotRef = useRef<HTMLDivElement>(null);

  /** Keep the tooltip next to the pointer, clamped inside the plot. */
  function moveTip(event: React.MouseEvent) {
    const plot = plotRef.current;
    if (!plot) return;
    const rect = plot.getBoundingClientRect();
    const rawX = event.clientX - rect.left + 14;
    const rawY = event.clientY - rect.top + 14;
    // The card is ~240px wide and ~70px tall; flip it back inside the plot.
    const x = Math.max(4, Math.min(rawX, rect.width - 248));
    const y = Math.max(4, Math.min(rawY, rect.height - 78));
    setTipPos({ x, y });
  }

  // Five gridlines, matching the original design.
  const gridlines = [0, 1, 2, 3, 4].map(
    (i) => PLOT.top + (i * (PLOT.bottom - PLOT.top)) / 4,
  );
  const yLabels = axisLabels(yMax);

  const { left, width, top, bottom } = PLOT;
  const retireX =
    retireIndex !== undefined && points.length > 1
      ? left + (retireIndex / (points.length - 1)) * width
      : null;

  return (
    <div className={`chart chart-${id}`}>
      <div className="y-labels">
        {yLabels.map((item, i) => (
          <span key={i} style={{ top: `${gridlines[i]}%` }}>{item}</span>
        ))}
      </div>
      <div className="plot" ref={plotRef}>
        {gridlines.map((y, i) => (
          <i key={i} className="gridline" style={{ top: `${y}%` }} />
        ))}
        <svg
          className="chart-svg"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          {/* Filled areas sit under the lines, as in the original. */}
          {points2 && (
            <path d={areaPath(points2, yMax)} className="chart-area second" />
          )}
          <path d={areaPath(points, yMax)} className="chart-area" />
          {points2 && (
            <path d={linePath(points2, yMax)} className="chart-line second" />
          )}
          <path d={linePath(points, yMax)} className="chart-line" />
        </svg>
        {/* Endpoints mark the final value of each line. */}
        {points.length > 0 && (
          <i
            className="chart-endpoint"
            style={{
              left: `${left + width}%`,
              top: `${bottom - (Math.max(0, Math.min(points[points.length - 1].y, yMax)) / yMax) * (bottom - top)}%`,
            }}
          />
        )}
        {points2 && points2.length > 0 && (
          <i
            className="chart-endpoint second"
            style={{
              left: `${left + width}%`,
              top: `${bottom - (Math.max(0, Math.min(points2[points2.length - 1].y, yMax)) / yMax) * (bottom - top)}%`,
            }}
          />
        )}
        {retireX !== null && (
          <>
            <b className="retire-line" style={{ left: `${retireX}%` }} />
            <em style={{ left: `${retireX - 5}%` }}>
              Retire · {retireAgeLabel}
            </em>
          </>
        )}
        {/* Hover targets: one per series, each covering only its own line. */}
        {series.map((s, i) => {
          const pts = i === 0 ? points : points2 ?? [];
          if (!pts.length) return null;
          // The band this line occupies, in plot percentages.
          const span = PLOT.bottom - PLOT.top;
          const values = pts.map((p) => p.y);
          const lo = Math.min(...values);
          const hi = Math.max(...values);
          const topPct = PLOT.bottom - (hi / yMax) * span;
          const bottomPct = PLOT.bottom - (lo / yMax) * span;
          // A little padding so the thin line is easy to hit.
          const pad = 3;
          return (
            <button
              key={s.key}
              type="button"
              className="chart-hit"
              aria-label={`${s.title}: ${s.value}`}
              style={{
                left: `${PLOT.left}%`,
                top: `${Math.max(0, topPct - pad)}%`,
                width: `${PLOT.width}%`,
                height: `${Math.min(100, bottomPct - topPct + pad * 2)}%`,
                zIndex: i === 0 ? 11 : 12,
              }}
              onMouseMove={(e) => moveTip(e)}
              onMouseOver={() => setActive(s)}
              onMouseOut={() => setActive(null)}
              onFocus={() => setActive(s)}
              onBlur={() => setActive(null)}
            />
          );
        })}
        {active && (
          <div
            className="chart-tip show"
            style={{ left: tipPos.x, top: tipPos.y }}
          >
            <strong>{active.title}</strong>
            <span>{active.value}</span>
            <span>{active.detail}</span>
          </div>
        )}
      </div>
      <div className="x-labels">
        {xLabels.map((item, i) => <span key={i}>{item}</span>)}
      </div>
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

type CollegeInputs = {
  country: string;
  state: string;
  scenario: string;
  customRate: string;
  childAge: string;
  startAge: string;
  saved: string;
  monthly: string;
};

type RetirementInputs = {
  scenario: string;
  ageToday: string;
  retireAge: string;
  monthly: string;
  incomeGoal: string;
};

type CompoundInputs = {
  initial: string;
  years: string;
  rate: string;
  compoundFreq: string;
  contribution: string;
  contributionFreq: string;
};

/** Future value of an initial sum plus regular contributions.
    `contribution` is paid once per contribution period, and `contributionsPerYear`
    says how many times a year that is. */
function futureValue(
  initial: number,
  contribution: number,
  annualRate: number,
  years: number,
  compoundsPerYear: number,
  contributionsPerYear: number,
): number {
  const r = annualRate / compoundsPerYear;
  const periods = Math.round(years * compoundsPerYear);
  const fvInitial = initial * Math.pow(1 + r, periods);
  // Each contribution compounds for the periods remaining after it lands.
  const gap = compoundsPerYear / contributionsPerYear;
  let fvContrib = 0;
  for (let k = 1; k <= Math.round(years * contributionsPerYear); k++) {
    const remaining = periods - Math.round(k * gap);
    if (remaining > 0) fvContrib += contribution * Math.pow(1 + r, remaining);
  }
  return fvInitial + fvContrib;
}

function ChartResult({
  tool,
  currency,
  debtStrategy,
  debts,
  debtExtra,
  college,
  retirement,
  compound,
}: {
  tool: Tool;
  currency: Currency;
  debtStrategy: string;
  debts: Array<{ title: string; balance: string; apr: string; payment: string }>;
  debtExtra: string;
  college: CollegeInputs;
  retirement: RetirementInputs;
  compound: CompoundInputs;
}) {
  const id = tool.id as Exclude<ToolId, "tax">;

  // The metrics are computed from the same assumptions the chart shows.
  const metrics: Array<Parameters<typeof Metric>[0]> = (() => {
    if (id === "college") {
      const years = Math.max(0, Number(college.startAge) - Number(college.childAge));
      const rate =
        college.scenario === "Custom"
          ? Number(college.customRate) / 100
          : RETURN_SCENARIOS[college.scenario] ?? 0.05;
      const saved = parseMoney(college.saved);
      const monthly = parseMoney(college.monthly);
      // 4 years of $18,000 today, rising 3% a year, priced at the start age.
      const goal = 4 * 18000 * Math.pow(1.03, years);
      const total = futureValue(saved, monthly, rate, years, 12, 12);
      const gap = goal - total;
      // The monthly contribution that would close the gap at the same rate.
      const rm = rate / 12;
      const annuityFactor =
        rm > 0 ? (Math.pow(1 + rm, years * 12) - 1) / rm : years * 12;
      const needed = Math.max(0, (goal - saved * Math.pow(1 + rate, years)) / annuityFactor);
      return [
        { label: "Education funding goal", value: money(goal, currency), note: `${years} years out · 4 years of study` },
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
      const years = Math.max(0, Number(retirement.retireAge) - Number(retirement.ageToday));
      const rate = RETIREMENT_SCENARIOS[retirement.scenario] ?? 0.05;
      const monthly = parseMoney(retirement.monthly);
      const goal = parseMoney(retirement.incomeGoal);
      const total = futureValue(120000, monthly, rate, years, 12, 12);
      // A 4% initial annual draw, rising 2% a year, plus assumed CPP/OAS.
      const draw = total * 0.04;
      const cppOas = 1500 * 12;
      const income = draw + cppOas;
      return [
        { label: "Estimated annual income", value: money(income, currency), note: "4% initial draw + assumed CPP/OAS" },
        { label: "Annual income goal", value: money(goal * 12, currency), note: `Future dollars at age ${retirement.retireAge}` },
        { label: "Annual funding gap", value: money(Math.max(0, goal * 12 - income), currency), note: "Before tax", warning: true },
      ];
    }
    // compound
    const initial = parseMoney(compound.initial);
    const contribution = parseMoney(compound.contribution);
    const years = Number(compound.years) || 0;
    const rate = (Number(compound.rate) || 0) / 100;
    const n = COMPOUND_FREQUENCIES[compound.compoundFreq] ?? 365;
    const cpy = CONTRIBUTION_FREQUENCIES[compound.contributionFreq] ?? 12;
    const total = futureValue(initial, contribution, rate, years, n, cpy);
    const deposits = initial + contribution * years * cpy;
    return [
      { label: "Total deposits", value: money(deposits, currency), note: `${money(initial, currency)} initial + ${money(contribution * years * cpy, currency)} recurring` },
      { label: "Interest earned", value: money(total - deposits, currency, 2), note: `${pct(deposits > 0 ? (total - deposits) / total : 0, 1)} of your ending balance`, success: true },
      { label: "Without contributions", value: money(futureValue(initial, 0, rate, years, n, cpy), currency, 2), note: "Same deposit, rate and horizon" },
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
      const years = Math.max(0, Number(college.startAge) - Number(college.childAge));
      const rate =
        college.scenario === "Custom"
          ? Number(college.customRate) / 100
          : RETURN_SCENARIOS[college.scenario] ?? 0.05;
      const saved = parseMoney(college.saved);
      const monthly = parseMoney(college.monthly);
      const goal = 4 * 18000 * Math.pow(1.03, years);
      const total = futureValue(saved, monthly, rate, years, 12, 12);
      return [
        {
          key: "savings",
          title: "Projected savings",
          value: money(total, currency),
          detail: `${money(saved, currency)} already saved plus ${money(monthly, currency)}/month at ${(rate * 100).toFixed(0)}%`,
          target: "line",
        },
        {
          key: "goal",
          title: "Education funding goal",
          value: money(goal, currency),
          detail: `4 years at $18,000/year today, rising 3% a year`,
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
      const years = Math.max(0, Number(retirement.retireAge) - Number(retirement.ageToday));
      const rate = RETIREMENT_SCENARIOS[retirement.scenario] ?? 0.05;
      const monthly = parseMoney(retirement.monthly);
      const total = futureValue(120000, monthly, rate, years, 12, 12);
      return [
        {
          key: "savings",
          title: "Projected savings",
          value: money(total, currency),
          detail: `$120,000 today plus ${money(monthly, currency)}/month at ${(rate * 100).toFixed(0)}% for ${years} years`,
          target: "line",
        },
      ];
    }
    // compound
    const initial = parseMoney(compound.initial);
    const contribution = parseMoney(compound.contribution);
    const years = Number(compound.years) || 0;
    const rate = (Number(compound.rate) || 0) / 100;
    const n = COMPOUND_FREQUENCIES[compound.compoundFreq] ?? 365;
    const cpy = CONTRIBUTION_FREQUENCIES[compound.contributionFreq] ?? 12;
    const total = futureValue(initial, contribution, rate, years, n, cpy);
    const deposits = initial + contribution * years * cpy;
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
        detail: `${money(initial, currency)} initial plus ${money(contribution, currency)}/${compound.contributionFreq.toLowerCase()}`,
        target: "line",
      },
    ];
  })();

  // The drawn series: points, axis labels, and the retirement marker.
  const chartData: {
    points: Point[];
    points2?: Point[];
    yMax: number;
    xLabels: string[];
    retireIndex?: number;
    retireAgeLabel?: string;
  } = (() => {
    if (id === "college") {
      const childAge = Number(college.childAge) || 0;
      const startAge = Number(college.startAge) || childAge;
      const years = Math.max(1, startAge - childAge);
      const rate =
        college.scenario === "Custom"
          ? Number(college.customRate) / 100
          : RETURN_SCENARIOS[college.scenario] ?? 0.05;
      const saved = parseMoney(college.saved);
      const monthly = parseMoney(college.monthly);
      const goal = 4 * 18000 * Math.pow(1.03, years);
      const pts: Point[] = [];
      const pts2: Point[] = [];
      for (let i = 0; i <= years; i++) {
        pts.push({ x: i, y: futureValue(saved, monthly, rate, i, 12, 12) });
        pts2.push({ x: i, y: goal });
      }
      const yMax = niceMax(Math.max(goal, pts[pts.length - 1].y) * 1.05);
      const xLabels: string[] = [];
      for (let a = childAge; a <= startAge; a++) xLabels.push(String(a));
      return { points: pts, points2: pts2, yMax, xLabels };
    }
    if (id === "debt") {
      const parsed = debts.map((d) => ({
        bal: parseMoney(d.balance),
        apr: (Number(d.apr) || 0) / 100,
        min: parseMoney(d.payment),
      }));
      const extra = parseMoney(debtExtra);
      // Simulate month by month for each strategy.
      const simulate = (strategy: "Avalanche" | "Snowball") => {
        const b = parsed.map((d) => ({ ...d }));
        const out: Point[] = [{ x: 0, y: b.reduce((s, d) => s + d.bal, 0) }];
        let month = 0;
        while (b.some((d) => d.bal > 0.005) && month < 600) {
          month++;
          for (const d of b) if (d.bal > 0) d.bal += (d.bal * d.apr) / 12;
          for (const d of b) d.bal -= Math.min(d.min, d.bal);
          let rem = extra;
          const order = [...b]
            .filter((d) => d.bal > 0)
            .sort((a, c) => (strategy === "Avalanche" ? c.apr - a.apr : a.bal - c.bal));
          for (const d of order) {
            const p = Math.min(rem, d.bal);
            d.bal -= p;
            rem -= p;
            if (rem <= 0) break;
          }
          out.push({ x: month, y: b.reduce((s, d) => s + Math.max(0, d.bal), 0) });
        }
        return out;
      };
      const av = simulate("Avalanche");
      const sn = simulate("Snowball");
      const months = Math.max(av.length - 1, sn.length - 1);
      const yMax = niceMax(Math.max(av[0]?.y ?? 0, sn[0]?.y ?? 0) * 1.05);
      const xLabels: string[] = [];
      const step = Math.max(1, Math.ceil(months / 6));
      for (let m = 0; m <= months; m += step) xLabels.push(String(m));
      if (xLabels[xLabels.length - 1] !== String(months)) xLabels.push(String(months));
      return { points: av, points2: sn, yMax, xLabels };
    }
    if (id === "retirement") {
      const ageToday = Number(retirement.ageToday) || 0;
      const retireAge = Number(retirement.retireAge) || ageToday;
      const years = Math.max(1, retireAge - ageToday);
      const rate = RETIREMENT_SCENARIOS[retirement.scenario] ?? 0.05;
      const monthly = parseMoney(retirement.monthly);
      const pts: Point[] = [];
      let peak = 0;
      for (let i = 0; i <= years; i++) {
        const v = futureValue(120000, monthly, rate, i, 12, 12);
        peak = Math.max(peak, v);
        pts.push({ x: i, y: v });
      }
      // After retirement the savings are drawn down at 4% a year.
      for (let i = 1; i <= 30; i++) {
        const v = Math.max(0, peak * Math.pow(0.96, i));
        pts.push({ x: years + i, y: v });
      }
      const yMax = niceMax(peak * 1.05);
      const xLabels: string[] = [];
      const step = Math.max(1, Math.ceil((years + 30) / 6));
      for (let i = 0; i <= years + 30; i += step) {
        xLabels.push(String(ageToday + i));
      }
      return { points: pts, yMax, xLabels, retireIndex: years, retireAgeLabel: String(retireAge) };
    }
    // compound
    const initial = parseMoney(compound.initial);
    const contribution = parseMoney(compound.contribution);
    const years = Math.max(1, Number(compound.years) || 0);
    const rate = (Number(compound.rate) || 0) / 100;
    const n = COMPOUND_FREQUENCIES[compound.compoundFreq] ?? 365;
    const cpy = CONTRIBUTION_FREQUENCIES[compound.contributionFreq] ?? 12;
    const pts: Point[] = [];
    const pts2: Point[] = [];
    let peak = 0;
    for (let i = 0; i <= years; i++) {
      const v = futureValue(initial, contribution, rate, i, n, cpy);
      peak = Math.max(peak, v);
      pts.push({ x: i, y: v });
      pts2.push({ x: i, y: initial + contribution * i * cpy });
    }
    const yMax = niceMax(peak * 1.05);
    const xLabels: string[] = [];
    const step = Math.max(1, Math.ceil(years / 6));
    for (let i = 0; i <= years; i += step) xLabels.push(String(i));
    if (xLabels[xLabels.length - 1] !== String(years)) xLabels.push(String(years));
    return { points: pts, points2: pts2, yMax, xLabels };
  })();

  const callout: Record<typeof id, { title: string; copy: string }> = {
    college: {
      title: "A little more today can open more doors.",
      copy: "At the same return, a higher monthly contribution would meet this goal. Revisit the plan as costs, contributions and grant eligibility change.",
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
      <Chart
        id={id}
        series={series}
        points={chartData.points}
        points2={chartData.points2}
        yMax={chartData.yMax}
        xLabels={chartData.xLabels}
        retireIndex={chartData.retireIndex}
        retireAgeLabel={chartData.retireAgeLabel}
      />
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
  college,
  retirement,
  compound,
}: {
  tool: Tool;
  currency: Currency;
  state: string;
  income: number;
  debtStrategy: string;
  debts: Array<{ title: string; balance: string; apr: string; payment: string }>;
  debtExtra: string;
  college: CollegeInputs;
  retirement: RetirementInputs;
  compound: CompoundInputs;
}) {
  const [monthly, setMonthly] = useState(false);

  // The header labels follow the inputs, not fixed copy.
  const yearsToRetire = Math.max(
    0,
    Number(retirement.retireAge) - Number(retirement.ageToday),
  );
  const resultMeta =
    tool.id === "retirement"
      ? `${yearsToRetire} YEAR${yearsToRetire === 1 ? "" : "S"} TO RETIREMENT`
      : tool.id === "debt"
        ? `${debtStrategy.toUpperCase()} SELECTED`
        : tool.id === "compound"
          ? `${Number(compound.years) || 0}-YEAR PROJECTION`
          : tool.id === "college"
            ? `${Math.max(0, Number(college.startAge) - Number(college.childAge))}-YEAR HORIZON`
            : tool.resultMeta;
  const resultLabel =
    tool.id === "retirement"
      ? `Projected savings at age ${retirement.retireAge}`
      : tool.id === "college"
        ? `Projected savings at age ${college.startAge}`
        : tool.resultLabel;

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
      const years = Math.max(0, Number(college.startAge) - Number(college.childAge));
      const rate =
        college.scenario === "Custom"
          ? Number(college.customRate) / 100
          : RETURN_SCENARIOS[college.scenario] ?? 0.05;
      const total = futureValue(parseMoney(college.saved), parseMoney(college.monthly), rate, years, 12, 12);
      const goal = 4 * 18000 * Math.pow(1.03, years);
      return {
        value: money(total, currency),
        note: `${pct(goal > 0 ? total / goal : 0, 1)} of the illustrative education goal funded`,
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
      const years = Math.max(0, Number(retirement.retireAge) - Number(retirement.ageToday));
      const rate = RETIREMENT_SCENARIOS[retirement.scenario] ?? 0.05;
      const total = futureValue(120000, parseMoney(retirement.monthly), rate, years, 12, 12);
      return {
        value: money(total, currency),
        note: `A ${years}-year runway for your next chapter`,
      };
    }
    // compound
    const initial = parseMoney(compound.initial);
    const contribution = parseMoney(compound.contribution);
    const years = Number(compound.years) || 0;
    const rate = (Number(compound.rate) || 0) / 100;
    const n = COMPOUND_FREQUENCIES[compound.compoundFreq] ?? 365;
    const cpy = CONTRIBUTION_FREQUENCIES[compound.contributionFreq] ?? 12;
    return {
      value: money(futureValue(initial, contribution, rate, years, n, cpy), currency, 2),
      note: "Your money earns. Then those earnings earn, too.",
    };
  })();

  return (
    <section className="card result-card">
      <header className="card-header">
        <h2>{tool.resultTitle}</h2>
        <span>{resultMeta}</span>
      </header>
      <div className="result-top">
        <span>{resultLabel}</span>
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
          college={college}
          retirement={retirement}
          compound={compound}
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
  // The other tools' inputs, lifted for the same reason.
  const [college, setCollege] = useState<CollegeInputs>({
    country: "United States",
    state: "California",
    scenario: "Moderate",
    customRate: "5",
    childAge: "6",
    startAge: "18",
    saved: "$12,000",
    monthly: "$250",
  });
  const [retirement, setRetirement] = useState<RetirementInputs>({
    scenario: "Moderate",
    ageToday: "40",
    retireAge: "65",
    monthly: "$600",
    incomeGoal: "$4,500",
  });
  const [compound, setCompound] = useState<CompoundInputs>({
    initial: "$10,000",
    years: "10",
    rate: "4",
    compoundFreq: "Daily (365 times / year)",
    contribution: "$100",
    contributionFreq: "Monthly",
  });
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
          college={college}
          setCollege={setCollege}
          retirement={retirement}
          setRetirement={setRetirement}
          compound={compound}
          setCompound={setCompound}
        />
        <ResultPanel
          tool={tool}
          currency={currency}
          state={state}
          income={income}
          debtStrategy={debtStrategy}
          debts={debts}
          debtExtra={debtExtra}
          college={college}
          retirement={retirement}
          compound={compound}
        />
      </div>
      <ReportBanner tool={tool} />
    </main>
  );
}
