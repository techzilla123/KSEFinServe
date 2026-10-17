import { useState } from "react";

type ToolId = "tax" | "college" | "debt" | "retirement" | "compound";

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
  resultValue: string;
  resultSuffix?: string;
  resultNote: string;
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

const tools: Tool[] = [
  {
    id: "tax",
    label: "Tax Calculator",
    eyebrow: "KSEFINSERVE / TAX CALCULATOR",
    title: "A little less tax mystery.",
    serifTitle: "A lot more clarity.",
    description:
      "See where your income goes. Explore an illustrative Canadian income-tax estimate, and make room for a clearer financial plan.",
    artwork: "/assets/3635d.png",
    activeIcon: "/assets/71343.svg",
    panelTitle: "Your income picture",
    panelMeta: "CANADA · CAD",
    resultTitle: "Your estimated breakdown",
    resultMeta: "EXAMPLE SCENARIO",
    resultLabel: "Annual after-tax income",
    resultValue: "$64,200",
    resultSuffix: "CAD",
    resultNote: "You keep 80.25% of your employment income",
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
    panelMeta: "EDUCATION · CAD",
    resultTitle: "Their education, in focus",
    resultMeta: "12-YEAR HORIZON",
    resultLabel: "Projected savings at age 18",
    resultValue: "$70,386",
    resultSuffix: "CAD",
    resultNote: "68.5% of the illustrative education goal funded",
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
    panelMeta: "2 DEBTS · CAD",
    resultTitle: "A path to debt-free",
    resultMeta: "AVALANCHE SELECTED",
    resultLabel: "Estimated debt-free timeline",
    resultValue: "23 months",
    resultNote: "Save about $504 in interest vs. the snowball strategy",
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
    panelMeta: "RETIREMENT · CAD",
    resultTitle: "A future worth planning for",
    resultMeta: "25 YEARS TO RETIREMENT",
    resultLabel: "Projected savings at age 65",
    resultValue: "$757,803",
    resultSuffix: "CAD",
    resultNote: "A 25-year runway for your next chapter",
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
    panelMeta: "SAVINGS · CAD",
    resultTitle: "The power of staying with it",
    resultMeta: "10-YEAR PROJECTION",
    resultLabel: "Total balance after 10 years",
    resultValue: "$29,647.91",
    resultSuffix: "CAD",
    resultNote: "Your money earns. Then those earnings earn, too.",
    accent: "#16856d",
    soft: "#dcefe5",
    reportTitle: "Turn the power of time into a plan.",
    reportCopy:
      "Keep your growth projection, deposit breakdown and interest timeline together. A simple report for a more intentional savings habit.",
    reportButton: "Get my growth report →",
  },
];

function Field({
  label,
  value,
  suffix,
  select,
}: {
  label: string;
  value: string;
  suffix?: string;
  select?: boolean;
}) {
  return (
    <label className="field">
      <span>{label}</span>
      <span className="control">
        <input defaultValue={value} aria-label={label} />
        {suffix && <small>{suffix}</small>}
        {select && <img src="/assets/3e962.svg" alt="" />}
      </span>
    </label>
  );
}

function Segment({
  label,
  active,
}: {
  label: string;
  active?: boolean;
}) {
  return (
    <button className={active ? "segment active" : "segment"} type="button">
      {label}
    </button>
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

function TaxForm() {
  return (
    <>
      <div className="field-grid">
        <Field label="Province / territory" value="Ontario" select />
        <Field label="Tax year" value="2025" select />
      </div>
      <Field label="Annual employment income" value="$80,000" suffix="CAD" />
      <div className="slider">
        <span />
        <img src="/assets/4c653.svg" alt="" />
      </div>
      <div className="range-labels">
        <span>$0</span>
        <span>$250,000</span>
      </div>
      <button className="add-row" type="button">
        <img src="/assets/99b68.svg" alt="" /> Add income or deductions
      </button>
      <div className="form-divider" />
      <h3 className="story-title">A rate is not the whole story.</h3>
      <p className="form-copy">
        Your average rate applies across your income. Your marginal rate is the
        assumed rate on your next dollar—not every dollar you earn.
      </p>
      <p className="fine-print">
        Illustrative rates, not verified 2025 tax tables. Excludes CPP/QPP, EI,
        payroll contributions and other deductions. Not personalized tax advice.
      </p>
    </>
  );
}

function CollegeForm() {
  return (
    <>
      <span className="mini-label">Country</span>
      <div className="segments left">
        <Segment label="Canada" active />
        <Segment label="United States" />
      </div>
      <Field label="Province / territory" value="Ontario" select />
      <div className="field-grid">
        <Field label="Child’s age today" value="6" suffix="years" />
        <Field label="Education start age" value="18" suffix="years" />
        <Field label="Already saved" value="$12,000" suffix="CAD" />
        <Field label="Monthly contribution" value="$250" suffix="CAD" />
      </div>
      <span className="mini-label">Investment return scenario</span>
      <div className="segments spread">
        <Segment label="Conservative" />
        <Segment label="Moderate" active />
        <Segment label="Growth" />
        <Segment label="Custom" />
      </div>
      <Assumptions>
        4 education years · $18,000/year today · Cover 100% · Other funding $0
        · Cost inflation 3% · Moderate return 5%/year · Household income
        $100k–$150k. Grants excluded.
      </Assumptions>
      <p className="fine-print">
        Canadian scenario in CAD. Grants and eligibility are not guaranteed. No
        grant amount is included; actual tuition, living costs and returns vary.
      </p>
    </>
  );
}

function DebtCard({
  title,
  balance,
  apr,
  payment,
}: {
  title: string;
  balance: string;
  apr: string;
  payment: string;
}) {
  return (
    <div className="debt-card">
      <div className="debt-head">
        <strong>{title}</strong>
        <img src="/assets/5ef8f.svg" alt="" />
      </div>
      <div className="debt-fields">
        <Field label="Balance (CAD)" value={balance} />
        <Field label="APR (%)" value={apr} />
        <Field label="Min. / month" value={payment} />
      </div>
    </div>
  );
}

function DebtForm() {
  return (
    <>
      <DebtCard title="Credit card" balance="$8,000" apr="19.99" payment="$240" />
      <DebtCard title="Personal loan" balance="$4,000" apr="6.99" payment="$120" />
      <button className="debt-add" type="button">
        <img src="/assets/1bfb3.svg" alt="" /> Add another debt
      </button>
      <Field label="Extra monthly payment" value="$250" suffix="CAD" />
      <span className="mini-label">Preferred strategy</span>
      <div className="segments left">
        <Segment label="Avalanche" active />
        <Segment label="Snowball" />
      </div>
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

function RetirementForm() {
  return (
    <>
      <div className="field-grid">
        <Field label="Age today" value="40" suffix="years" />
        <Field label="Retirement age" value="65" suffix="years" />
      </div>
      <Field label="Monthly contribution" value="$600" suffix="CAD" />
      <Field label="Monthly income goal at retirement" value="$4,500" suffix="CAD" />
      <span className="mini-label">Investment return scenario</span>
      <div className="segments left">
        <Segment label="Conservative" />
        <Segment label="Moderate" active />
        <Segment label="Growth" />
      </div>
      <Assumptions>
        RRSP $80,000 · TFSA $30,000 · Other $10,000 · CPP/OAS $1,500/mo at 65
        · Plan through age 95 · Inflation 2% · Growth return 5% · Retirement
        return 3%.
      </Assumptions>
      <p className="fine-print">
        Illustrative, not personalized advice. All amounts are future nominal
        CAD; $4,500 is the goal at age 65.
      </p>
    </>
  );
}

function CompoundForm() {
  return (
    <>
      <Field label="Initial deposit" value="$10,000" suffix="CAD" />
      <div className="field-grid">
        <Field label="Years of growth" value="10" suffix="years" />
        <Field label="Estimated annual rate" value="4" suffix="%" />
      </div>
      <Field label="Compounding frequency" value="Daily (365 times / year)" select />
      <div className="field-grid">
        <Field label="Recurring contribution" value="$100" suffix="CAD" />
        <Field label="Contribution frequency" value="Monthly" select />
      </div>
      <Assumptions>
        Contributions at month-end · Constant annual rate · Daily compounding ·
        No taxes, fees or withdrawals · All values in CAD.
      </Assumptions>
      <p className="fine-print">
        4% is the annual rate before compounding, not APY. Daily compounding
        gives an effective annual yield of about 4.08%. Educational only, not
        investment advice.
      </p>
    </>
  );
}

function InputPanel({ tool }: { tool: Tool }) {
  return (
    <section className="card input-card">
      <header className="card-header">
        <h2>{tool.panelTitle}</h2>
        <span>{tool.panelMeta}</span>
      </header>
      <div className="form-body">
        {tool.id === "tax" && <TaxForm />}
        {tool.id === "college" && <CollegeForm />}
        {tool.id === "debt" && <DebtForm />}
        {tool.id === "retirement" && <RetirementForm />}
        {tool.id === "compound" && <CompoundForm />}
      </div>
    </section>
  );
}

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

function Chart({ id }: { id: Exclude<ToolId, "tax"> }) {
  const assets = chartAssets[id];
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

function TaxResult() {
  return (
    <>
      <div className="tax-result-row">
        <div className="donut">
          <img src="/assets/6c717.svg" alt="" />
          <img src="/assets/77e07.svg" alt="" />
          <img src="/assets/45f09.svg" alt="" />
          <strong>80.25%</strong>
          <span>income you keep</span>
        </div>
        <div className="tax-legend">
          <div><img src="/assets/70ff4.svg" alt="" />After-tax income <strong>$64,200</strong></div>
          <div><img src="/assets/8b5d9.svg" alt="" />Federal income tax <strong>$11,200</strong></div>
          <div><img src="/assets/09949.svg" alt="" />Ontario income tax <strong>$4,600</strong></div>
          <hr />
          <div>Total income tax <strong>$15,800</strong></div>
        </div>
      </div>
      <div className="tax-bottom">
        <Metric label="Average tax rate" value="19.75%" note="" />
        <Metric label="Assumed marginal rate" value="29.65%" note="" />
        <Metric label="Monthly after-tax income" value="$5,350" note="" />
      </div>
      <p className="result-disclaimer">
        CAD, annual values unless noted. A simplified educational scenario—not
        a filing estimate. Tax brackets apply progressively; credits and
        individual circumstances can change your result.
      </p>
    </>
  );
}

const metricSets: Record<Exclude<ToolId, "tax">, Array<Parameters<typeof Metric>[0]>> = {
  college: [
    { label: "Education funding goal", value: "$102,655", note: "4 years, priced at start age" },
    { label: "Estimated funding gap", value: "$32,269", note: "No grants or other funding", warning: true },
    { label: "Contribution to close gap", value: "$415/mo", note: "About $165 more each month" },
  ],
  debt: [
    { label: "Total monthly payment", value: "$610", note: "$360 minimums + $250 extra" },
    { label: "Total interest", value: "$1,787", note: "Avalanche scenario" },
    { label: "Total payments", value: "$13,787", note: "$12,000 balance + interest" },
  ],
  retirement: [
    { label: "Estimated monthly income", value: "$4,026", note: "Savings + assumed CPP/OAS" },
    { label: "Monthly income goal", value: "$4,500", note: "Future dollars at age 65" },
    { label: "Monthly funding gap", value: "$474", note: "Before tax", warning: true },
  ],
  compound: [
    { label: "Total deposits", value: "$22,000", note: "$10k initial + $12k recurring" },
    { label: "Interest earned", value: "$7,647.91", note: "25.8% of your ending balance", success: true },
    { label: "Without contributions", value: "$14,917.92", note: "Same deposit, rate and horizon" },
  ],
};

function ChartResult({ tool }: { tool: Tool }) {
  const id = tool.id as Exclude<ToolId, "tax">;
  const chartTitle: Record<typeof id, string> = {
    college: "Savings vs. education funding goal · CAD",
    debt: "Remaining total debt by strategy · CAD",
    retirement: "Savings buildup & retirement withdrawals · CAD",
    compound: "Your deposits + compounded growth · CAD",
  };
  const callout: Record<typeof id, { title: string; copy: string }> = {
    college: {
      title: "A little more today can open more doors.",
      copy: "At the same 5% return, about $415/month would meet this goal. Revisit the plan as costs, contributions and grant eligibility change.",
    },
    debt: {
      title: "Avalanche · less interest                 Snowball · smaller balance first",
      copy: "23 months · $1,787 interest                              24 months · $2,291 interest",
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
        {metricSets[id].map((metric) => <Metric key={metric.label} {...metric} />)}
      </div>
      <div className="result-divider" />
      <h3 className="chart-title">{chartTitle[id]}</h3>
      <Chart id={id} />
      <div className="legend">
        <span><i style={{ background: tool.accent }} />{id === "debt" ? "Avalanche" : id === "compound" ? "Total balance (deposits + interest)" : "Projected savings"}</span>
        {id !== "retirement" && <span><i className="gold-line" />{id === "debt" ? "Snowball" : id === "college" ? "Education goal" : "Total deposits"}</span>}
      </div>
      <div className="callout" style={{ background: tool.soft }}>
        <strong>{callout[id].title}</strong>
        <p>{callout[id].copy}</p>
      </div>
      <p className="result-disclaimer">
        Illustrative, not personalized advice. Values are estimates; assumptions,
        timing, rates and real-world conditions can affect actual results.
      </p>
    </>
  );
}

function ResultPanel({ tool }: { tool: Tool }) {
  return (
    <section className="card result-card">
      <header className="card-header">
        <h2>{tool.resultTitle}</h2>
        <span>{tool.resultMeta}</span>
      </header>
      <div className="result-top">
        <span>{tool.resultLabel}</span>
        <div>
          <strong>{tool.resultValue}</strong>
          {tool.resultSuffix && <small>{tool.resultSuffix}</small>}
        </div>
        <p style={{ color: tool.accent }}>{tool.resultNote}</p>
        {tool.id !== "tax" && <b className="illustrative">ILLUSTRATIVE</b>}
        {tool.id === "tax" && (
          <div className="yearly-toggle"><b>Yearly</b><span>Monthly</span></div>
        )}
      </div>
      {tool.id === "tax" ? <TaxResult /> : <ChartResult tool={tool} />}
    </section>
  );
}

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

export default function App() {
  const [activeId, setActiveId] = useState<ToolId>("tax");
  const tool = tools.find((item) => item.id === activeId)!;

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
        <InputPanel tool={tool} />
        <ResultPanel tool={tool} />
      </div>
      <ReportBanner tool={tool} />
    </main>
  );
}
