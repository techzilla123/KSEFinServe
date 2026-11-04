/* Netlify Function: send financial tool report with PDF attachment.
   Generates a PDF report based on the tool type and user inputs,
   then emails it to the user via Namecheap hosting SMTP. */

import type { Request } from '@netlify/functions'
import nodemailer from 'nodemailer'
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'

const SMTP_HOST = process.env.SMTP_HOST!
const SMTP_PORT = Number(process.env.SMTP_PORT!)
const SMTP_USER = process.env.SMTP_USER!
const SMTP_PASS = process.env.SMTP_PASS!
const EMAIL_FROM = process.env.EMAIL_FROM!
const EMAIL_FROM_NAME = process.env.EMAIL_FROM_NAME!

const corsHeaders = {
  'Access-Control-Allow-Origin': process.env.ADMIN_ALLOWED_ORIGIN ?? '*',
  'Access-Control-Allow-Headers': 'authorization, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

interface ReportPayload {
  tool: 'tax' | 'college' | 'debt' | 'retirement' | 'compound'
  email: string
  userName: string
  reference: string
  currency: 'USD' | 'CAD'
  data: Record<string, unknown>
}

function validatePayload(payload: unknown): payload is ReportPayload {
  if (!payload || typeof payload !== 'object') return false
  const p = payload as Record<string, unknown>
  if (!['tax', 'college', 'debt', 'retirement', 'compound'].includes(p.tool as string)) return false
  if (!p.email || typeof p.email !== 'string') return false
  if (!p.userName || typeof p.userName !== 'string') return false
  if (!p.reference || typeof p.reference !== 'string') return false
  if (!p.currency || !['USD', 'CAD'].includes(p.currency as string)) return false
  if (!p.data || typeof p.data !== 'object') return false
  return true
}

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: SMTP_PORT === 465,
  auth: { user: SMTP_USER, pass: SMTP_PASS },
})

let transporterVerified = false
async function ensureTransporterReady() {
  if (!transporterVerified) {
    try {
      await transporter.verify()
      transporterVerified = true
      console.log('SMTP transporter verified successfully')
    } catch (err) {
      console.error('SMTP transporter verification failed:', err)
      throw new Error('Email service configuration error')
    }
  }
}

function money(value: number, currency: 'USD' | 'CAD', decimals = 0): string {
  const sign = value < 0 ? '-' : ''
  const abs = Math.abs(value)
  const formatted = decimals > 0
    ? abs.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
    : Math.round(abs).toLocaleString('en-US')
  return sign + '$' + formatted
}

function pct(value: number, decimals = 2): string {
  return (value * 100).toFixed(decimals) + '%'
}

/** Parse a formatted money string like "$61,199" or "23.50%" into a number. */
function parseMoneyStr(str: string): number {
  if (!str) return 0
  const cleaned = str.replace(/[$,%\s]/g, '')
  const val = Number(cleaned)
  return Number.isFinite(val) ? val : 0
}

const NAVY = '#081d2b'
const GOLD = '#c9a963'
const CREAM = '#f0ede6'
const WHITE = '#ffffff'
const GRAY = '#6b7280'
const GRAY_LIGHT = '#e5e7eb'
const TEXT_DARK = '#1f2937'

function buildEmailHtml(opts: {
  preheaderText: string
  hero: { title: string; subtitle: string; bgColor: string; textColor: string }
  sections: Array<{ title: string; content: string; bgColor?: string }>
  cards?: Array<{ label: string; value: string }>
  button?: { text: string; href: string; bgColor: string; textColor: string }
}): string {
  const heroHtml = `
    <div style="background-color: ${opts.hero.bgColor}; padding: 48px 32px; text-align: center; border-radius: 16px 16px 0 0;">
      <h1 style="margin: 0 0 16px; font-family: Georgia, serif; font-size: 32px; font-weight: 600; line-height: 1.3; color: ${opts.hero.textColor};">${opts.hero.title}</h1>
      <p style="margin: 0; font-size: 18px; line-height: 1.5; opacity: 0.9; color: ${opts.hero.textColor};">${opts.hero.subtitle}</p>
    </div>`

  const sectionsHtml = opts.sections.map(s => `
    <div style="background-color: ${s.bgColor || WHITE}; padding: 32px;">
      <h2 style="margin: 0 0 16px; font-family: Georgia, serif; font-size: 24px; font-weight: 600; color: ${NAVY};">${s.title}</h2>
      <div style="color: ${TEXT_DARK}; line-height: 1.7;">${s.content}</div>
    </div>`).join('')

  const cardsHtml = opts.cards && opts.cards.length ? `
    <div style="background-color: ${CREAM}; padding: 32px; border-radius: 12px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse;">
        ${opts.cards.map(item => `
          <tr>
            <td style="padding: 12px 0; border-bottom: 1px solid ${GRAY_LIGHT}; vertical-align: top;">
              <span style="display: block; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: ${GOLD}; margin-bottom: 4px;">${item.label}</span>
              <span style="font-size: 16px; color: ${TEXT_DARK}; line-height: 1.5;">${item.value}</span>
            </td>
          </tr>
        `).join('')}
      </table>
    </div>` : ''

  const buttonHtml = opts.button ? `
    <div style="text-align: center; margin: 32px 0;">
      <!--[if mso]>
      <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${opts.button.href}" style="height:48px;v-text-anchor:middle;width:200px;" arcsize="8%" stroke="f" fillcolor="${opts.button.bgColor}">
        <w:anchorlock/>
        <center style="color:${opts.button.textColor};font-family:Arial,sans-serif;font-size:16px;font-weight:600;">${opts.button.text}</center>
      </v:roundrect>
      <![endif]-->
      <a href="${opts.button.href}" style="display: inline-block; background-color: ${opts.button.bgColor}; color: ${opts.button.textColor}; padding: 16px 32px; border-radius: 8px; font-size: 16px; font-weight: 600; text-decoration: none; font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif;">${opts.button.text}</a>
    </div>` : ''

  const footerHtml = `
    <div style="background-color: ${NAVY}; padding: 32px; text-align: center; border-radius: 0 0 16px 16px;">
      <div style="margin-bottom: 16px;">
        <a href="https://ksefinserve.com" style="display: inline-block; margin: 0 8px;">
          <svg xmlns="http://www.w3.org/2000/svg" width="120" height="44" viewBox="0 0 120 44" fill="none"><rect width="120" height="44" fill="${NAVY}"/><text x="60" y="30" font-family="Georgia,serif" font-size="16" font-weight="600" fill="${GOLD}" text-anchor="middle" alignment-baseline="middle">KSEFinServe</text></svg>
        </a>
      </div>
      <p style="margin: 8px 0; font-size: 14px; color: rgba(255,255,255,0.7);">Clarity \u00b7 Growth \u00b7 Impact</p>
      <p style="margin: 16px 0 0; font-size: 12px; color: rgba(255,255,255,0.5);">
        \u00a9 2026 KSEFinServe. All rights reserved.<br>
        363 N Sam Houston Pkwy E, Suite 200, Houston, TX 77060
      </p>
      <div style="margin-top: 24px;">
        <a href="https://www.linkedin.com/company/ksefinserve" style="margin: 0 8px; color: rgba(255,255,255,0.7); text-decoration: none;">LinkedIn</a>
        <span style="color: rgba(255,255,255,0.3);">|</span>
        <a href="mailto:info@ksefinserve.com" style="margin: 0 8px; color: rgba(255,255,255,0.7); text-decoration: none;">Contact</a>
        <span style="color: rgba(255,255,255,0.3);">|</span>
        <a href="https://ksefinserve.com/unsubscribe" style="margin: 0 8px; color: rgba(255,255,255,0.7); text-decoration: none;">Unsubscribe</a>
      </div>
    </div>`

  return `<!DOCTYPE html>
<html lang="en" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="x-apple-disable-message-reformatting">
  <title>${opts.hero.title}</title>
  <!--[if mso]>
  <xml>
    <o:OfficeDocumentSettings>
      <o:AllowPNG/>
      <o:PixelsPerInch>96</o:PixelsPerInch>
    </o:OfficeDocumentSettings>
  </xml>
  <![endif]-->
  <style>
    @media only screen and (max-width: 600px) {
      .email-container { width: 100% !important; }
      .padding { padding: 24px !important; }
      h1 { font-size: 28px !important; }
      h2 { font-size: 22px !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: ${CREAM}; font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%;">
  <div style="display: none; font-size: 1px; line-height: 1px; max-height: 0; max-width: 0; opacity: 0; overflow: hidden; mso-hide: all;">${opts.preheaderText}</div>
  <div style="max-width: 600px; margin: 0 auto; background-color: ${WHITE}; font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif; color: ${TEXT_DARK}; line-height: 1.6;">
    ${heroHtml}
    ${sectionsHtml}
    ${cardsHtml}
    ${buttonHtml}
    ${footerHtml}
  </div>
</body>
</html>`
}

function taxReportTemplate(params: { userName: string; reference: string; currency: string; income: string; state: string; taxYear: string; federalTax: string; stateTax: string; ficaTax: string; totalTax: string; afterTaxIncome: string; avgRate: string; marginalRate: string; keepPct: string }) {
  return buildEmailHtml({
    preheaderText: `Your Tax Clarity Report - ${params.reference}`,
    hero: { title: 'Your Tax Clarity Report', subtitle: `Reference: ${params.reference} \u00b7 ${params.currency}`, bgColor: NAVY, textColor: WHITE },
    sections: [
      { title: 'Report Overview', content: `<p style="margin: 0 0 16px; font-size: 16px;">Hi <strong>${params.userName}</strong>,</p><p style="margin: 0 0 24px;">Thank you for using the KSEFinServe Tax Calculator. Your personalized tax clarity report is ready. This report summarizes your estimated tax breakdown based on the inputs you provided.</p>` },
      { title: 'Important Notes', content: `<ul style="margin: 0; padding-left: 20px; line-height: 2;"><li>This is an illustrative estimate based on simplified 2025 tax brackets for single filers</li><li>Excludes CPP/QPP, EI, payroll contributions, credits, and individual circumstances</li><li>Not personalized tax advice - consult a qualified tax professional for filing decisions</li><li>Tax brackets apply progressively; your marginal rate applies only to your next dollar of income</li></ul>` },
      { title: 'Your PDF Report', content: `<p style="margin: 0 0 16px;">A detailed PDF version of this report is attached to this email, including the full tax breakdown chart and assumptions.</p><p style="margin: 0;">You can also access this report anytime by logging into your KSEFinServe account.</p>` },
    ],
    cards: [
      { label: 'Annual Employment Income', value: params.income },
      { label: 'State', value: params.state },
      { label: 'Tax Year', value: params.taxYear },
      { label: 'Federal Income Tax', value: params.federalTax },
      { label: 'State Income Tax', value: params.stateTax },
      { label: 'FICA (Social Security + Medicare)', value: params.ficaTax },
      { label: 'Total Estimated Tax', value: params.totalTax },
      { label: 'After-Tax Income', value: params.afterTaxIncome },
      { label: 'Average Tax Rate', value: params.avgRate },
      { label: 'Assumed Marginal Rate', value: params.marginalRate },
      { label: 'Income You Keep', value: params.keepPct },
    ],
    button: { text: 'View Tax Calculator', href: 'https://ksefinserve.netlify.app/tax-calculator', bgColor: GOLD, textColor: NAVY },
  })
}

function collegeSavingsReportTemplate(params: { userName: string; reference: string; currency: string; childAge: string; startAge: string; yearsToCollege: number; country: string; state: string; alreadySaved: string; monthlyContribution: string; scenario: string; annualReturn: string; projectedSavings: string; fundingGoal: string; fundingGap: string; contributionToCloseGap: string; percentFunded: string }) {
  return buildEmailHtml({
    preheaderText: `Your Education Savings Plan - ${params.reference}`,
    hero: { title: 'Your Education Savings Plan', subtitle: `Reference: ${params.reference} \u00b7 ${params.currency}`, bgColor: NAVY, textColor: WHITE },
    sections: [
      { title: 'Report Overview', content: `<p style="margin: 0 0 16px; font-size: 16px;">Hi <strong>${params.userName}</strong>,</p><p style="margin: 0 0 24px;">Thank you for using the KSEFinServe College Savings Calculator. Your personalized education savings plan is ready, showing how your contributions could help fund your child's future education.</p>` },
      { title: 'Key Assumptions', content: `<ul style="margin: 0; padding-left: 20px; line-height: 2;"><li>4 years of education at $18,000/year (today's dollars), rising 3% annually</li><li>Contributions made monthly at period-end; returns compound monthly</li><li>Covers 100% of costs; no grants or other funding included</li><li>Household income $100k-$150k assumed for context</li><li>${params.country === 'Canada' ? 'Canadian' : 'US'} scenario in ${params.currency}</li></ul>` },
      { title: 'Your PDF Report', content: `<p style="margin: 0 0 16px;">A detailed PDF version of this plan is attached, including the age-by-age savings timeline, savings vs. goal chart, and full assumptions.</p><p style="margin: 0;">Revisit this plan annually as costs, contributions, and grant eligibility change.</p>` },
    ],
    cards: [
      { label: "Child's Current Age", value: params.childAge + ' years' },
      { label: 'Education Start Age', value: params.startAge + ' years' },
      { label: 'Years Until College', value: params.yearsToCollege + ' years' },
      { label: 'Country', value: params.country },
      { label: 'State/Province', value: params.state },
      { label: 'Already Saved', value: params.alreadySaved },
      { label: 'Monthly Contribution', value: params.monthlyContribution },
      { label: 'Investment Scenario', value: params.scenario },
      { label: 'Assumed Annual Return', value: params.annualReturn },
      { label: 'Projected Savings at Age ' + params.startAge, value: params.projectedSavings },
      { label: 'Education Funding Goal (4 years)', value: params.fundingGoal },
      { label: 'Estimated Funding Gap', value: params.fundingGap },
      { label: 'Contribution to Close Gap', value: params.contributionToCloseGap },
      { label: 'Percentage of Goal Funded', value: params.percentFunded },
    ],
    button: { text: 'View College Savings', href: 'https://ksefinserve.netlify.app/college-savings', bgColor: GOLD, textColor: NAVY },
  })
}

function debtRepaymentReportTemplate(params: { userName: string; reference: string; currency: string; strategy: string; extraPayment: string; totalMonthlyPayment: string; debtFreeMonths: number; totalInterest: string; otherStrategy: string; otherStrategyMonths: number; otherStrategyInterest: string; interestSavings: string; timeSaved: number; debts: Array<{ title: string; balance: string; apr: string; payment: string }> }) {
  const debtsHtml = `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse;">
      <tr style="background: ${CREAM};"><th style="padding: 12px; text-align: left; color: ${GOLD};">Debt</th><th style="padding: 12px; text-align: left; color: ${GOLD};">Balance</th><th style="padding: 12px; text-align: left; color: ${GOLD};">APR</th><th style="padding: 12px; text-align: left; color: ${GOLD};">Min Payment</th></tr>
      ${params.debts.map(d => `<tr><td style="padding: 12px; border-bottom: 1px solid ${GRAY_LIGHT};">${d.title}</td><td style="padding: 12px; border-bottom: 1px solid ${GRAY_LIGHT};">${d.balance}</td><td style="padding: 12px; border-bottom: 1px solid ${GRAY_LIGHT};">${d.apr}%</td><td style="padding: 12px; border-bottom: 1px solid ${GRAY_LIGHT};">${d.payment}</td></tr>`).join('')}
    </table>`

  return buildEmailHtml({
    preheaderText: `Your Payoff Blueprint - ${params.reference}`,
    hero: { title: 'Your Payoff Blueprint', subtitle: `Reference: ${params.reference} \u00b7 ${params.currency}`, bgColor: NAVY, textColor: WHITE },
    sections: [
      { title: 'Report Overview', content: `<p style="margin: 0 0 16px; font-size: 16px;">Hi <strong>${params.userName}</strong>,</p><p style="margin: 0 0 24px;">Thank you for using the KSEFinServe Debt Repayment Calculator. Your personalized payoff blueprint compares two strategies so you can choose the path that fits your goals.</p>` },
      { title: 'Your Debts', content: debtsHtml },
      { title: 'Strategy Comparison', content: `<p style="margin: 0 0 16px;">${params.strategy === 'Avalanche' ? 'Avalanche targets the highest APR first and usually costs less overall.' : 'Snowball targets the smallest balance first for earlier psychological wins.'}</p><p style="margin: 0;">Your selected strategy saves ${params.interestSavings} in interest and ${params.timeSaved} months vs. the alternative.</p>` },
      { title: 'Important Notes', content: `<ul style="margin: 0; padding-left: 20px; line-height: 2;"><li>Illustrative, not personalized advice. Fixed APRs assumed; interest added monthly</li><li>Fixed minimums and fixed extra payment roll over as debts are cleared</li><li>Actual payoff may vary with rate changes, fees, or additional borrowing</li><li>Consider consulting a financial advisor for a comprehensive debt plan</li></ul>` },
      { title: 'Your PDF Report', content: `<p style="margin: 0 0 16px;">A detailed PDF version of this blueprint is attached, including the month-by-month payoff timeline for both strategies and the remaining debt chart.</p><p style="margin: 0;">A little extra each month can change your debt-free date significantly.</p>` },
    ],
    cards: [
      { label: 'Selected Strategy', value: params.strategy },
      { label: 'Total Monthly Payment', value: params.totalMonthlyPayment },
      { label: 'Debt-Free Timeline', value: params.debtFreeMonths + ' months' },
      { label: 'Total Interest (Selected)', value: params.totalInterest },
      { label: 'Other Strategy', value: params.otherStrategy },
      { label: 'Other Strategy Timeline', value: params.otherStrategyMonths + ' months' },
      { label: 'Other Strategy Interest', value: params.otherStrategyInterest },
      { label: 'Interest Savings with Selected', value: params.interestSavings },
      { label: 'Time Saved with Selected', value: params.timeSaved + ' months' },
    ],
    button: { text: 'View Debt Repayment', href: 'https://ksefinserve.netlify.app/debt-repayment', bgColor: GOLD, textColor: NAVY },
  })
}

function retirementReportTemplate(params: { userName: string; reference: string; currency: string; ageToday: string; retireAge: string; yearsToRetirement: number; monthlyContribution: string; scenario: string; growthReturn: string; projectedSavings: string; estimatedAnnualIncome: string; annualIncomeGoal: string; fundingGap: string }) {
  return buildEmailHtml({
    preheaderText: `Your Retirement Roadmap - ${params.reference}`,
    hero: { title: 'Your Retirement Roadmap', subtitle: `Reference: ${params.reference} \u00b7 ${params.currency}`, bgColor: NAVY, textColor: WHITE },
    sections: [
      { title: 'Report Overview', content: `<p style="margin: 0 0 16px; font-size: 16px;">Hi <strong>${params.userName}</strong>,</p><p style="margin: 0 0 24px;">Thank you for using the KSEFinServe Retirement Planning Calculator. Your personalized retirement roadmap shows how today's savings could support tomorrow's income.</p>` },
      { title: 'Key Assumptions', content: `<ul style="margin: 0; padding-left: 20px; line-height: 2;"><li>Starting assets: RRSP $80,000 \u00b7 TFSA $30,000 \u00b7 Other $10,000</li><li>CPP/OAS: $1,500/month at age 65 (approx. $18,000/year)</li><li>Plan through age 95 \u00b7 Inflation 2% \u00b7 Growth return ${params.growthReturn}</li><li>Retirement draw: 4% initial annual withdrawal, rising 2% yearly</li><li>All amounts in future nominal ${params.currency}</li></ul>` },
      { title: 'Your PDF Report', content: `<p style="margin: 0 0 16px;">A detailed PDF version of this roadmap is attached, including the age-by-age savings buildup chart, withdrawal timeline, and income gap analysis.</p><p style="margin: 0;">Use this as a conversation starter for your next financial planning review.</p>` },
    ],
    cards: [
      { label: 'Age Today', value: params.ageToday + ' years' },
      { label: 'Retirement Age', value: params.retireAge + ' years' },
      { label: 'Years to Retirement', value: params.yearsToRetirement + ' years' },
      { label: 'Monthly Contribution', value: params.monthlyContribution },
      { label: 'Investment Scenario', value: params.scenario },
      { label: 'Assumed Growth Return', value: params.growthReturn },
      { label: 'Projected Savings at Age ' + params.retireAge, value: params.projectedSavings },
      { label: 'Estimated Annual Income (4% draw + CPP/OAS)', value: params.estimatedAnnualIncome },
      { label: 'Annual Income Goal', value: params.annualIncomeGoal },
      { label: 'Annual Funding Gap', value: params.fundingGap },
      { label: 'Assumed Inflation', value: '2%' },
      { label: 'Retirement Return Assumption', value: '3%' },
    ],
    button: { text: 'View Retirement Planning', href: 'https://ksefinserve.netlify.app/retirement-planning', bgColor: GOLD, textColor: NAVY },
  })
}

function compoundInterestReportTemplate(params: { userName: string; reference: string; currency: string; initialDeposit: string; years: number; annualRate: string; compoundFreq: string; contribution: string; contributionFreq: string; totalBalance: string; totalDeposits: string; interestEarned: string; interestPct: string; withoutContributions: string; apy: string }) {
  return buildEmailHtml({
    preheaderText: `Your Growth Report - ${params.reference}`,
    hero: { title: 'Your Growth Report', subtitle: `Reference: ${params.reference} \u00b7 ${params.currency}`, bgColor: NAVY, textColor: WHITE },
    sections: [
      { title: 'Report Overview', content: `<p style="margin: 0 0 16px; font-size: 16px;">Hi <strong>${params.userName}</strong>,</p><p style="margin: 0 0 24px;">Thank you for using the KSEFinServe Compound Interest Calculator. Your personalized growth report shows how time and consistency can make your money work harder.</p>` },
      { title: 'Key Assumptions', content: `<ul style="margin: 0; padding-left: 20px; line-height: 2;"><li>Contributions at period-end \u00b7 Constant annual rate \u00b7 ${params.compoundFreq.toLowerCase()} compounding</li><li>No taxes, fees, or withdrawals \u00b7 All values in ${params.currency}</li><li>${params.annualRate}% is the annual rate before compounding, not APY</li><li>${params.compoundFreq.toLowerCase()} compounding gives an effective annual yield of about ${params.apy}</li></ul>` },
      { title: 'The Power of Time', content: `<p style="margin: 0 0 16px;">The space between your deposits and your total balance is the interest earned\u2014and the interest on that interest. Time and consistency do the heavy lifting.</p><p style="margin: 0;">Staying invested lets compounding accelerate your growth in the later years.</p>` },
      { title: 'Your PDF Report', content: `<p style="margin: 0 0 16px;">A detailed PDF version of this report is attached, including the deposits vs. balance chart, year-by-year breakdown, and interest timeline.</p><p style="margin: 0;">Keep this projection as a reminder that small, steady steps build significant wealth over time.</p>` },
    ],
    cards: [
      { label: 'Initial Deposit', value: params.initialDeposit },
      { label: 'Years of Growth', value: params.years + ' years' },
      { label: 'Estimated Annual Rate', value: params.annualRate + '%' },
      { label: 'Compounding Frequency', value: params.compoundFreq },
      { label: 'Recurring Contribution', value: params.contribution },
      { label: 'Contribution Frequency', value: params.contributionFreq },
      { label: 'Total Balance After ' + params.years + ' Years', value: params.totalBalance },
      { label: 'Total Deposits', value: params.totalDeposits },
      { label: 'Interest Earned', value: params.interestEarned },
      { label: 'Interest as % of Ending Balance', value: params.interestPct },
      { label: 'Without Contributions (Same Rate)', value: params.withoutContributions },
      { label: 'Effective Annual Yield (APY)', value: params.apy },
    ],
    button: { text: 'View Compound Interest', href: 'https://ksefinserve.netlify.app/compound-interest', bgColor: GOLD, textColor: NAVY },
  })
}

async function generateTaxReportPDF(params: ReportPayload['data'], currency: 'USD' | 'CAD', reference: string): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create()
  const page = pdfDoc.addPage([612, 792])
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
  const navy = rgb(0.031, 0.114, 0.169)
  const gold = rgb(0.788, 0.663, 0.388)

  let y = 750
  const leftMargin = 50
  const lineHeight = 18

  page.drawText('KSEFinServe', { x: leftMargin, y, size: 28, font: fontBold, color: navy })
  y -= 30
  page.drawText('Tax Clarity Report', { x: leftMargin, y, size: 20, font: fontBold, color: gold })
  y -= 20
  page.drawText(`Reference: ${reference}`, { x: leftMargin, y, size: 10, font, color: rgb(0.4, 0.4, 0.4) })
  y -= 30

  page.drawText('Your Inputs', { x: leftMargin, y, size: 14, font: fontBold, color: navy })
  y -= 22
  const inputs = [
    ['Annual Employment Income', money(parseMoneyStr(params.income) || 80000, currency)],
    ['State', String(params.state || 'California')],
    ['Tax Year', String(params.taxYear || '2025')],
  ]
  for (const [label, value] of inputs) {
    page.drawText(label + ':', { x: leftMargin, y, size: 11, font: fontBold, color: rgb(0.2, 0.2, 0.2) })
    page.drawText(value, { x: leftMargin + 200, y, size: 11, font, color: rgb(0.3, 0.3, 0.3) })
    y -= lineHeight
  }
  y -= 10

  page.drawText('Estimated Tax Breakdown', { x: leftMargin, y, size: 14, font: fontBold, color: navy })
  y -= 22
  const results = [
    ['Federal Income Tax', money(parseMoneyStr(params.federalTax), currency)],
    ['State Income Tax', money(parseMoneyStr(params.stateTax), currency)],
    ['FICA (Social Security + Medicare)', money(parseMoneyStr(params.ficaTax), currency)],
    ['Total Estimated Tax', money(parseMoneyStr(params.totalTax), currency)],
    ['After-Tax Income', money(parseMoneyStr(params.afterTaxIncome), currency)],
    ['Average Tax Rate', String(params.avgRate || '')],
    ['Assumed Marginal Rate', String(params.marginalRate || '')],
    ['Income You Keep', String(params.keepPct || '')],
  ]
  for (const [label, value] of results) {
    page.drawText(label + ':', { x: leftMargin, y, size: 11, font: fontBold, color: rgb(0.2, 0.2, 0.2) })
    page.drawText(value, { x: leftMargin + 200, y, size: 11, font, color: rgb(0.3, 0.3, 0.3) })
    y -= lineHeight
  }
  y -= 15

  page.drawText('Important Notes:', { x: leftMargin, y, size: 11, font: fontBold, color: navy })
  y -= 16
  const notes = [
    'This is an illustrative estimate based on simplified 2025 tax brackets for single filers.',
    'Excludes CPP/QPP, EI, payroll contributions, credits, and individual circumstances.',
    'Not personalized tax advice - consult a qualified tax professional for filing decisions.',
    'Tax brackets apply progressively; your marginal rate applies only to your next dollar of income.',
  ]
  for (const note of notes) {
    page.drawText('\u2022 ' + note, { x: leftMargin + 10, y, size: 9, font, color: rgb(0.4, 0.4, 0.4) })
    y -= 14
  }

  y -= 10
  page.drawText('Generated by KSEFinServe | Clarity \u00b7 Growth \u00b7 Impact', { x: leftMargin, y, size: 8, font, color: rgb(0.5, 0.5, 0.5) })

  return pdfDoc.save()
}

async function generateCollegeReportPDF(params: ReportPayload['data'], currency: 'USD' | 'CAD', reference: string): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create()
  const page = pdfDoc.addPage([612, 792])
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
  const navy = rgb(0.031, 0.114, 0.169)
  const gold = rgb(0.788, 0.663, 0.388)

  let y = 750
  const leftMargin = 50
  const lineHeight = 18

  page.drawText('KSEFinServe', { x: leftMargin, y, size: 28, font: fontBold, color: navy })
  y -= 30
  page.drawText('Education Savings Plan', { x: leftMargin, y, size: 20, font: fontBold, color: gold })
  y -= 20
  page.drawText(`Reference: ${reference}`, { x: leftMargin, y, size: 10, font, color: rgb(0.4, 0.4, 0.4) })
  y -= 30

  page.drawText('Your Inputs', { x: leftMargin, y, size: 14, font: fontBold, color: navy })
  y -= 22
  const inputs = [
    ["Child's Current Age", String(params.childAge || '6') + ' years'],
    ['Education Start Age', String(params.startAge || '18') + ' years'],
    ['Years Until College', String(params.yearsToCollege || '12') + ' years'],
    ['Country', String(params.country || 'United States')],
    ['State/Province', String(params.state || 'California')],
    ['Already Saved', money(parseMoneyStr(params.alreadySaved) || 12000, currency)],
    ['Monthly Contribution', money(parseMoneyStr(params.monthlyContribution) || 250, currency)],
    ['Investment Scenario', String(params.scenario || 'Moderate')],
    ['Assumed Annual Return', String(params.annualReturn || '5')],
  ]
  for (const [label, value] of inputs) {
    page.drawText(label + ':', { x: leftMargin, y, size: 11, font: fontBold, color: rgb(0.2, 0.2, 0.2) })
    page.drawText(value, { x: leftMargin + 200, y, size: 11, font, color: rgb(0.3, 0.3, 0.3) })
    y -= lineHeight
  }
  y -= 10

  page.drawText('Projections', { x: leftMargin, y, size: 14, font: fontBold, color: navy })
  y -= 22
  const results = [
    ['Projected Savings at Age ' + params.startAge, money(parseMoneyStr(params.projectedSavings), currency)],
    ['Education Funding Goal (4 years)', money(parseMoneyStr(params.fundingGoal), currency)],
    ['Estimated Funding Gap', money(parseMoneyStr(params.fundingGap), currency)],
    ['Contribution to Close Gap', money(parseMoneyStr(params.contributionToCloseGap), currency) + '/mo'],
    ['Percentage of Goal Funded', String(params.percentFunded || '')],
  ]
  for (const [label, value] of results) {
    page.drawText(label + ':', { x: leftMargin, y, size: 11, font: fontBold, color: rgb(0.2, 0.2, 0.2) })
    page.drawText(value, { x: leftMargin + 200, y, size: 11, font, color: rgb(0.3, 0.3, 0.3) })
    y -= lineHeight
  }
  y -= 15

  page.drawText('Key Assumptions:', { x: leftMargin, y, size: 11, font: fontBold, color: navy })
  y -= 16
  const notes = [
    '4 years of education at $18,000/year (today\'s dollars), rising 3% annually.',
    'Contributions made monthly at period-end; returns compound monthly.',
    'Covers 100% of costs; no grants or other funding included.',
    'Household income $100k-$150k assumed for context.',
    `${params.country === 'Canada' ? 'Canadian' : 'US'} scenario in ${currency}.`,
  ]
  for (const note of notes) {
    page.drawText('\u2022 ' + note, { x: leftMargin + 10, y, size: 9, font, color: rgb(0.4, 0.4, 0.4) })
    y -= 14
  }

  y -= 10
  page.drawText('Generated by KSEFinServe | Clarity \u00b7 Growth \u00b7 Impact', { x: leftMargin, y, size: 8, font, color: rgb(0.5, 0.5, 0.5) })

  return pdfDoc.save()
}

async function generateDebtReportPDF(params: ReportPayload['data'], currency: 'USD' | 'CAD', reference: string): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create()
  const page = pdfDoc.addPage([612, 792])
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
  const navy = rgb(0.031, 0.114, 0.169)
  const gold = rgb(0.788, 0.663, 0.388)

  let y = 750
  const leftMargin = 50
  const lineHeight = 18

  page.drawText('KSEFinServe', { x: leftMargin, y, size: 28, font: fontBold, color: navy })
  y -= 30
  page.drawText('Payoff Blueprint', { x: leftMargin, y, size: 20, font: fontBold, color: gold })
  y -= 20
  page.drawText(`Reference: ${reference}`, { x: leftMargin, y, size: 10, font, color: rgb(0.4, 0.4, 0.4) })
  y -= 30

  page.drawText('Your Inputs', { x: leftMargin, y, size: 14, font: fontBold, color: navy })
  y -= 22
  page.drawText('Selected Strategy: ' + String(params.strategy || ''), { x: leftMargin, y, size: 11, font: fontBold, color: navy })
  y -= lineHeight
  page.drawText('Extra Monthly Payment: ' + money(parseMoneyStr(params.extraPayment), currency), { x: leftMargin, y, size: 11, font, color: rgb(0.3, 0.3, 0.3) })
  y -= lineHeight * 2

  page.drawText('Your Debts', { x: leftMargin, y, size: 12, font: fontBold, color: navy })
  y -= 20
  const debts = params.debts as Array<{ title: string; balance: string; apr: string; payment: string }> || [
    { title: 'Credit card', balance: '$8,000', apr: '19.99', payment: '$240' },
    { title: 'Personal loan', balance: '$4,000', apr: '6.99', payment: '$120' },
  ]
  page.drawText('Debt', { x: leftMargin, y, size: 10, font: fontBold, color: rgb(0.2, 0.2, 0.2) })
  page.drawText('Balance', { x: leftMargin + 150, y, size: 10, font: fontBold, color: rgb(0.2, 0.2, 0.2) })
  page.drawText('APR', { x: leftMargin + 250, y, size: 10, font: fontBold, color: rgb(0.2, 0.2, 0.2) })
  page.drawText('Min Payment', { x: leftMargin + 320, y, size: 10, font: fontBold, color: rgb(0.2, 0.2, 0.2) })
  y -= 16
  for (const debt of debts) {
    page.drawText(debt.title, { x: leftMargin, y, size: 10, font, color: rgb(0.3, 0.3, 0.3) })
    page.drawText(money(parseMoneyStr(debt.balance), currency), { x: leftMargin + 150, y, size: 10, font, color: rgb(0.3, 0.3, 0.3) })
    page.drawText(debt.apr + '%', { x: leftMargin + 250, y, size: 10, font, color: rgb(0.3, 0.3, 0.3) })
    page.drawText(money(parseMoneyStr(debt.payment), currency), { x: leftMargin + 320, y, size: 10, font, color: rgb(0.3, 0.3, 0.3) })
    y -= 16
  }
  y -= 10

  page.drawText('Strategy Comparison', { x: leftMargin, y, size: 14, font: fontBold, color: navy })
  y -= 22
  const results = [
    ['Total Monthly Payment', money(parseMoneyStr(params.totalMonthlyPayment), currency)],
    ['Debt-Free Timeline (Selected)', String(params.debtFreeMonths || '') + ' months'],
    ['Total Interest (Selected)', money(parseMoneyStr(params.totalInterest), currency)],
    ['Other Strategy', String(params.otherStrategy || '')],
    ['Other Strategy Timeline', String(params.otherStrategyMonths || '') + ' months'],
    ['Other Strategy Interest', money(parseMoneyStr(params.otherStrategyInterest), currency)],
    ['Interest Savings with Selected', money(parseMoneyStr(params.interestSavings), currency)],
    ['Time Saved with Selected', String(params.timeSaved || '') + ' months'],
  ]
  for (const [label, value] of results) {
    page.drawText(label + ':', { x: leftMargin, y, size: 11, font: fontBold, color: rgb(0.2, 0.2, 0.2) })
    page.drawText(value, { x: leftMargin + 200, y, size: 11, font, color: rgb(0.3, 0.3, 0.3) })
    y -= lineHeight
  }
  y -= 15

  page.drawText('Important Notes:', { x: leftMargin, y, size: 11, font: fontBold, color: navy })
  y -= 16
  const notes = [
    'Illustrative, not personalized advice. Fixed APRs assumed; interest added monthly.',
    'Fixed minimums and fixed extra payment roll over as debts are cleared.',
    'Actual payoff may vary with rate changes, fees, or additional borrowing.',
    'Consider consulting a financial advisor for a comprehensive debt plan.',
  ]
  for (const note of notes) {
    page.drawText('\u2022 ' + note, { x: leftMargin + 10, y, size: 9, font, color: rgb(0.4, 0.4, 0.4) })
    y -= 14
  }

  y -= 10
  page.drawText('Generated by KSEFinServe | Clarity \u00b7 Growth \u00b7 Impact', { x: leftMargin, y, size: 8, font, color: rgb(0.5, 0.5, 0.5) })

  return pdfDoc.save()
}

async function generateRetirementReportPDF(params: ReportPayload['data'], currency: 'USD' | 'CAD', reference: string): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create()
  const page = pdfDoc.addPage([612, 792])
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
  const navy = rgb(0.031, 0.114, 0.169)
  const gold = rgb(0.788, 0.663, 0.388)

  let y = 750
  const leftMargin = 50
  const lineHeight = 18

  page.drawText('KSEFinServe', { x: leftMargin, y, size: 28, font: fontBold, color: navy })
  y -= 30
  page.drawText('Retirement Roadmap', { x: leftMargin, y, size: 20, font: fontBold, color: gold })
  y -= 20
  page.drawText(`Reference: ${reference}`, { x: leftMargin, y, size: 10, font, color: rgb(0.4, 0.4, 0.4) })
  y -= 30

  page.drawText('Your Inputs', { x: leftMargin, y, size: 14, font: fontBold, color: navy })
  y -= 22
  const inputs = [
    ['Age Today', String(params.ageToday || '40') + ' years'],
    ['Retirement Age', String(params.retireAge || '65') + ' years'],
    ['Years to Retirement', String(params.yearsToRetirement || '25') + ' years'],
    ['Monthly Contribution', money(parseMoneyStr(params.monthlyContribution) || 600, currency)],
    ['Investment Scenario', String(params.scenario || 'Moderate')],
    ['Assumed Growth Return', String(params.growthReturn || '5')],
  ]
  for (const [label, value] of inputs) {
    page.drawText(label + ':', { x: leftMargin, y, size: 11, font: fontBold, color: rgb(0.2, 0.2, 0.2) })
    page.drawText(value, { x: leftMargin + 200, y, size: 11, font, color: rgb(0.3, 0.3, 0.3) })
    y -= lineHeight
  }
  y -= 10

  page.drawText('Projections', { x: leftMargin, y, size: 14, font: fontBold, color: navy })
  y -= 22
  const results = [
    ['Projected Savings at Age ' + params.retireAge, money(parseMoneyStr(params.projectedSavings), currency)],
    ['Estimated Annual Income (4% draw + CPP/OAS)', money(parseMoneyStr(params.estimatedAnnualIncome), currency)],
    ['Annual Income Goal', money(parseMoneyStr(params.annualIncomeGoal), currency)],
    ['Annual Funding Gap', money(parseMoneyStr(params.fundingGap), currency)],
    ['Assumed Inflation', '2%'],
    ['Retirement Return Assumption', '3%'],
  ]
  for (const [label, value] of results) {
    page.drawText(label + ':', { x: leftMargin, y, size: 11, font: fontBold, color: rgb(0.2, 0.2, 0.2) })
    page.drawText(value, { x: leftMargin + 200, y, size: 11, font, color: rgb(0.3, 0.3, 0.3) })
    y -= lineHeight
  }
  y -= 15

  page.drawText('Key Assumptions:', { x: leftMargin, y, size: 11, font: fontBold, color: navy })
  y -= 16
  const notes = [
    'Starting assets: RRSP $80,000 \u00b7 TFSA $30,000 \u00b7 Other $10,000.',
    'CPP/OAS: $1,500/month at age 65 (approx. $18,000/year).',
    'Plan through age 95 \u00b7 Inflation 2% \u00b7 Growth return ' + String(params.growthReturn || '') + '.',
    'Retirement draw: 4% initial annual withdrawal, rising 2% yearly.',
    'All amounts in future nominal ' + currency + '.',
  ]
  for (const note of notes) {
    page.drawText('\u2022 ' + note, { x: leftMargin + 10, y, size: 9, font, color: rgb(0.4, 0.4, 0.4) })
    y -= 14
  }

  y -= 10
  page.drawText('Generated by KSEFinServe | Clarity \u00b7 Growth \u00b7 Impact', { x: leftMargin, y, size: 8, font, color: rgb(0.5, 0.5, 0.5) })

  return pdfDoc.save()
}

async function generateCompoundReportPDF(params: ReportPayload['data'], currency: 'USD' | 'CAD', reference: string): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create()
  const page = pdfDoc.addPage([612, 792])
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
  const navy = rgb(0.031, 0.114, 0.169)
  const gold = rgb(0.788, 0.663, 0.388)

  let y = 750
  const leftMargin = 50
  const lineHeight = 18

  page.drawText('KSEFinServe', { x: leftMargin, y, size: 28, font: fontBold, color: navy })
  y -= 30
  page.drawText('Growth Report', { x: leftMargin, y, size: 20, font: fontBold, color: gold })
  y -= 20
  page.drawText(`Reference: ${reference}`, { x: leftMargin, y, size: 10, font, color: rgb(0.4, 0.4, 0.4) })
  y -= 30

  page.drawText('Your Inputs', { x: leftMargin, y, size: 14, font: fontBold, color: navy })
  y -= 22
  const inputs = [
    ['Initial Deposit', money(parseMoneyStr(params.initialDeposit) || 10000, currency)],
    ['Years of Growth', String(params.years || '10') + ' years'],
    ['Estimated Annual Rate', String(params.annualRate || '4') + '%'],
    ['Compounding Frequency', String(params.compoundFreq || 'Daily (365 times / year)')],
    ['Recurring Contribution', money(parseMoneyStr(params.contribution) || 100, currency)],
    ['Contribution Frequency', String(params.contributionFreq || 'Monthly')],
  ]
  for (const [label, value] of inputs) {
    page.drawText(label + ':', { x: leftMargin, y, size: 11, font: fontBold, color: rgb(0.2, 0.2, 0.2) })
    page.drawText(value, { x: leftMargin + 200, y, size: 11, font, color: rgb(0.3, 0.3, 0.3) })
    y -= lineHeight
  }
  y -= 10

  page.drawText('Projections', { x: leftMargin, y, size: 14, font: fontBold, color: navy })
  y -= 22
  const results = [
    ['Total Balance After ' + params.years + ' Years', money(parseMoneyStr(params.totalBalance), currency, 2)],
    ['Total Deposits', money(parseMoneyStr(params.totalDeposits), currency)],
    ['Interest Earned', money(parseMoneyStr(params.interestEarned), currency, 2)],
    ['Interest as % of Ending Balance', String(params.interestPct || '')],
    ['Without Contributions (Same Rate)', money(parseMoneyStr(params.withoutContributions), currency, 2)],
    ['Effective Annual Yield (APY)', String(params.apy || '')],
  ]
  for (const [label, value] of results) {
    page.drawText(label + ':', { x: leftMargin, y, size: 11, font: fontBold, color: rgb(0.2, 0.2, 0.2) })
    page.drawText(value, { x: leftMargin + 200, y, size: 11, font, color: rgb(0.3, 0.3, 0.3) })
    y -= lineHeight
  }
  y -= 15

  page.drawText('Key Assumptions:', { x: leftMargin, y, size: 11, font: fontBold, color: navy })
  y -= 16
  const notes = [
    'Contributions at period-end \u00b7 Constant annual rate \u00b7 ' + String(params.compoundFreq || '').toLowerCase() + ' compounding.',
    'No taxes, fees, or withdrawals \u00b7 All values in ' + currency + '.',
    String(params.annualRate || '') + '% is the annual rate before compounding, not APY.',
    String(params.compoundFreq || '').toLowerCase() + ' compounding gives an effective annual yield of about ' + String(params.apy || '') + '.',
  ]
  for (const note of notes) {
    page.drawText('\u2022 ' + note, { x: leftMargin + 10, y, size: 9, font, color: rgb(0.4, 0.4, 0.4) })
    y -= 14
  }

  y -= 10
  page.drawText('Generated by KSEFinServe | Clarity \u00b7 Growth \u00b7 Impact', { x: leftMargin, y, size: 8, font, color: rgb(0.5, 0.5, 0.5) })

  return pdfDoc.save()
}

export default async function handler(req: Request) {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders })
  }
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405)

  if (!SMTP_USER || !SMTP_PASS) {
    return json({ error: 'Email service not configured (missing SMTP credentials).' }, 500)
  }

  let payload: ReportPayload
  try {
    payload = await req.json()
  } catch {
    return json({ error: 'Invalid JSON body' }, 400)
  }

  if (!validatePayload(payload)) {
    return json({ error: 'Missing required fields: tool, email, userName, reference, currency, data' }, 400)
  }

  const { tool, email, userName, reference, currency, data } = payload

  try {
    await ensureTransporterReady()

    let pdfBytes: Uint8Array
    let subject: string
    let html: string
    let text: string
    let filename: string

    switch (tool) {
      case 'tax':
        pdfBytes = await generateTaxReportPDF(data, currency, reference)
        subject = `Your Tax Clarity Report \u2014 KSEFinServe (${reference})`
        html = taxReportTemplate({ userName, reference, currency, ...data })
        text = `Your tax clarity report for ${data.income} income in ${data.state}. Reference: ${reference}.`
        filename = `Tax-Clarity-Report-${reference}.pdf`
        break
      case 'college':
        pdfBytes = await generateCollegeReportPDF(data, currency, reference)
        subject = `Your Education Savings Plan \u2014 KSEFinServe (${reference})`
        html = collegeSavingsReportTemplate({ userName, reference, currency, ...data })
        text = `Your education savings plan for child age ${data.childAge}, starting at ${data.startAge}. Reference: ${reference}.`
        filename = `Education-Savings-Plan-${reference}.pdf`
        break
      case 'debt':
        pdfBytes = await generateDebtReportPDF(data, currency, reference)
        subject = `Your Payoff Blueprint \u2014 KSEFinServe (${reference})`
        html = debtRepaymentReportTemplate({ userName, reference, currency, ...data })
        text = `Your debt repayment blueprint using ${data.strategy} strategy. Debt-free in ${data.debtFreeMonths} months. Reference: ${reference}.`
        filename = `Payoff-Blueprint-${reference}.pdf`
        break
      case 'retirement':
        pdfBytes = await generateRetirementReportPDF(data, currency, reference)
        subject = `Your Retirement Roadmap \u2014 KSEFinServe (${reference})`
        html = retirementReportTemplate({ userName, reference, currency, ...data })
        text = `Your retirement roadmap: ${data.yearsToRetirement} years to retirement, projected savings ${data.projectedSavings}. Reference: ${reference}.`
        filename = `Retirement-Roadmap-${reference}.pdf`
        break
      case 'compound':
        pdfBytes = await generateCompoundReportPDF(data, currency, reference)
        subject = `Your Growth Report \u2014 KSEFinServe (${reference})`
        html = compoundInterestReportTemplate({ userName, reference, currency, ...data })
        text = `Your compound interest growth report: ${data.years} years, total balance ${data.totalBalance}. Reference: ${reference}.`
        filename = `Growth-Report-${reference}.pdf`
        break
      default:
        return json({ error: 'Invalid tool type' }, 400)
    }

    console.log('Sending report email to:', email, 'subject:', subject)

    const info = await transporter.sendMail({
      from: `"${EMAIL_FROM_NAME}" <${EMAIL_FROM}>`,
      to: email,
      subject,
      html,
      text,
      attachments: [
        {
          filename,
          content: pdfBytes,
          contentType: 'application/pdf',
        },
      ],
      headers: {
        'Precedence': 'bulk',
        'List-Unsubscribe': '<mailto:unsubscribe@ksefinserve.com>, <https://ksefinserve.com/unsubscribe>',
        'X-Auto-Response-Suppress': 'OOF, AutoReply',
      },
    })

    console.log('Report email sent:', info.messageId, 'to:', email)
    return json({ ok: true, messageId: info.messageId })
  } catch (err) {
    console.error('Send report error:', err)
    return json(
      { error: err instanceof Error ? err.message : 'Failed to send report' },
      500
    )
  }
}