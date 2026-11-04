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

// Create transporter once
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

// Generate reference number
function generateReference(): string {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `KSE-${timestamp}-${random}`
}

/* ---------- PDF Generation Functions ---------- */

async function generateTaxReportPDF(params: ReportPayload['data'], currency: 'USD' | 'CAD', reference: string): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create()
  const page = pdfDoc.addPage([612, 792]) // US Letter
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
  const navy = rgb(0.031, 0.114, 0.169) // #081d2b
  const gold = rgb(0.788, 0.663, 0.388) // #c9a963

  let y = 750
  const leftMargin = 50
  const lineHeight = 18

  // Header
  page.drawText('KSEFinServe', { x: leftMargin, y, size: 28, font: fontBold, color: navy })
  y -= 30
  page.drawText('Tax Clarity Report', { x: leftMargin, y, size: 20, font: fontBold, color: gold })
  y -= 20
  page.drawText(`Reference: ${reference}`, { x: leftMargin, y, size: 10, font, color: rgb(0.4, 0.4, 0.4) })
  y -= 30

  // Inputs section
  page.drawText('Your Inputs', { x: leftMargin, y, size: 14, font: fontBold, color: navy })
  y -= 22
  const inputs = [
    ['Annual Employment Income', money(Number(params.income) || 0, currency)],
    ['State', String(params.state || '')],
    ['Tax Year', String(params.taxYear || '2025')],
  ]
  for (const [label, value] of inputs) {
    page.drawText(label + ':', { x: leftMargin, y, size: 11, font: fontBold, color: rgb(0.2, 0.2, 0.2) })
    page.drawText(value, { x: leftMargin + 200, y, size: 11, font, color: rgb(0.3, 0.3, 0.3) })
    y -= lineHeight
  }
  y -= 10

  // Results section
  page.drawText('Estimated Tax Breakdown', { x: leftMargin, y, size: 14, font: fontBold, color: navy })
  y -= 22
  const results = [
    ['Federal Income Tax', money(Number(params.federalTax) || 0, currency)],
    ['State Income Tax', money(Number(params.stateTax) || 0, currency)],
    ['FICA (Social Security + Medicare)', money(Number(params.ficaTax) || 0, currency)],
    ['Total Estimated Tax', money(Number(params.totalTax) || 0, currency)],
    ['After-Tax Income', money(Number(params.afterTaxIncome) || 0, currency)],
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

  // Disclaimer
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
    ["Child's Current Age", String(params.childAge || '') + ' years'],
    ['Education Start Age', String(params.startAge || '') + ' years'],
    ['Years Until College', String(params.yearsToCollege || '') + ' years'],
    ['Country', String(params.country || '')],
    ['State/Province', String(params.state || '')],
    ['Already Saved', money(Number(params.alreadySaved) || 0, currency)],
    ['Monthly Contribution', money(Number(params.monthlyContribution) || 0, currency)],
    ['Investment Scenario', String(params.scenario || '')],
    ['Assumed Annual Return', String(params.annualReturn || '')],
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
    ['Projected Savings at Age ' + params.startAge, money(Number(params.projectedSavings) || 0, currency)],
    ['Education Funding Goal (4 years)', money(Number(params.fundingGoal) || 0, currency)],
    ['Estimated Funding Gap', money(Number(params.fundingGap) || 0, currency)],
    ['Contribution to Close Gap', money(Number(params.contributionToCloseGap) || 0, currency) + '/mo'],
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
  page.drawText('Extra Monthly Payment: ' + money(Number(params.extraPayment) || 0, currency), { x: leftMargin, y, size: 11, font, color: rgb(0.3, 0.3, 0.3) })
  y -= lineHeight * 2

  // Debts table header
  page.drawText('Your Debts', { x: leftMargin, y, size: 12, font: fontBold, color: navy })
  y -= 20
  const debts = params.debts as Array<{ title: string; balance: string; apr: string; payment: string }> || []
  page.drawText('Debt', { x: leftMargin, y, size: 10, font: fontBold, color: rgb(0.2, 0.2, 0.2) })
  page.drawText('Balance', { x: leftMargin + 150, y, size: 10, font: fontBold, color: rgb(0.2, 0.2, 0.2) })
  page.drawText('APR', { x: leftMargin + 250, y, size: 10, font: fontBold, color: rgb(0.2, 0.2, 0.2) })
  page.drawText('Min Payment', { x: leftMargin + 320, y, size: 10, font: fontBold, color: rgb(0.2, 0.2, 0.2) })
  y -= 16
  for (const debt of debts) {
    page.drawText(debt.title, { x: leftMargin, y, size: 10, font, color: rgb(0.3, 0.3, 0.3) })
    page.drawText(money(Number(debt.balance) || 0, currency), { x: leftMargin + 150, y, size: 10, font, color: rgb(0.3, 0.3, 0.3) })
    page.drawText(debt.apr + '%', { x: leftMargin + 250, y, size: 10, font, color: rgb(0.3, 0.3, 0.3) })
    page.drawText(money(Number(debt.payment) || 0, currency), { x: leftMargin + 320, y, size: 10, font, color: rgb(0.3, 0.3, 0.3) })
    y -= 16
  }
  y -= 10

  page.drawText('Strategy Comparison', { x: leftMargin, y, size: 14, font: fontBold, color: navy })
  y -= 22
  const results = [
    ['Total Monthly Payment', money(Number(params.totalMonthlyPayment) || 0, currency)],
    ['Debt-Free Timeline (Selected)', String(params.debtFreeMonths || '') + ' months'],
    ['Total Interest (Selected)', money(Number(params.totalInterest) || 0, currency)],
    ['Other Strategy', String(params.otherStrategy || '')],
    ['Other Strategy Timeline', String(params.otherStrategyMonths || '') + ' months'],
    ['Other Strategy Interest', money(Number(params.otherStrategyInterest) || 0, currency)],
    ['Interest Savings with Selected', money(Number(params.interestSavings) || 0, currency)],
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
    ['Age Today', String(params.ageToday || '') + ' years'],
    ['Retirement Age', String(params.retireAge || '') + ' years'],
    ['Years to Retirement', String(params.yearsToRetirement || '') + ' years'],
    ['Monthly Contribution', money(Number(params.monthlyContribution) || 0, currency)],
    ['Investment Scenario', String(params.scenario || '')],
    ['Assumed Growth Return', String(params.growthReturn || '')],
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
    ['Projected Savings at Age ' + params.retireAge, money(Number(params.projectedSavings) || 0, currency)],
    ['Estimated Annual Income (4% draw + CPP/OAS)', money(Number(params.estimatedAnnualIncome) || 0, currency)],
    ['Annual Income Goal', money(Number(params.annualIncomeGoal) || 0, currency)],
    ['Annual Funding Gap', money(Number(params.fundingGap) || 0, currency)],
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
    ['Initial Deposit', money(Number(params.initialDeposit) || 0, currency)],
    ['Years of Growth', String(params.years || '') + ' years'],
    ['Estimated Annual Rate', String(params.annualRate || '') + '%'],
    ['Compounding Frequency', String(params.compoundFreq || '')],
    ['Recurring Contribution', money(Number(params.contribution) || 0, currency)],
    ['Contribution Frequency', String(params.contributionFreq || '')],
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
    ['Total Balance After ' + params.years + ' Years', money(Number(params.totalBalance) || 0, currency, 2)],
    ['Total Deposits', money(Number(params.totalDeposits) || 0, currency)],
    ['Interest Earned', money(Number(params.interestEarned) || 0, currency, 2)],
    ['Interest as % of Ending Balance', String(params.interestPct || '')],
    ['Without Contributions (Same Rate)', money(Number(params.withoutContributions) || 0, currency, 2)],
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

/* ---------- Main Handler ---------- */

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

    // Generate PDF
    let pdfBytes: Uint8Array
    let subject: string
    let html: string
    let text: string
    let filename: string

    // Import email templates dynamically
    const { buildEmail, taxReportTemplate, collegeSavingsReportTemplate, debtRepaymentReportTemplate, retirementReportTemplate, compoundInterestReportTemplate } = await import('../../src/lib/email.ts')

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