/* Netlify Function: send financial tool report with PDF attachment.
   Generates a PDF report based on the tool type and user inputs,
   then emails it to the user via Namecheap hosting SMTP.
   Includes beautiful charts and graphs for each calculator. */

import type { Request } from '@netlify/functions'
import nodemailer from 'nodemailer'
import { PDFDocument, rgb, StandardFonts, PDFPage } from 'pdf-lib'
import { ChartJSNodeCanvas } from 'chartjs-node-canvas'

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

// Colors
const NAVY = '#081d2b'
const GOLD = '#c9a963'
const CREAM = '#f0ede6'
const WHITE = '#ffffff'
const GRAY = '#6b7280'
const GRAY_LIGHT = '#e5e7eb'
const TEXT_DARK = '#1f2937'
const CHART_BLUE = '#3b82f6'
const CHART_GREEN = '#10b981'
const CHART_ORANGE = '#f59e0b'
const CHART_RED = '#ef4444'
const CHART_GOLD = '#c9a963'
const CHART_GRAY = '#9ca3af'

function money(value: number, currency: 'USD' | 'CAD', decimals = 0): string {
  const sign = value < 0 ? '-' : ''
  const abs = Math.abs(value)
  const formatted = decimals > 0
    ? abs.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
    : Math.round(abs).toLocaleString('en-US')
  return sign + '$' + formatted
}

function parseMoneyStr(str: string): number {
  if (!str) return 0
  const cleaned = str.replace(/[$,%\s]/g, '')
  const val = Number(cleaned)
  return Number.isFinite(val) ? val : 0
}

// Chart generation
const chartWidth = 600
const chartHeight = 350
const chartCallback = (chartJS: any) => {
  chartJS.defaults.font.family = 'Helvetica'
  chartJS.defaults.font.size = 12
  chartJS.defaults.color = '#374151'
}

let canvasInstance: ChartJSNodeCanvas | null = null
let canvasInitFailed = false

function getChartCanvas(): ChartJSNodeCanvas | null {
  if (canvasInitFailed) return null
  if (canvasInstance) return canvasInstance
  try {
    canvasInstance = new ChartJSNodeCanvas({
      width: chartWidth,
      height: chartHeight,
      backgroundColour: 'white',
      chartCallback,
    })
    return canvasInstance
  } catch (err) {
    console.error('Chart canvas init failed:', err)
    canvasInitFailed = true
    return null
  }
}

async function generatePieChart(
  labels: string[],
  data: number[],
  colors: string[],
  title: string
): Promise<Buffer | null> {
  try {
    const config = {
      type: 'doughnut' as const,
      data: { labels, datasets: [{ data, backgroundColor: colors, borderWidth: 0 }] },
      options: {
        responsive: false,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'right' as const, labels: { font: { size: 12 }, padding: 16, usePointStyle: true, pointStyle: 'circle' } },
          title: { display: true, text: title, font: { size: 16, weight: 'bold' as const, family: 'Helvetica' }, color: NAVY, padding: { bottom: 20 } },
          tooltip: { backgroundColor: NAVY, titleFont: { size: 13 }, bodyFont: { size: 12 }, padding: 12 },
        },
        cutout: '60%',
      },
    }
    const canvas = getChartCanvas()
    if (!canvas) return null
    return await canvas.renderToBuffer(config)
  } catch (err) {
    console.error('Chart render failed (pie):', err)
    return null
  }
}

async function generateBarChart(
  labels: string[],
  data: number[],
  colors: string[],
  title: string,
  yLabel: string = ''
): Promise<Buffer | null> {
  try {
    const config = {
      type: 'bar' as const,
      data: { labels, datasets: [{ data, backgroundColor: colors, borderRadius: 8, borderSkipped: false }] },
      options: {
        responsive: false,
        maintainAspectRatio: false,
        indexAxis: 'y' as const,
        plugins: {
          legend: { display: false },
          title: { display: true, text: title, font: { size: 16, weight: 'bold' as const, family: 'Helvetica' }, color: NAVY, padding: { bottom: 20 } },
          tooltip: { backgroundColor: NAVY, titleFont: { size: 13 }, bodyFont: { size: 12 }, padding: 12, callbacks: { label: (ctx: any) => ' $' + ctx.raw.toLocaleString() } },
        },
        scales: {
          x: { grid: { display: false }, ticks: { font: { size: 11 } } },
          y: { grid: { color: '#f3f4f6' }, ticks: { font: { size: 11 } }, title: { display: true, text: yLabel, font: { size: 11 }, color: '#6b7280' } },
        },
      },
    }
    const canvas = getChartCanvas()
    if (!canvas) return null
    return await canvas.renderToBuffer(config)
  } catch (err) {
    console.error('Chart render failed (bar):', err)
    return null
  }
}

async function generateLineChart(
  labels: string[],
  datasets: Array<{ label: string; data: number[]; color: string }>,
  title: string,
  yLabel: string = ''
): Promise<Buffer | null> {
  try {
    const config = {
      type: 'line' as const,
      data: {
        labels,
        datasets: datasets.map(d => ({
          label: d.label,
          data: d.data,
          borderColor: d.color,
          backgroundColor: d.color + '20',
          fill: true,
          tension: 0.3,
          pointRadius: 4,
          pointHoverRadius: 6,
          borderWidth: 3,
        })),
      },
      options: {
        responsive: false,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'top' as const, labels: { font: { size: 12 }, padding: 16, usePointStyle: true } },
          title: { display: true, text: title, font: { size: 16, weight: 'bold' as const, family: 'Helvetica' }, color: NAVY, padding: { bottom: 20 } },
          tooltip: { backgroundColor: NAVY, titleFont: { size: 13 }, bodyFont: { size: 12 }, padding: 12, callbacks: { label: (ctx: any) => ctx.dataset.label + ': $' + ctx.raw.toLocaleString() } },
        },
        scales: {
          x: { grid: { color: '#f3f4f6' }, ticks: { font: { size: 11 } } },
          y: { grid: { color: '#f3f4f6' }, ticks: { font: { size: 11 }, callback: (val: number) => '$' + val.toLocaleString() }, title: { display: true, text: yLabel, font: { size: 11 }, color: '#6b7280' } },
        },
        interaction: { intersect: false, mode: 'index' as const },
      },
    }
    const canvas = getChartCanvas()
    if (!canvas) return null
    return await canvas.renderToBuffer(config)
  } catch (err) {
    console.error('Chart render failed (line):', err)
    return null
  }
}

// PDF helpers
const NAVY_RGB = rgb(0.031, 0.114, 0.169)
const GOLD_RGB = rgb(0.788, 0.663, 0.388)
const CREAM_RGB = rgb(0.941, 0.929, 0.902)

async function addChartToPDF(pdfDoc: PDFDocument, chartBuffer: Buffer | null, x: number, y: number, width: number = 300) {
  if (!chartBuffer) return 0
  try {
    const pngImage = await pdfDoc.embedPng(chartBuffer)
    const aspectRatio = pngImage.height / pngImage.width
    const height = width * aspectRatio
    pdfDoc.getPages()[0].drawImage(pngImage, { x, y: y - height, width, height })
    return height
  } catch (err) {
    console.error('Chart embed failed:', err)
    return 0
  }
}

async function drawSectionHeader(page: PDFPage, fontBold: any, text: string, x: number, y: number, color = NAVY_RGB) {
  page.drawText(text, { x, y, size: 16, font: fontBold, color })
  page.drawLine({ start: { x, y: y - 4 }, end: { x: x + 80, y: y - 4 }, thickness: 3, color: GOLD_RGB })
  return y - 20
}

async function drawKeyValue(page: PDFPage, font: any, fontBold: any, label: string, value: string, x: number, y: number) {
  page.drawText(label + ':', { x, y, size: 11, font: fontBold, color: rgb(0.2, 0.2, 0.2) })
  page.drawText(value, { x: x + 220, y, size: 11, font, color: rgb(0.3, 0.3, 0.3) })
  return y - 20
}

async function drawNote(page: PDFPage, font: any, text: string, x: number, y: number) {
  page.drawText('\u2022 ' + text, { x: x + 10, y, size: 9, font, color: rgb(0.4, 0.4, 0.4) })
  return y - 13
}

// Main PDF generators with charts
async function generateTaxReportPDF(data: ReportPayload['data'], currency: 'USD' | 'CAD', reference: string): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create()
  const page = pdfDoc.addPage([612, 792])
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

  let y = 750
  const leftMargin = 50

  page.drawText('KSEFinServe', { x: leftMargin, y, size: 28, font: fontBold, color: NAVY_RGB })
  y -= 30
  page.drawText('Tax Clarity Report', { x: leftMargin, y, size: 20, font: fontBold, color: GOLD_RGB })
  y -= 20
  page.drawText('Reference: ' + reference, { x: leftMargin, y, size: 10, font, color: rgb(0.4, 0.4, 0.4) })
  y -= 30

  y = await drawSectionHeader(page, fontBold, 'Your Inputs', leftMargin, y)
  const income = parseMoneyStr(data.income as string) || 80000
  const state = data.state as string || 'California'
  const taxYear = data.taxYear as string || '2025'
  y = await drawKeyValue(page, font, fontBold, 'Annual Employment Income', money(income, currency), leftMargin, y)
  y = await drawKeyValue(page, font, fontBold, 'State', state, leftMargin, y)
  y = await drawKeyValue(page, font, fontBold, 'Tax Year', taxYear, leftMargin, y)
  y -= 10

  y = await drawSectionHeader(page, fontBold, 'Estimated Tax Breakdown', leftMargin, y)
  const federalTax = parseMoneyStr(data.federalTax as string) || 0
  const stateTax = parseMoneyStr(data.stateTax as string) || 0
  const ficaTax = parseMoneyStr(data.ficaTax as string) || 0
  const totalTax = parseMoneyStr(data.totalTax as string) || 0
  const afterTaxIncome = parseMoneyStr(data.afterTaxIncome as string) || 0

  y = await drawKeyValue(page, font, fontBold, 'Federal Income Tax', money(federalTax, currency), leftMargin, y)
  y = await drawKeyValue(page, font, fontBold, 'State Income Tax', money(stateTax, currency), leftMargin, y)
  y = await drawKeyValue(page, font, fontBold, 'FICA (Social Security + Medicare)', money(ficaTax, currency), leftMargin, y)
  y = await drawKeyValue(page, font, fontBold, 'Total Estimated Tax', money(totalTax, currency), leftMargin, y)
  y = await drawKeyValue(page, font, fontBold, 'After-Tax Income', money(afterTaxIncome, currency), leftMargin, y)
  y = await drawKeyValue(page, font, fontBold, 'Average Tax Rate', String(data.avgRate || ''), leftMargin, y)
  y = await drawKeyValue(page, font, fontBold, 'Assumed Marginal Rate', String(data.marginalRate || ''), leftMargin, y)
  y = await drawKeyValue(page, font, fontBold, 'Income You Keep', String(data.keepPct || ''), leftMargin, y)
  y -= 15

  if (totalTax > 0) {
    const pieBuffer = await generatePieChart(
      ['Federal Tax', 'State Tax', 'FICA', 'After-Tax Income'],
      [federalTax, stateTax, ficaTax, afterTaxIncome],
      [CHART_BLUE, CHART_ORANGE, CHART_RED, CHART_GREEN],
      'Tax Allocation'
    )
    y = await addChartToPDF(pdfDoc, pieBuffer, 320, y + 10, 250)
  }

  y = await drawSectionHeader(page, fontBold, 'Important Notes', leftMargin, y)
  const notes = [
    'This is an illustrative estimate based on simplified 2025 tax brackets for single filers.',
    'Excludes CPP/QPP, EI, payroll contributions, credits, and individual circumstances.',
    'Not personalized tax advice - consult a qualified tax professional for filing decisions.',
    'Tax brackets apply progressively; your marginal rate applies only to your next dollar of income.',
  ]
  for (const note of notes) {
    y = await drawNote(page, font, note, leftMargin, y)
  }
  y -= 10
  page.drawText('Generated by KSEFinServe | Clarity \u00b7 Growth \u00b7 Impact', { x: leftMargin, y, size: 8, font, color: rgb(0.5, 0.5, 0.5) })
  return pdfDoc.save()
}

async function generateCollegeReportPDF(data: ReportPayload['data'], currency: 'USD' | 'CAD', reference: string): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create()
  const page = pdfDoc.addPage([612, 792])
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

  let y = 750
  const leftMargin = 50

  page.drawText('KSEFinServe', { x: leftMargin, y, size: 28, font: fontBold, color: NAVY_RGB })
  y -= 30
  page.drawText('Education Savings Plan', { x: leftMargin, y, size: 20, font: fontBold, color: GOLD_RGB })
  y -= 20
  page.drawText('Reference: ' + reference, { x: leftMargin, y, size: 10, font, color: rgb(0.4, 0.4, 0.4) })
  y -= 30

  y = await drawSectionHeader(page, fontBold, 'Your Inputs', leftMargin, y)
  const childAge = data.childAge as string || '6'
  const startAge = data.startAge as string || '18'
  const yearsToCollege = Number(data.yearsToCollege as string) || 12
  const country = data.country as string || 'United States'
  const state = data.state as string || 'California'
  const alreadySaved = parseMoneyStr(data.alreadySaved as string) || 12000
  const monthlyContribution = parseMoneyStr(data.monthlyContribution as string) || 250
  const scenario = data.scenario as string || 'Moderate'
  const annualReturn = data.annualReturn as string || '5'

  y = await drawKeyValue(page, font, fontBold, "Child's Current Age", childAge + ' years', leftMargin, y)
  y = await drawKeyValue(page, font, fontBold, 'Education Start Age', startAge + ' years', leftMargin, y)
  y = await drawKeyValue(page, font, fontBold, 'Years Until College', yearsToCollege + ' years', leftMargin, y)
  y = await drawKeyValue(page, font, fontBold, 'Country', country, leftMargin, y)
  y = await drawKeyValue(page, font, fontBold, 'State/Province', state, leftMargin, y)
  y = await drawKeyValue(page, font, fontBold, 'Already Saved', money(alreadySaved, currency), leftMargin, y)
  y = await drawKeyValue(page, font, fontBold, 'Monthly Contribution', money(monthlyContribution, currency), leftMargin, y)
  y = await drawKeyValue(page, font, fontBold, 'Investment Scenario', scenario, leftMargin, y)
  y = await drawKeyValue(page, font, fontBold, 'Assumed Annual Return', annualReturn + '%', leftMargin, y)
  y -= 10

  y = await drawSectionHeader(page, fontBold, 'Projections', leftMargin, y)
  const projectedSavings = parseMoneyStr(data.projectedSavings as string) || 0
  const fundingGoal = parseMoneyStr(data.fundingGoal as string) || 0
  const fundingGap = parseMoneyStr(data.fundingGap as string) || 0
  const contributionToCloseGap = parseMoneyStr(data.contributionToCloseGap as string) || 0
  const percentFunded = data.percentFunded as string || ''

  y = await drawKeyValue(page, font, fontBold, 'Projected Savings at Age ' + startAge, money(projectedSavings, currency), leftMargin, y)
  y = await drawKeyValue(page, font, fontBold, 'Education Funding Goal (4 years)', money(fundingGoal, currency), leftMargin, y)
  y = await drawKeyValue(page, font, fontBold, 'Estimated Funding Gap', money(fundingGap, currency), leftMargin, y)
  y = await drawKeyValue(page, font, fontBold, 'Contribution to Close Gap', money(contributionToCloseGap, currency) + '/mo', leftMargin, y)
  y = await drawKeyValue(page, font, fontBold, 'Percentage of Goal Funded', percentFunded, leftMargin, y)
  y -= 15

  if (fundingGoal > 0) {
    const barBuffer = await generateBarChart(
      ['Projected Savings', 'Funding Goal'],
      [projectedSavings, fundingGoal],
      [CHART_GREEN, CHART_BLUE],
      'Savings vs. Education Goal',
      'Amount ($)'
    )
    y = await addChartToPDF(pdfDoc, barBuffer, 320, y + 10, 250)
  }

  y = await drawSectionHeader(page, fontBold, 'Key Assumptions', leftMargin, y)
  const notes = [
    '4 years of education at $18,000/year (today\'s dollars), rising 3% annually.',
    'Contributions made monthly at period-end; returns compound monthly.',
    'Covers 100% of costs; no grants or other funding included.',
    'Household income $100k-$150k assumed for context.',
    (country === 'Canada' ? 'Canadian' : 'US') + ' scenario in ' + currency + '.',
  ]
  for (const note of notes) {
    y = await drawNote(page, font, note, leftMargin, y)
  }
  y -= 10
  page.drawText('Generated by KSEFinServe | Clarity \u00b7 Growth \u00b7 Impact', { x: leftMargin, y, size: 8, font, color: rgb(0.5, 0.5, 0.5) })
  return pdfDoc.save()
}

async function generateDebtReportPDF(data: ReportPayload['data'], currency: 'USD' | 'CAD', reference: string): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create()
  const page = pdfDoc.addPage([612, 792])
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

  let y = 750
  const leftMargin = 50

  page.drawText('KSEFinServe', { x: leftMargin, y, size: 28, font: fontBold, color: NAVY_RGB })
  y -= 30
  page.drawText('Payoff Blueprint', { x: leftMargin, y, size: 20, font: fontBold, color: GOLD_RGB })
  y -= 20
  page.drawText('Reference: ' + reference, { x: leftMargin, y, size: 10, font, color: rgb(0.4, 0.4, 0.4) })
  y -= 30

  y = await drawSectionHeader(page, fontBold, 'Your Inputs', leftMargin, y)
  const strategy = data.strategy as string || 'Avalanche'
  const extraPayment = parseMoneyStr(data.extraPayment as string) || 0
  y = await drawKeyValue(page, font, fontBold, 'Selected Strategy', strategy, leftMargin, y)
  y = await drawKeyValue(page, font, fontBold, 'Extra Monthly Payment', money(extraPayment, currency), leftMargin, y)
  y -= 10

  y = await drawSectionHeader(page, fontBold, 'Your Debts', leftMargin, y)
  const debts = data.debts as Array<{ title: string; balance: string; apr: string; payment: string }> || [
    { title: 'Credit card', balance: '$8,000', apr: '19.99', payment: '$240' },
    { title: 'Personal loan', balance: '$4,000', apr: '6.99', payment: '$120' },
  ]
  for (const debt of debts) {
    const balance = parseMoneyStr(debt.balance)
    const apr = Number(debt.apr) || 0
    const payment = parseMoneyStr(debt.payment)
    page.drawText(debt.title, { x: leftMargin, y, size: 11, font: fontBold, color: rgb(0.2, 0.2, 0.2) })
    page.drawText(money(balance, currency), { x: leftMargin + 150, y, size: 11, font, color: rgb(0.3, 0.3, 0.3) })
    page.drawText(debt.apr + '%', { x: leftMargin + 250, y, size: 11, font, color: rgb(0.3, 0.3, 0.3) })
    page.drawText(money(payment, currency), { x: leftMargin + 350, y, size: 11, font, color: rgb(0.3, 0.3, 0.3) })
    y -= 18
  }
  y -= 10

  y = await drawSectionHeader(page, fontBold, 'Strategy Comparison', leftMargin, y)
  const debtFreeMonths = Number(data.debtFreeMonths as string) || 0
  const totalInterest = parseMoneyStr(data.totalInterest as string) || 0
  const otherStrategy = data.otherStrategy as string || 'Snowball'
  const otherStrategyMonths = Number(data.otherStrategyMonths as string) || 0
  const otherStrategyInterest = parseMoneyStr(data.otherStrategyInterest as string) || 0
  const interestSavings = parseMoneyStr(data.interestSavings as string) || 0
  const timeSaved = Number(data.timeSaved as string) || 0
  const totalMonthlyPayment = parseMoneyStr(data.totalMonthlyPayment as string) || 0

  y = await drawKeyValue(page, font, fontBold, 'Total Monthly Payment', money(totalMonthlyPayment, currency), leftMargin, y)
  y = await drawKeyValue(page, font, fontBold, 'Debt-Free Timeline (Selected)', debtFreeMonths + ' months', leftMargin, y)
  y = await drawKeyValue(page, font, fontBold, 'Total Interest (Selected)', money(totalInterest, currency), leftMargin, y)
  y = await drawKeyValue(page, font, fontBold, 'Other Strategy', otherStrategy, leftMargin, y)
  y = await drawKeyValue(page, font, fontBold, 'Other Strategy Timeline', otherStrategyMonths + ' months', leftMargin, y)
  y = await drawKeyValue(page, font, fontBold, 'Other Strategy Interest', money(otherStrategyInterest, currency), leftMargin, y)
  y = await drawKeyValue(page, font, fontBold, 'Interest Savings with Selected', money(interestSavings, currency), leftMargin, y)
  y = await drawKeyValue(page, font, fontBold, 'Time Saved with Selected', timeSaved + ' months', leftMargin, y)
  y -= 15

  if (debtFreeMonths > 0 && otherStrategyMonths > 0) {
    const barBuffer = await generateBarChart(
      [strategy, otherStrategy],
      [debtFreeMonths, otherStrategyMonths],
      [CHART_GREEN, CHART_BLUE],
      'Months to Debt Freedom',
      'Months'
    )
    y = await addChartToPDF(pdfDoc, barBuffer, 320, y + 10, 250)
  }

  if (totalInterest > 0 && otherStrategyInterest > 0) {
    const barBuffer2 = await generateBarChart(
      [strategy, otherStrategy],
      [totalInterest, otherStrategyInterest],
      [CHART_GREEN, CHART_RED],
      'Total Interest Paid',
      'Interest ($)'
    )
    y = await addChartToPDF(pdfDoc, barBuffer2, 320, y + 10, 250)
  }

  y = await drawSectionHeader(page, fontBold, 'Important Notes', leftMargin, y)
  const notes = [
    'Illustrative, not personalized advice. Fixed APRs assumed; interest added monthly.',
    'Fixed minimums and fixed extra payment roll over as debts are cleared.',
    'Actual payoff may vary with rate changes, fees, or additional borrowing.',
    'Consider consulting a financial advisor for a comprehensive debt plan.',
  ]
  for (const note of notes) {
    y = await drawNote(page, font, note, leftMargin, y)
  }
  y -= 10
  page.drawText('Generated by KSEFinServe | Clarity \u00b7 Growth \u00b7 Impact', { x: leftMargin, y, size: 8, font, color: rgb(0.5, 0.5, 0.5) })
  return pdfDoc.save()
}

async function generateRetirementReportPDF(data: ReportPayload['data'], currency: 'USD' | 'CAD', reference: string): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create()
  const page = pdfDoc.addPage([612, 792])
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

  let y = 750
  const leftMargin = 50

  page.drawText('KSEFinServe', { x: leftMargin, y, size: 28, font: fontBold, color: NAVY_RGB })
  y -= 30
  page.drawText('Retirement Roadmap', { x: leftMargin, y, size: 20, font: fontBold, color: GOLD_RGB })
  y -= 20
  page.drawText('Reference: ' + reference, { x: leftMargin, y, size: 10, font, color: rgb(0.4, 0.4, 0.4) })
  y -= 30

  y = await drawSectionHeader(page, fontBold, 'Your Inputs', leftMargin, y)
  const ageToday = data.ageToday as string || '40'
  const retireAge = data.retireAge as string || '65'
  const yearsToRetirement = Number(data.yearsToRetirement as string) || 25
  const monthlyContribution = parseMoneyStr(data.monthlyContribution as string) || 600
  const scenario = data.scenario as string || 'Moderate'
  const growthReturn = data.growthReturn as string || '5'

  y = await drawKeyValue(page, font, fontBold, 'Age Today', ageToday + ' years', leftMargin, y)
  y = await drawKeyValue(page, font, fontBold, 'Retirement Age', retireAge + ' years', leftMargin, y)
  y = await drawKeyValue(page, font, fontBold, 'Years to Retirement', yearsToRetirement + ' years', leftMargin, y)
  y = await drawKeyValue(page, font, fontBold, 'Monthly Contribution', money(monthlyContribution, currency), leftMargin, y)
  y = await drawKeyValue(page, font, fontBold, 'Investment Scenario', scenario, leftMargin, y)
  y = await drawKeyValue(page, font, fontBold, 'Assumed Growth Return', growthReturn + '%', leftMargin, y)
  y -= 10

  y = await drawSectionHeader(page, fontBold, 'Projections', leftMargin, y)
  const projectedSavings = parseMoneyStr(data.projectedSavings as string) || 0
  const estimatedAnnualIncome = parseMoneyStr(data.estimatedAnnualIncome as string) || 0
  const annualIncomeGoal = parseMoneyStr(data.annualIncomeGoal as string) || 0
  const fundingGap = parseMoneyStr(data.fundingGap as string) || 0

  y = await drawKeyValue(page, font, fontBold, 'Projected Savings at Age ' + retireAge, money(projectedSavings, currency), leftMargin, y)
  y = await drawKeyValue(page, font, fontBold, 'Estimated Annual Income (4% draw + CPP/OAS)', money(estimatedAnnualIncome, currency), leftMargin, y)
  y = await drawKeyValue(page, font, fontBold, 'Annual Income Goal', money(annualIncomeGoal, currency), leftMargin, y)
  y = await drawKeyValue(page, font, fontBold, 'Annual Funding Gap', money(fundingGap, currency), leftMargin, y)
  y = await drawKeyValue(page, font, fontBold, 'Assumed Inflation', '2%', leftMargin, y)
  y = await drawKeyValue(page, font, fontBold, 'Retirement Return Assumption', '3%', leftMargin, y)
  y -= 15

  if (yearsToRetirement > 0 && projectedSavings > 0) {
    const yearlyLabels = Array.from({ length: yearsToRetirement + 1 }, (_, i) => (parseInt(ageToday) + i).toString())
    const yearlyData = Array.from({ length: yearsToRetirement + 1 }, (_, i) => Math.round(projectedSavings * Math.pow(1 + parseFloat(growthReturn) / 100, - (yearsToRetirement - i)) * (i / yearsToRetirement)))
    const lineBuffer = await generateLineChart(
      yearlyLabels,
      [{ label: 'Projected Savings', data: yearlyData, color: CHART_BLUE }],
      'Retirement Savings Growth',
      'Savings ($)'
    )
    y = await addChartToPDF(pdfDoc, lineBuffer, 320, y + 10, 250)
  }

  if (estimatedAnnualIncome > 0 && annualIncomeGoal > 0) {
    const barBuffer = await generateBarChart(
      ['Estimated Income', 'Income Goal'],
      [estimatedAnnualIncome, annualIncomeGoal],
      [CHART_GREEN, CHART_BLUE],
      'Retirement Income vs. Goal',
      'Annual Income ($)'
    )
    y = await addChartToPDF(pdfDoc, barBuffer, 320, y + 10, 250)
  }

  y = await drawSectionHeader(page, fontBold, 'Key Assumptions', leftMargin, y)
  const assumptionNotes = [
    'Starting assets: RRSP $80,000 \u00b7 TFSA $30,000 \u00b7 Other $10,000.',
    'CPP/OAS: $1,500/month at age 65 (approx. $18,000/year).',
    'Plan through age 95 \u00b7 Inflation 2% \u00b7 Growth return ' + growthReturn + '%.',
    'Retirement draw: 4% initial annual withdrawal, rising 2% yearly.',
    'All amounts in future nominal ' + currency + '.',
  ]
  for (const note of assumptionNotes) {
    y = await drawNote(page, font, note, leftMargin, y)
  }
  y -= 10
  page.drawText('Generated by KSEFinServe | Clarity \u00b7 Growth \u00b7 Impact', { x: leftMargin, y, size: 8, font, color: rgb(0.5, 0.5, 0.5) })
  return pdfDoc.save()
}

async function generateCompoundReportPDF(data: ReportPayload['data'], currency: 'USD' | 'CAD', reference: string): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create()
  const page = pdfDoc.addPage([612, 792])
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

  let y = 750
  const leftMargin = 50

  page.drawText('KSEFinServe', { x: leftMargin, y, size: 28, font: fontBold, color: NAVY_RGB })
  y -= 30
  page.drawText('Growth Report', { x: leftMargin, y, size: 20, font: fontBold, color: GOLD_RGB })
  y -= 20
  page.drawText('Reference: ' + reference, { x: leftMargin, y, size: 10, font, color: rgb(0.4, 0.4, 0.4) })
  y -= 30

  y = await drawSectionHeader(page, fontBold, 'Your Inputs', leftMargin, y)
  const initialDeposit = parseMoneyStr(data.initialDeposit as string) || 10000
  const years = Number(data.years as string) || 10
  const annualRate = data.annualRate as string || '4'
  const compoundFreq = data.compoundFreq as string || 'Daily (365 times / year)'
  const contribution = parseMoneyStr(data.contribution as string) || 100
  const contributionFreq = data.contributionFreq as string || 'Monthly'

  y = await drawKeyValue(page, font, fontBold, 'Initial Deposit', money(initialDeposit, currency), leftMargin, y)
  y = await drawKeyValue(page, font, fontBold, 'Years of Growth', years + ' years', leftMargin, y)
  y = await drawKeyValue(page, font, fontBold, 'Estimated Annual Rate', annualRate + '%', leftMargin, y)
  y = await drawKeyValue(page, font, fontBold, 'Compounding Frequency', compoundFreq, leftMargin, y)
  y = await drawKeyValue(page, font, fontBold, 'Recurring Contribution', money(contribution, currency), leftMargin, y)
  y = await drawKeyValue(page, font, fontBold, 'Contribution Frequency', contributionFreq, leftMargin, y)
  y -= 10

  y = await drawSectionHeader(page, fontBold, 'Projections', leftMargin, y)
  const totalBalance = parseMoneyStr(data.totalBalance as string) || 0
  const totalDeposits = parseMoneyStr(data.totalDeposits as string) || 0
  const interestEarned = parseMoneyStr(data.interestEarned as string) || 0
  const interestPct = data.interestPct as string || ''
  const withoutContributions = parseMoneyStr(data.withoutContributions as string) || 0
  const apy = data.apy as string || ''

  y = await drawKeyValue(page, font, fontBold, 'Total Balance After ' + years + ' Years', money(totalBalance, currency, 2), leftMargin, y)
  y = await drawKeyValue(page, font, fontBold, 'Total Deposits', money(totalDeposits, currency), leftMargin, y)
  y = await drawKeyValue(page, font, fontBold, 'Interest Earned', money(interestEarned, currency, 2), leftMargin, y)
  y = await drawKeyValue(page, font, fontBold, 'Interest as % of Ending Balance', interestPct, leftMargin, y)
  y = await drawKeyValue(page, font, fontBold, 'Without Contributions (Same Rate)', money(withoutContributions, currency, 2), leftMargin, y)
  y = await drawKeyValue(page, font, fontBold, 'Effective Annual Yield (APY)', apy, leftMargin, y)
  y -= 15

  if (totalDeposits > 0 && interestEarned > 0) {
    const pieBuffer = await generatePieChart(
      ['Total Deposits', 'Interest Earned'],
      [totalDeposits, interestEarned],
      [CHART_BLUE, CHART_GOLD],
      'What Built Your Wealth'
    )
    y = await addChartToPDF(pdfDoc, pieBuffer, 320, y + 10, 250)
  }

  if (years > 0 && totalBalance > 0) {
    const yearlyLabels = Array.from({ length: years + 1 }, (_, i) => i.toString())
    const rate = parseFloat(annualRate) / 100
    const freq = compoundFreq.toLowerCase().includes('daily') ? 365 : compoundFreq.toLowerCase().includes('monthly') ? 12 : 1
    const periodicRate = rate / freq
    const periodsPerYear = freq
    const yearlyData = Array.from({ length: years + 1 }, (_, i) => {
      const periods = i * periodsPerYear
      return initialDeposit * Math.pow(1 + periodicRate, periods) +
        (contribution * (Math.pow(1 + periodicRate, periods) - 1) / periodicRate)
    })
    const lineBuffer = await generateLineChart(
      yearlyLabels,
      [
        { label: 'With Contributions', data: yearlyData, color: CHART_BLUE },
        { label: 'Without Contributions', data: yearlyData.map((v, i) => initialDeposit * Math.pow(1 + periodicRate, i * periodsPerYear)), color: CHART_GRAY }
      ],
      'Compound Growth Over Time',
      'Balance ($)'
    )
    y = await addChartToPDF(pdfDoc, lineBuffer, 320, y + 10, 250)
  }

  if (totalBalance > 0 && withoutContributions > 0) {
    const barBuffer = await generateBarChart(
      ['With Contributions', 'Without Contributions'],
      [totalBalance, withoutContributions],
      [CHART_GREEN, CHART_GRAY],
      'Impact of Regular Contributions',
      'Final Balance ($)'
    )
    y = await addChartToPDF(pdfDoc, barBuffer, 320, y + 10, 250)
  }

  y = await drawSectionHeader(page, fontBold, 'Key Assumptions', leftMargin, y)
  const notes = [
    'Contributions at period-end \u00b7 Constant annual rate \u00b7 ' + compoundFreq.toLowerCase() + ' compounding.',
    'No taxes, fees, or withdrawals \u00b7 All values in ' + currency + '.',
    annualRate + '% is the annual rate before compounding, not APY.',
    compoundFreq.toLowerCase() + ' compounding gives an effective annual yield of about ' + apy + '.',
  ]
  for (const note of notes) {
    y = await drawNote(page, font, note, leftMargin, y)
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
        subject = 'Your Tax Clarity Report \u2014 KSEFinServe (' + reference + ')'
        html = taxReportTemplate({ userName, reference, currency, ...data })
        text = 'Your tax clarity report for ' + data.income + ' income in ' + data.state + '. Reference: ' + reference + '.'
        filename = 'Tax-Clarity-Report-' + reference + '.pdf'
        break
      case 'college':
        pdfBytes = await generateCollegeReportPDF(data, currency, reference)
        subject = 'Your Education Savings Plan \u2014 KSEFinServe (' + reference + ')'
        html = collegeSavingsReportTemplate({ userName, reference, currency, ...data })
        text = 'Your education savings plan for child age ' + data.childAge + ', starting at ' + data.startAge + '. Reference: ' + reference + '.'
        filename = 'Education-Savings-Plan-' + reference + '.pdf'
        break
      case 'debt':
        pdfBytes = await generateDebtReportPDF(data, currency, reference)
        subject = 'Your Payoff Blueprint \u2014 KSEFinServe (' + reference + ')'
        html = debtRepaymentReportTemplate({ userName, reference, currency, ...data })
        text = 'Your debt repayment blueprint using ' + data.strategy + ' strategy. Debt-free in ' + data.debtFreeMonths + ' months. Reference: ' + reference + '.'
        filename = 'Payoff-Blueprint-' + reference + '.pdf'
        break
      case 'retirement':
        pdfBytes = await generateRetirementReportPDF(data, currency, reference)
        subject = 'Your Retirement Roadmap \u2014 KSEFinServe (' + reference + ')'
        html = retirementReportTemplate({ userName, reference, currency, ...data })
        text = 'Your retirement roadmap: ' + data.yearsToRetirement + ' years to retirement, projected savings ' + data.projectedSavings + '. Reference: ' + reference + '.'
        filename = 'Retirement-Roadmap-' + reference + '.pdf'
        break
      case 'compound':
        pdfBytes = await generateCompoundReportPDF(data, currency, reference)
        subject = 'Your Growth Report \u2014 KSEFinServe (' + reference + ')'
        html = compoundInterestReportTemplate({ userName, reference, currency, ...data })
        text = 'Your compound interest growth report: ' + data.years + ' years, total balance ' + data.totalBalance + '. Reference: ' + reference + '.'
        filename = 'Growth-Report-' + reference + '.pdf'
        break
      default:
        return json({ error: 'Invalid tool type' }, 400)
    }

    console.log('Sending report email to:', email, 'subject:', subject)

    const info = await transporter.sendMail({
      from: '"' + EMAIL_FROM_NAME + '" <' + EMAIL_FROM + '>',
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

// Email templates
function buildEmailHtml(opts: {
  preheaderText: string
  hero: { title: string; subtitle: string; bgColor: string; textColor: string }
  sections: Array<{ title: string; content: string; bgColor?: string }>
  cards?: Array<{ label: string; value: string }>
  button?: { text: string; href: string; bgColor: string; textColor: string }
}): string {
  const heroHtml = '<div style="background-color: ' + opts.hero.bgColor + '; padding: 48px 32px; text-align: center; border-radius: 16px 16px 0 0;"><h1 style="margin: 0 0 16px; font-family: Georgia, serif; font-size: 32px; font-weight: 600; line-height: 1.3; color: ' + opts.hero.textColor + ';">' + opts.hero.title + '</h1><p style="margin: 0; font-size: 18px; line-height: 1.5; opacity: 0.9; color: ' + opts.hero.textColor + ';">' + opts.hero.subtitle + '</p></div>'

  const sectionsHtml = opts.sections.map(s => '<div style="background-color: ' + (s.bgColor || WHITE) + '; padding: 32px;"><h2 style="margin: 0 0 16px; font-family: Georgia, serif; font-size: 24px; font-weight: 600; color: ' + NAVY + ';">' + s.title + '</h2><div style="color: ' + TEXT_DARK + '; line-height: 1.7;">' + s.content + '</div></div>').join('')

  const cardsHtml = opts.cards && opts.cards.length ? '<div style="background-color: ' + CREAM + '; padding: 32px; border-radius: 12px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse;">' + opts.cards.map(item => '<tr><td style="padding: 12px 0; border-bottom: 1px solid ' + GRAY_LIGHT + '; vertical-align: top;"><span style="display: block; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: ' + GOLD + '; margin-bottom: 4px;">' + item.label + '</span><span style="font-size: 16px; color: ' + TEXT_DARK + '; line-height: 1.5;">' + item.value + '</span></td></tr>').join('') + '</table></div>' : ''

  const buttonHtml = opts.button ? '<div style="text-align: center; margin: 32px 0;"><a href="' + opts.button.href + '" style="display: inline-block; background-color: ' + opts.button.bgColor + '; color: ' + opts.button.textColor + '; padding: 16px 32px; border-radius: 8px; font-size: 16px; font-weight: 600; text-decoration: none; font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif;">' + opts.button.text + '</a></div>' : ''

  const footerHtml = '<div style="background-color: ' + NAVY + '; padding: 32px; text-align: center; border-radius: 0 0 16px 16px;"><div style="margin-bottom: 16px;"><a href="https://ksefinserve.com" style="display: inline-block; margin: 0 8px;"><svg xmlns="http://www.w3.org/2000/svg" width="120" height="44" viewBox="0 0 120 44" fill="none"><rect width="120" height="44" fill="' + NAVY + '"/><text x="60" y="30" font-family="Georgia,serif" font-size="16" font-weight="600" fill="' + GOLD + '" text-anchor="middle" alignment-baseline="middle">KSEFinServe</text></svg></a></div><p style="margin: 8px 0; font-size: 14px; color: rgba(255,255,255,0.7);">Clarity \u00b7 Growth \u00b7 Impact</p><p style="margin: 16px 0 0; font-size: 12px; color: rgba(255,255,255,0.5);">\u00a9 2026 KSEFinServe. All rights reserved.<br>363 N Sam Houston Pkwy E, Suite 200, Houston, TX 77060</p><div style="margin-top: 24px;"><a href="https://www.linkedin.com/company/ksefinserve" style="margin: 0 8px; color: rgba(255,255,255,0.7); text-decoration: none;">LinkedIn</a><span style="color: rgba(255,255,255,0.3);">|</span><a href="mailto:info@ksefinserve.com" style="margin: 0 8px; color: rgba(255,255,255,0.7); text-decoration: none;">Contact</a><span style="color: rgba(255,255,255,0.3);">|</span><a href="https://ksefinserve.com/unsubscribe" style="margin: 0 8px; color: rgba(255,255,255,0.7); text-decoration: none;">Unsubscribe</a></div></div>'

  return '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta name="x-apple-disable-message-reformatting"><title>' + opts.hero.title + '</title><style>@media only screen and (max-width: 600px) { .email-container { width: 100% !important; } .padding { padding: 24px !important; } h1 { font-size: 28px !important; } h2 { font-size: 22px !important; } }</style></head><body style="margin: 0; padding: 0; background-color: ' + CREAM + '; font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif;"><div style="display: none; font-size: 1px; line-height: 1px; max-height: 0; max-width: 0; opacity: 0; overflow: hidden;">' + opts.preheaderText + '</div><div style="max-width: 600px; margin: 0 auto; background-color: ' + WHITE + '; font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif; color: ' + TEXT_DARK + '; line-height: 1.6;">' + heroHtml + sectionsHtml + cardsHtml + buttonHtml + footerHtml + '</div></body></html>'
}

function taxReportTemplate(params: { userName: string; reference: string; currency: string; income: string; state: string; taxYear: string; federalTax: string; stateTax: string; ficaTax: string; totalTax: string; afterTaxIncome: string; avgRate: string; marginalRate: string; keepPct: string }) {
  return buildEmailHtml({
    preheaderText: 'Your Tax Clarity Report - ' + params.reference,
    hero: { title: 'Your Tax Clarity Report', subtitle: 'Reference: ' + params.reference + ' \u00b7 ' + params.currency, bgColor: NAVY, textColor: WHITE },
    sections: [
      { title: 'Report Overview', content: '<p style="margin: 0 0 16px; font-size: 16px;">Hi <strong>' + params.userName + '</strong>,</p><p style="margin: 0 0 24px;">Thank you for using the KSEFinServe Tax Calculator. Your personalized tax clarity report is ready.</p>' },
      { title: 'Important Notes', content: '<ul style="margin: 0; padding-left: 20px; line-height: 2;"><li>Illustrative estimate based on simplified 2025 tax brackets for single filers</li><li>Excludes CPP/QPP, EI, payroll contributions, credits, and individual circumstances</li><li>Not personalized tax advice - consult a qualified tax professional for filing decisions</li><li>Tax brackets apply progressively; your marginal rate applies only to your next dollar of income</li></ul>' },
      { title: 'Your PDF Report', content: '<p style="margin: 0 0 16px;">A detailed PDF version of this report is attached, including the full tax allocation chart and assumptions.</p>' },
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
    preheaderText: 'Your Education Savings Plan - ' + params.reference,
    hero: { title: 'Your Education Savings Plan', subtitle: 'Reference: ' + params.reference + ' \u00b7 ' + params.currency, bgColor: NAVY, textColor: WHITE },
    sections: [
      { title: 'Report Overview', content: '<p style="margin: 0 0 16px; font-size: 16px;">Hi <strong>' + params.userName + '</strong>,</p><p style="margin: 0 0 24px;">Your personalized education savings plan is ready, showing how your contributions could help fund your child\'s future education.</p>' },
      { title: 'Key Assumptions', content: '<ul style="margin: 0; padding-left: 20px; line-height: 2;"><li>4 years of education at $18,000/year (today\'s dollars), rising 3% annually</li><li>Contributions made monthly at period-end; returns compound monthly</li><li>Covers 100% of costs; no grants or other funding included</li><li>Household income $100k-$150k assumed for context</li></ul>' },
      { title: 'Your PDF Report', content: '<p style="margin: 0 0 16px;">A detailed PDF version of this plan is attached, including the savings vs. goal chart and full assumptions.</p>' },
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
  const debtsHtml = '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse;"><tr style="background: ' + CREAM + ';"><th style="padding: 12px; text-align: left; color: ' + GOLD + ';">Debt</th><th style="padding: 12px; text-align: left; color: ' + GOLD + ';">Balance</th><th style="padding: 12px; text-align: left; color: ' + GOLD + ';">APR</th><th style="padding: 12px; text-align: left; color: ' + GOLD + ';">Min Payment</th></tr>' + params.debts.map(d => '<tr><td style="padding: 12px; border-bottom: 1px solid ' + GRAY_LIGHT + ';">' + d.title + '</td><td style="padding: 12px; border-bottom: 1px solid ' + GRAY_LIGHT + ';">' + d.balance + '</td><td style="padding: 12px; border-bottom: 1px solid ' + GRAY_LIGHT + ';">' + d.apr + '%</td><td style="padding: 12px; border-bottom: 1px solid ' + GRAY_LIGHT + ';">' + d.payment + '</td></tr>').join('') + '</table>'

  return buildEmailHtml({
    preheaderText: 'Your Payoff Blueprint - ' + params.reference,
    hero: { title: 'Your Payoff Blueprint', subtitle: 'Reference: ' + params.reference + ' \u00b7 ' + params.currency, bgColor: NAVY, textColor: WHITE },
    sections: [
      { title: 'Report Overview', content: '<p style="margin: 0 0 16px; font-size: 16px;">Hi <strong>' + params.userName + '</strong>,</p><p style="margin: 0 0 24px;">Your personalized payoff blueprint compares two strategies so you can choose the path that fits your goals.</p>' },
      { title: 'Your Debts', content: debtsHtml },
      { title: 'Strategy Comparison', content: '<p style="margin: 0 0 16px;">' + (params.strategy === 'Avalanche' ? 'Avalanche targets the highest APR first and usually costs less overall.' : 'Snowball targets the smallest balance first for earlier psychological wins.') + '</p><p style="margin: 0;">Your selected strategy saves ' + params.interestSavings + ' in interest and ' + params.timeSaved + ' months vs. the alternative.</p>' },
      { title: 'Your PDF Report', content: '<p style="margin: 0 0 16px;">A detailed PDF version of this blueprint is attached, including the strategy comparison charts.</p>' },
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
    preheaderText: 'Your Retirement Roadmap - ' + params.reference,
    hero: { title: 'Your Retirement Roadmap', subtitle: 'Reference: ' + params.reference + ' \u00b7 ' + params.currency, bgColor: NAVY, textColor: WHITE },
    sections: [
      { title: 'Report Overview', content: '<p style="margin: 0 0 16px; font-size: 16px;">Hi <strong>' + params.userName + '</strong>,</p><p style="margin: 0 0 24px;">Your personalized retirement roadmap shows how today\'s savings could support tomorrow\'s income.</p>' },
      { title: 'Key Assumptions', content: '<ul style="margin: 0; padding-left: 20px; line-height: 2;"><li>Starting assets: RRSP $80,000 \u00b7 TFSA $30,000 \u00b7 Other $10,000</li><li>CPP/OAS: $1,500/month at age 65 (approx. $18,000/year)</li><li>Plan through age 95 \u00b7 Inflation 2% \u00b7 Growth return ' + params.growthReturn + '</li><li>Retirement draw: 4% initial annual withdrawal, rising 2% yearly</li><li>All amounts in future nominal ' + params.currency + '</li></ul>' },
      { title: 'Your PDF Report', content: '<p style="margin: 0 0 16px;">A detailed PDF version of this roadmap is attached, including the savings growth chart and income gap analysis.</p>' },
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
    preheaderText: 'Your Growth Report - ' + params.reference,
    hero: { title: 'Your Growth Report', subtitle: 'Reference: ' + params.reference + ' \u00b7 ' + params.currency, bgColor: NAVY, textColor: WHITE },
    sections: [
      { title: 'Report Overview', content: '<p style="margin: 0 0 16px; font-size: 16px;">Hi <strong>' + params.userName + '</strong>,</p><p style="margin: 0 0 24px;">Your personalized growth report shows how time and consistency can make your money work harder.</p>' },
      { title: 'Key Assumptions', content: '<ul style="margin: 0; padding-left: 20px; line-height: 2;"><li>Contributions at period-end \u00b7 Constant annual rate \u00b7 ' + params.compoundFreq.toLowerCase() + ' compounding</li><li>No taxes, fees, or withdrawals \u00b7 All values in ' + params.currency + '</li><li>' + params.annualRate + '% is the annual rate before compounding, not APY</li></ul>' },
      { title: 'The Power of Time', content: '<p style="margin: 0 0 16px;">The space between your deposits and your total balance is the interest earned\u2014and the interest on that interest. Time and consistency do the heavy lifting.</p>' },
      { title: 'Your PDF Report', content: '<p style="margin: 0 0 16px;">A detailed PDF version of this report is attached, including the wealth composition pie chart and growth trajectory line chart.</p>' },
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