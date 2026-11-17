/* Netlify Function: send financial tool report with PDF attachment.
   Generates a designed PDF report (vector charts drawn with pdf-lib, no
   native dependencies) and emails it via Namecheap hosting SMTP. */

import type { Request } from '@netlify/functions'
import nodemailer from 'nodemailer'
import { PDFDocument, rgb, StandardFonts, PDFPage } from 'pdf-lib'

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

// ---------- Brand ----------
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
const CHART_PURPLE = '#8b5cf6'

const NAVY_RGB = rgb(0.031, 0.114, 0.169)
const GOLD_RGB = rgb(0.788, 0.663, 0.388)
const CREAM_RGB = rgb(0.941, 0.929, 0.902)
const TEXT_RGB = rgb(0.16, 0.19, 0.23)
const MUTED_RGB = rgb(0.42, 0.45, 0.5)
const GRID_RGB = rgb(0.9, 0.91, 0.93)
const WHITE_RGB = rgb(1, 1, 1)

function hexRgb(hex: string) {
  const h = hex.replace('#', '')
  const full = h.length === 3 ? h.split('').map(c => c + c).join('') : h
  const n = parseInt(full, 16)
  if (!Number.isFinite(n)) return MUTED_RGB
  return rgb(((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255)
}

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

const fmt = (n: number) => '$' + Math.round(n).toLocaleString('en-US')

/** Ensure a percentage string carries exactly one trailing %. */
function pctStr(value: string | undefined, fallback: string): string {
  const s = String(value ?? '').trim()
  if (!s) return fallback
  return s.endsWith('%') ? s : s + '%'
}

/** Round a value up to a "nice" axis maximum (1 / 2 / 2.5 / 5 / 10 x 10^n). */
function niceCeil(v: number): number {
  if (!Number.isFinite(v) || v <= 0) return 1
  const pow = Math.pow(10, Math.floor(Math.log10(v)))
  const n = v / pow
  const nice = n <= 1 ? 1 : n <= 2 ? 2 : n <= 2.5 ? 2.5 : n <= 5 ? 5 : 10
  return nice * pow
}

function axisLabel(v: number): string {
  if (Math.abs(v) >= 1000) return '$' + Math.round(v / 1000) + 'k'
  return '$' + Math.round(v)
}

/**
 * pdf-lib's drawSvgPath uses SVG coordinates (y grows downward) and applies its
 * own flip, so convert our page-space (y up) path to SVG space before drawing.
 */
function drawPath(page: PDFPage, parts: string[], color: any, opacity?: number) {
  const svg = parts.map(p => {
    if (p === 'Z') return 'Z'
    const sp = p.split(' ')
    return sp[0] + ' ' + sp[1] + ' ' + (PAGE_H - Number(sp[2])).toFixed(2)
  }).join(' ')
  page.drawSvgPath(svg, { x: 0, y: PAGE_H, color, opacity })
}

// ---------- Page / layout helpers ----------
const PAGE_W = 612
const PAGE_H = 792
const MARGIN = 48
const CONTENT_W = PAGE_W - MARGIN * 2

function ensureSpace(pdfDoc: PDFDocument, page: PDFPage, font: any, y: number, needed: number): { page: PDFPage; y: number } {
  if (y - needed < 70) {
    const p = pdfDoc.addPage([PAGE_W, PAGE_H])
    drawFooterStrip(p, font)
    return { page: p, y: PAGE_H - 70 }
  }
  return { page, y }
}

function drawHeader(page: PDFPage, font: any, fontBold: any, title: string, reference: string) {
  // Navy header band
  page.drawRectangle({ x: 0, y: PAGE_H - 86, width: PAGE_W, height: 86, color: NAVY_RGB })
  // Gold accent strip
  page.drawRectangle({ x: 0, y: PAGE_H - 90, width: PAGE_W, height: 4, color: GOLD_RGB })
  page.drawText('KSEFinServe', { x: MARGIN, y: PAGE_H - 46, size: 24, font: fontBold, color: WHITE_RGB })
  page.drawText('Clarity  \u00b7  Growth  \u00b7  Impact', { x: MARGIN, y: PAGE_H - 66, size: 10, font, color: GOLD_RGB })
  // Reference badge on the right
  const refText = 'REF ' + reference
  const refW = font.widthOfTextAtSize(refText, 9)
  page.drawText(refText, { x: PAGE_W - MARGIN - refW, y: PAGE_H - 46, size: 9, font, color: WHITE_RGB })

  // Title block
  page.drawText(title, { x: MARGIN, y: PAGE_H - 126, size: 21, font: fontBold, color: NAVY_RGB })
  page.drawLine({ start: { x: MARGIN, y: PAGE_H - 136 }, end: { x: MARGIN + 96, y: PAGE_H - 136 }, thickness: 3, color: GOLD_RGB })
  return PAGE_H - 160
}

function drawFooterStrip(page: PDFPage, font: any) {
  page.drawRectangle({ x: 0, y: 0, width: PAGE_W, height: 26, color: NAVY_RGB })
  page.drawText('Generated by KSEFinServe  |  Clarity \u00b7 Growth \u00b7 Impact', {
    x: MARGIN, y: 9, size: 8, font, color: WHITE_RGB,
  })
}

function sectionHeader(page: PDFPage, fontBold: any, text: string, x: number, y: number): number {
  page.drawText(text, { x, y, size: 14, font: fontBold, color: NAVY_RGB })
  page.drawLine({ start: { x, y: y - 6 }, end: { x: x + 68, y: y - 6 }, thickness: 2.5, color: GOLD_RGB })
  return y - 24
}

function kvRow(page: PDFPage, font: any, fontBold: any, label: string, value: string, x: number, y: number): number {
  page.drawText(label, { x, y, size: 10.5, font: fontBold, color: TEXT_RGB })
  page.drawText(value, { x: x + 250, y, size: 10.5, font, color: MUTED_RGB })
  return y - 17
}

/** Two-column key/value grid. Returns new y. */
function kvGrid(page: PDFPage, font: any, fontBold: any, items: Array<[string, string]>, x: number, y: number, columns = 2, valueOffset = 150): number {
  const colW = CONTENT_W / columns
  const rowH = 17
  const rows = Math.ceil(items.length / columns)
  items.forEach((it, i) => {
    const col = i % columns
    const row = Math.floor(i / columns)
    const cx = x + col * colW
    const cy = y - row * rowH
    page.drawText(it[0], { x: cx, y: cy, size: 10.5, font: fontBold, color: TEXT_RGB })
    page.drawText(it[1], { x: cx + valueOffset, y: cy, size: 10.5, font, color: MUTED_RGB })
  })
  return y - rows * rowH - 6
}

function noteRow(page: PDFPage, font: any, text: string, x: number, y: number): number {
  page.drawText('\u2022  ' + text, { x: x + 8, y, size: 9.5, font, color: MUTED_RGB })
  return y - 14
}

/** Highlighted key-figure box. Returns new y (just below the box). */
function keyBox(page: PDFPage, font: any, fontBold: any, items: Array<{ label: string; value: string }>, x: number, y: number, columns = 2): number {
  const boxW = CONTENT_W
  const colW = boxW / columns
  const padX = 16
  const padTop = 16
  const padBottom = 20
  const rowH = 34
  const rows = Math.ceil(items.length / columns)
  const boxH = padTop + rows * rowH + padBottom
  const bottom = y - boxH

  page.drawRectangle({ x, y: bottom, width: boxW, height: boxH, color: CREAM_RGB })
  page.drawRectangle({ x, y: bottom, width: 3, height: boxH, color: GOLD_RGB })

  items.forEach((item, i) => {
    const col = i % columns
    const row = Math.floor(i / columns)
    const cx = x + padX + col * colW
    const rowTop = y - padTop - row * rowH
    page.drawText(item.label.toUpperCase(), { x: cx, y: rowTop - 11, size: 7.5, font: fontBold, color: GOLD_RGB })
    page.drawText(item.value, { x: cx, y: rowTop - 28, size: 12, font: fontBold, color: NAVY_RGB })
  })

  return bottom - 12
}

// ---------- Vector charts ----------

interface Slice { label: string; value: number; color: string }

/** Doughnut chart with legend. Returns new y (bottom of chart). */
function drawDoughnut(page: PDFPage, font: any, fontBold: any, title: string, slices: Slice[], x: number, y: number, w: number): number {
  const total = slices.reduce((s, it) => s + Math.max(0, it.value), 0)
  const top = y - 22
  page.drawText(title, { x, y: top, size: 12, font: fontBold, color: NAVY_RGB })

  const rOuter = 74
  const rInner = 42
  const cx = x + 100
  const cy = top - 120

  if (total > 0) {
    let angle = -Math.PI / 2
    for (const s of slices) {
      const sweep = (Math.max(0, s.value) / total) * Math.PI * 2
      if (sweep > 0) {
        const steps = Math.max(3, Math.ceil(Math.abs(sweep) / (Math.PI / 90)))
        const parts: string[] = []
        for (let i = 0; i <= steps; i++) {
          const a = angle + (sweep * i) / steps
          parts.push((i === 0 ? 'M ' : 'L ') + (cx + rOuter * Math.cos(a)).toFixed(2) + ' ' + (cy + rOuter * Math.sin(a)).toFixed(2))
        }
        for (let i = steps; i >= 0; i--) {
          const a = angle + (sweep * i) / steps
          parts.push('L ' + (cx + rInner * Math.cos(a)).toFixed(2) + ' ' + (cy + rInner * Math.sin(a)).toFixed(2))
        }
        parts.push('Z')
        drawPath(page, parts, hexRgb(s.color))
      }
      angle += sweep
    }
  }

  // Center total
  page.drawText(fmt(total), { x: cx - fontBold.widthOfTextAtSize(fmt(total), 15) / 2, y: cy - 2, size: 15, font: fontBold, color: NAVY_RGB })
  page.drawText('Total', { x: cx - font.widthOfTextAtSize('Total', 8) / 2, y: cy - 15, size: 8, font, color: MUTED_RGB })

  // Legend
  let lx = x + 205
  let ly = cy + 34
  for (const s of slices) {
    page.drawRectangle({ x: lx, y: ly - 8, width: 10, height: 10, color: hexRgb(s.color) })
    page.drawText(s.label, { x: lx + 16, y: ly - 8, size: 9.5, font, color: TEXT_RGB })
    page.drawText(fmt(s.value), { x: lx + 16, y: ly - 19, size: 9, font: fontBold, color: NAVY_RGB })
    ly -= 34
  }

  return cy - rOuter - 26
}

/** Horizontal bar chart. Returns new y. */
function drawHBars(page: PDFPage, font: any, fontBold: any, title: string, items: Slice[], x: number, y: number, w: number, valueLabel = ''): number {
  let cy = y - 22
  page.drawText(title, { x, y: cy, size: 12, font: fontBold, color: NAVY_RGB })
  if (valueLabel) {
    const vw = font.widthOfTextAtSize(valueLabel, 8)
    page.drawText(valueLabel, { x: x + w - vw, y: cy, size: 8, font, color: MUTED_RGB })
  }
  cy -= 16

  const labelW = 150
  const valueW = 78
  const barMaxW = w - labelW - valueW - 12
  const maxVal = Math.max(...items.map(i => Math.abs(i.value)), 1)

  for (const it of items) {
    const barH = 20
    const barW = Math.max(2, (Math.abs(it.value) / maxVal) * barMaxW)
    const by = cy - barH
    page.drawText(it.label, { x, y: by + 5, size: 9.5, font, color: TEXT_RGB })
    // track
    page.drawRectangle({ x: x + labelW, y: by, width: barMaxW, height: barH, color: GRID_RGB })
    // bar
    page.drawRectangle({ x: x + labelW, y: by, width: barW, height: barH, color: hexRgb(it.color) })
    const label = fmt(it.value)
    const lw = fontBold.widthOfTextAtSize(label, 9.5)
    if (x + labelW + barW + 8 + lw > x + w) {
      page.drawText(label, { x: x + labelW + barW - lw - 8, y: by + 5, size: 9.5, font: fontBold, color: WHITE_RGB })
    } else {
      page.drawText(label, { x: x + labelW + barW + 8, y: by + 5, size: 9.5, font: fontBold, color: NAVY_RGB })
    }
    cy -= barH + 12
  }
  return cy - 6
}

/** Line chart with gridlines + legend. Returns new y. */
function drawLineChart(page: PDFPage, font: any, fontBold: any, title: string, xLabels: string[], series: Array<{ label: string; color: string; values: number[] }>, x: number, y: number, w: number, h = 150): number {
  let cy = y - 22
  page.drawText(title, { x, y: cy, size: 12, font: fontBold, color: NAVY_RGB })
  cy -= 14

  const plotX = x + 46
  const plotY = cy - h
  const plotW = w - 46 - 10
  const plotH = h - 34

  const all = series.flatMap(s => s.values)
  const rawMax = Math.max(...all, 1)
  const maxV = niceCeil(rawMax)
  const minV = 0
  const span = maxV - minV || 1

  // gridlines + y labels
  for (let i = 0; i <= 4; i++) {
    const gy = plotY + (plotH * i) / 4
    page.drawLine({ start: { x: plotX, y: gy }, end: { x: plotX + plotW, y: gy }, thickness: 0.6, color: GRID_RGB })
    const val = minV + (span * i) / 4
    const lbl = axisLabel(val)
    page.drawText(lbl, { x: plotX - 6 - font.widthOfTextAtSize(lbl, 7.5), y: gy - 2.5, size: 7.5, font, color: MUTED_RGB })
  }
  // axes
  page.drawLine({ start: { x: plotX, y: plotY }, end: { x: plotX, y: plotY + plotH }, thickness: 1, color: MUTED_RGB })
  page.drawLine({ start: { x: plotX, y: plotY }, end: { x: plotX + plotW, y: plotY }, thickness: 1, color: MUTED_RGB })

  // x labels (thin out if many)
  const step = Math.max(1, Math.ceil(xLabels.length / 8))
  xLabels.forEach((lbl, i) => {
    if (i % step !== 0 && i !== xLabels.length - 1) return
    const lx = plotX + (plotW * i) / Math.max(1, xLabels.length - 1)
    page.drawText(lbl, { x: lx - font.widthOfTextAtSize(lbl, 7) / 2, y: plotY - 12, size: 7, font, color: MUTED_RGB })
  })

  // series
  for (const s of series) {
    const pts = s.values.map((v, i) => ({
      x: plotX + (plotW * i) / Math.max(1, s.values.length - 1),
      y: plotY + ((v - minV) / span) * plotH,
    }))
    if (pts.length > 1) {
      const area = pts.map((p, i) => (i === 0 ? 'M ' : 'L ') + p.x.toFixed(2) + ' ' + p.y.toFixed(2))
      area.push('L ' + pts[pts.length - 1].x.toFixed(2) + ' ' + plotY.toFixed(2))
      area.push('L ' + pts[0].x.toFixed(2) + ' ' + plotY.toFixed(2))
      area.push('Z')
      drawPath(page, area, hexRgb(s.color), 0.12)
      for (let i = 1; i < pts.length; i++) {
        page.drawLine({ start: pts[i - 1], end: pts[i], thickness: 2, color: hexRgb(s.color) })
      }
    }
  }

  // legend
  let lxc = x
  const legendY = plotY - 26
  for (const s of series) {
    page.drawRectangle({ x: lxc, y: legendY, width: 10, height: 3, color: hexRgb(s.color) })
    page.drawText(s.label, { x: lxc + 14, y: legendY - 3, size: 8.5, font, color: TEXT_RGB })
    lxc += 14 + font.widthOfTextAtSize(s.label, 8.5) + 18
  }

  return plotY - 34
}

// ---------- Report generators ----------

export async function generateTaxReportPDF(data: ReportPayload['data'], currency: 'USD' | 'CAD', reference: string): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create()
  const page0 = pdfDoc.addPage([PAGE_W, PAGE_H])
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
  drawFooterStrip(page0, font)

  let y = drawHeader(page0, font, fontBold, 'Tax Clarity Report', reference)

  y = sectionHeader(page0, fontBold, 'Your Inputs', MARGIN, y)
  const income = parseMoneyStr(data.income as string) || 80000
  const state = data.state as string || 'California'
  const taxYear = data.taxYear as string || '2025'
  y = kvRow(page0, font, fontBold, 'Annual Employment Income', money(income, currency), MARGIN, y)
  y = kvRow(page0, font, fontBold, 'State', state, MARGIN, y)
  y = kvRow(page0, font, fontBold, 'Tax Year', taxYear, MARGIN, y)
  y -= 6

  const federalTax = parseMoneyStr(data.federalTax as string) || 0
  const stateTax = parseMoneyStr(data.stateTax as string) || 0
  const ficaTax = parseMoneyStr(data.ficaTax as string) || 0
  const totalTax = parseMoneyStr(data.totalTax as string) || 0
  const afterTaxIncome = parseMoneyStr(data.afterTaxIncome as string) || 0

  y = sectionHeader(page0, fontBold, 'Estimated Tax Breakdown', MARGIN, y)
  y = keyBox(page0, font, fontBold, [
    { label: 'Federal Income Tax', value: money(federalTax, currency) },
    { label: 'State Income Tax', value: money(stateTax, currency) },
    { label: 'FICA (Social Security + Medicare)', value: money(ficaTax, currency) },
    { label: 'Total Estimated Tax', value: money(totalTax, currency) },
    { label: 'After-Tax Income', value: money(afterTaxIncome, currency) },
    { label: 'Average Tax Rate', value: String(data.avgRate || '') },
  ], MARGIN, y, 2)
  y -= 8

  const spaced = ensureSpace(pdfDoc, page0, font, y, 220)
  const page = spaced.page
  if (page !== page0) y = spaced.y
  y = drawDoughnut(page, font, fontBold, 'Tax Allocation', [
    { label: 'Federal Tax', value: federalTax, color: CHART_BLUE },
    { label: 'State Tax', value: stateTax, color: CHART_ORANGE },
    { label: 'FICA', value: ficaTax, color: CHART_RED },
    { label: 'After-Tax Income', value: afterTaxIncome, color: CHART_GREEN },
  ], MARGIN, y, CONTENT_W)
  y -= 26

  y = sectionHeader(page, fontBold, 'Important Notes', MARGIN, y)
  for (const note of [
    'Illustrative estimate based on simplified 2025 tax brackets for single filers.',
    'Excludes CPP/QPP, EI, payroll contributions, credits, and individual circumstances.',
    'Not personalized tax advice - consult a qualified tax professional for filing decisions.',
    'Tax brackets apply progressively; your marginal rate applies only to your next dollar of income.',
  ]) {
    y = noteRow(page, font, note, MARGIN, y)
  }

  return pdfDoc.save()
}

export async function generateCollegeReportPDF(data: ReportPayload['data'], currency: 'USD' | 'CAD', reference: string): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create()
  const page0 = pdfDoc.addPage([PAGE_W, PAGE_H])
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
  drawFooterStrip(page0, font)

  let y = drawHeader(page0, font, fontBold, 'Education Savings Plan', reference)

  const childAge = data.childAge as string || '6'
  const startAge = data.startAge as string || '18'
  const yearsToCollege = Number(data.yearsToCollege as string) || 12
  const country = data.country as string || 'United States'
  const state = data.state as string || 'California'
  const alreadySaved = parseMoneyStr(data.alreadySaved as string) || 12000
  const monthlyContribution = parseMoneyStr(data.monthlyContribution as string) || 250
  const scenario = data.scenario as string || 'Moderate'
  const annualReturn = data.annualReturn as string || '5'

  y = sectionHeader(page0, fontBold, 'Your Inputs', MARGIN, y)
  y = kvGrid(page0, font, fontBold, [
    ["Child's Current Age", childAge + ' years'],
    ['Education Start Age', startAge + ' years'],
    ['Years Until College', yearsToCollege + ' years'],
    ['Country', country],
    ['State/Province', state],
    ['Already Saved', money(alreadySaved, currency)],
    ['Monthly Contribution', money(monthlyContribution, currency)],
    ['Investment Scenario', scenario],
    ['Assumed Annual Return', pctStr(annualReturn, '5%')],
  ], MARGIN, y)

  const projectedSavings = parseMoneyStr(data.projectedSavings as string) || 0
  const fundingGoal = parseMoneyStr(data.fundingGoal as string) || 0
  const fundingGap = parseMoneyStr(data.fundingGap as string) || 0
  const contributionToCloseGap = parseMoneyStr(data.contributionToCloseGap as string) || 0
  const percentFunded = data.percentFunded as string || ''

  y = sectionHeader(page0, fontBold, 'Projections', MARGIN, y)
  y = keyBox(page0, font, fontBold, [
    { label: 'Projected Savings at Age ' + startAge, value: money(projectedSavings, currency) },
    { label: 'Funding Goal (4 years)', value: money(fundingGoal, currency) },
    { label: 'Estimated Funding Gap', value: money(fundingGap, currency) },
    { label: 'Contribution to Close Gap', value: money(contributionToCloseGap, currency) + '/mo' },
    { label: 'Percentage of Goal Funded', value: percentFunded },
  ], MARGIN, y, 2)
  y -= 8

  const spaced = ensureSpace(pdfDoc, page0, font, y, 200)
  const page = spaced.page
  if (page !== page0) y = spaced.y
  y = drawHBars(page, font, fontBold, 'Savings vs. Education Goal', [
    { label: 'Projected Savings', value: projectedSavings, color: CHART_GREEN },
    { label: 'Funding Goal', value: fundingGoal, color: CHART_BLUE },
  ], MARGIN, y, CONTENT_W, 'Amount')
  y -= 26

  y = sectionHeader(page, fontBold, 'Key Assumptions', MARGIN, y)
  for (const note of [
    '4 years of education at $18,000/year (today\'s dollars), rising 3% annually.',
    'Contributions made monthly at period-end; returns compound monthly.',
    'Covers 100% of costs; no grants or other funding included.',
    'Household income $100k-$150k assumed for context.',
    (country === 'Canada' ? 'Canadian' : 'US') + ' scenario in ' + currency + '.',
  ]) {
    y = noteRow(page, font, note, MARGIN, y)
  }

  return pdfDoc.save()
}

export async function generateDebtReportPDF(data: ReportPayload['data'], currency: 'USD' | 'CAD', reference: string): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create()
  const page0 = pdfDoc.addPage([PAGE_W, PAGE_H])
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
  drawFooterStrip(page0, font)

  let y = drawHeader(page0, font, fontBold, 'Payoff Blueprint', reference)

  const strategy = data.strategy as string || 'Avalanche'
  const extraPayment = parseMoneyStr(data.extraPayment as string) || 0
  const otherStrategy = data.otherStrategy as string || 'Snowball'

  const debts = data.debts as Array<{ title: string; balance: string; apr: string; payment: string }> || [
    { title: 'Credit card', balance: '$8,000', apr: '19.99', payment: '$240' },
    { title: 'Personal loan', balance: '$4,000', apr: '6.99', payment: '$120' },
  ]

  y = sectionHeader(page0, fontBold, 'Your Debts', MARGIN, y)
  // table header
  page0.drawRectangle({ x: MARGIN, y: y - 16, width: CONTENT_W, height: 18, color: NAVY_RGB })
  page0.drawText('Debt', { x: MARGIN + 10, y: y - 11, size: 9, font: fontBold, color: WHITE_RGB })
  page0.drawText('Balance', { x: MARGIN + 210, y: y - 11, size: 9, font: fontBold, color: WHITE_RGB })
  page0.drawText('APR', { x: MARGIN + 320, y: y - 11, size: 9, font: fontBold, color: WHITE_RGB })
  page0.drawText('Min Payment', { x: MARGIN + 400, y: y - 11, size: 9, font: fontBold, color: WHITE_RGB })
  y -= 34
  for (const d of debts) {
    page0.drawText(d.title, { x: MARGIN + 10, y, size: 10, font, color: TEXT_RGB })
    page0.drawText(money(parseMoneyStr(d.balance), currency), { x: MARGIN + 210, y, size: 10, font, color: TEXT_RGB })
    page0.drawText(d.apr + '%', { x: MARGIN + 320, y, size: 10, font, color: TEXT_RGB })
    page0.drawText(money(parseMoneyStr(d.payment), currency), { x: MARGIN + 400, y, size: 10, font, color: TEXT_RGB })
    y -= 17
  }
  y -= 8

  const debtFreeMonths = Number(data.debtFreeMonths as string) || 0
  const totalInterest = parseMoneyStr(data.totalInterest as string) || 0
  const otherStrategyMonths = Number(data.otherStrategyMonths as string) || 0
  const otherStrategyInterest = parseMoneyStr(data.otherStrategyInterest as string) || 0
  const interestSavings = parseMoneyStr(data.interestSavings as string) || 0
  const timeSaved = Number(data.timeSaved as string) || 0
  const totalMonthlyPayment = parseMoneyStr(data.totalMonthlyPayment as string) || 0

  y = sectionHeader(page0, fontBold, 'Strategy Comparison', MARGIN, y)
  y = keyBox(page0, font, fontBold, [
    { label: 'Selected Strategy', value: strategy },
    { label: 'Total Monthly Payment', value: money(totalMonthlyPayment, currency) },
    { label: strategy + ' Timeline', value: debtFreeMonths + ' months' },
    { label: strategy + ' Total Interest', value: money(totalInterest, currency) },
    { label: otherStrategy + ' Timeline', value: otherStrategyMonths + ' months' },
    { label: otherStrategy + ' Total Interest', value: money(otherStrategyInterest, currency) },
    { label: 'Interest Saved', value: money(interestSavings, currency) },
    { label: 'Time Saved', value: timeSaved + ' months' },
  ], MARGIN, y, 2)
  y -= 8

  const spaced = ensureSpace(pdfDoc, page0, font, y, 240)
  const page = spaced.page
  if (page !== page0) y = spaced.y
  y = drawHBars(page, font, fontBold, 'Months to Debt Freedom', [
    { label: strategy, value: debtFreeMonths, color: CHART_GREEN },
    { label: otherStrategy, value: otherStrategyMonths, color: CHART_BLUE },
  ], MARGIN, y, CONTENT_W, 'Months')
  y -= 18
  y = drawHBars(page, font, fontBold, 'Total Interest Paid', [
    { label: strategy, value: totalInterest, color: CHART_GREEN },
    { label: otherStrategy, value: otherStrategyInterest, color: CHART_RED },
  ], MARGIN, y, CONTENT_W, 'Interest')
  y -= 24

  y = sectionHeader(page, fontBold, 'Important Notes', MARGIN, y)
  for (const note of [
    'Illustrative, not personalized advice. Fixed APRs assumed; interest added monthly.',
    'Fixed minimums and fixed extra payment roll over as debts are cleared.',
    'Actual payoff may vary with rate changes, fees, or additional borrowing.',
  ]) {
    y = noteRow(page, font, note, MARGIN, y)
  }

  return pdfDoc.save()
}

export async function generateRetirementReportPDF(data: ReportPayload['data'], currency: 'USD' | 'CAD', reference: string): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create()
  const page0 = pdfDoc.addPage([PAGE_W, PAGE_H])
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
  drawFooterStrip(page0, font)

  let y = drawHeader(page0, font, fontBold, 'Retirement Roadmap', reference)

  const ageToday = data.ageToday as string || '40'
  const retireAge = data.retireAge as string || '65'
  const yearsToRetirement = Number(data.yearsToRetirement as string) || 25
  const monthlyContribution = parseMoneyStr(data.monthlyContribution as string) || 600
  const scenario = data.scenario as string || 'Moderate'
  const growthReturn = data.growthReturn as string || '5'

  y = sectionHeader(page0, fontBold, 'Your Inputs', MARGIN, y)
  y = kvGrid(page0, font, fontBold, [
    ['Age Today', ageToday + ' years'],
    ['Retirement Age', retireAge + ' years'],
    ['Years to Retirement', yearsToRetirement + ' years'],
    ['Monthly Contribution', money(monthlyContribution, currency)],
    ['Investment Scenario', scenario],
    ['Assumed Growth Return', pctStr(growthReturn, '5%')],
  ], MARGIN, y)

  const projectedSavings = parseMoneyStr(data.projectedSavings as string) || 0
  const estimatedAnnualIncome = parseMoneyStr(data.estimatedAnnualIncome as string) || 0
  const annualIncomeGoal = parseMoneyStr(data.annualIncomeGoal as string) || 0
  const fundingGap = parseMoneyStr(data.fundingGap as string) || 0

  y = sectionHeader(page0, fontBold, 'Projections', MARGIN, y)
  y = keyBox(page0, font, fontBold, [
    { label: 'Projected Savings at Age ' + retireAge, value: money(projectedSavings, currency) },
    { label: 'Estimated Annual Income', value: money(estimatedAnnualIncome, currency) },
    { label: 'Annual Income Goal', value: money(annualIncomeGoal, currency) },
    { label: 'Annual Funding Gap', value: money(fundingGap, currency) },
  ], MARGIN, y, 2)
  y -= 8

  // Growth curve
  const rate = parseFloat(growthReturn) / 100
  const n = Math.min(Math.max(yearsToRetirement, 1), 40)
  const values: number[] = []
  for (let i = 0; i <= n; i++) {
    const t = i
    const fv = 120000 * Math.pow(1 + rate, t) + monthlyContribution * 12 * ((Math.pow(1 + rate, t) - 1) / (rate || 1))
    values.push(Math.round(fv))
  }
  // Anchor the curve so its final point matches the headline projection.
  if (values[n] > 0 && projectedSavings > 0) {
    const k = projectedSavings / values[n]
    for (let i = 0; i <= n; i++) values[i] = Math.round(values[i] * k)
  }
  const xLabels = values.map((_, i) => String(parseInt(ageToday) + i))

  const spaced = ensureSpace(pdfDoc, page0, font, y, 230)
  const page = spaced.page
  if (page !== page0) y = spaced.y
  y = drawLineChart(page, font, fontBold, 'Retirement Savings Growth', xLabels,
    [{ label: 'Projected Savings', color: CHART_BLUE, values }], MARGIN, y, CONTENT_W, 160)
  y -= 20
  y = drawHBars(page, font, fontBold, 'Retirement Income vs. Goal', [
    { label: 'Estimated Income', value: estimatedAnnualIncome, color: CHART_GREEN },
    { label: 'Income Goal', value: annualIncomeGoal, color: CHART_BLUE },
  ], MARGIN, y, CONTENT_W, 'Annual Income')
  y -= 24

  y = sectionHeader(page, fontBold, 'Key Assumptions', MARGIN, y)
  for (const note of [
    'Starting assets: RRSP $80,000 \u00b7 TFSA $30,000 \u00b7 Other $10,000.',
    'CPP/OAS: $1,500/month at age 65 (approx. $18,000/year).',
    'Plan through age 95 \u00b7 Inflation 2% \u00b7 Growth return ' + pctStr(growthReturn, '5%') + '.',
    'Retirement draw: 4% initial annual withdrawal, rising 2% yearly.',
    'All amounts in future nominal ' + currency + '.',
  ]) {
    y = noteRow(page, font, note, MARGIN, y)
  }

  return pdfDoc.save()
}

export async function generateCompoundReportPDF(data: ReportPayload['data'], currency: 'USD' | 'CAD', reference: string): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create()
  const page0 = pdfDoc.addPage([PAGE_W, PAGE_H])
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
  drawFooterStrip(page0, font)

  let y = drawHeader(page0, font, fontBold, 'Growth Report', reference)

  const initialDeposit = parseMoneyStr(data.initialDeposit as string) || 10000
  const years = Number(data.years as string) || 10
  const annualRate = data.annualRate as string || '4'
  const compoundFreq = data.compoundFreq as string || 'Daily (365 times / year)'
  const contribution = parseMoneyStr(data.contribution as string) || 100
  const contributionFreq = data.contributionFreq as string || 'Monthly'

  y = sectionHeader(page0, fontBold, 'Your Inputs', MARGIN, y)
  y = kvGrid(page0, font, fontBold, [
    ['Initial Deposit', money(initialDeposit, currency)],
    ['Years of Growth', years + ' years'],
    ['Estimated Annual Rate', pctStr(annualRate, '4%')],
    ['Compounding Frequency', compoundFreq],
    ['Recurring Contribution', money(contribution, currency)],
    ['Contribution Frequency', contributionFreq],
  ], MARGIN, y)

  const totalBalance = parseMoneyStr(data.totalBalance as string) || 0
  const totalDeposits = parseMoneyStr(data.totalDeposits as string) || 0
  const interestEarned = parseMoneyStr(data.interestEarned as string) || 0
  const interestPct = data.interestPct as string || ''
  const withoutContributions = parseMoneyStr(data.withoutContributions as string) || 0
  const apy = data.apy as string || ''

  y = sectionHeader(page0, fontBold, 'Projections', MARGIN, y)
  y = keyBox(page0, font, fontBold, [
    { label: 'Total Balance After ' + years + ' Years', value: money(totalBalance, currency, 2) },
    { label: 'Total Deposits', value: money(totalDeposits, currency) },
    { label: 'Interest Earned', value: money(interestEarned, currency, 2) },
    { label: 'Interest as % of Balance', value: interestPct },
    { label: 'Without Contributions', value: money(withoutContributions, currency, 2) },
    { label: 'Effective Annual Yield (APY)', value: apy },
  ], MARGIN, y, 2)
  y -= 8

  const spaced = ensureSpace(pdfDoc, page0, font, y, 220)
  const page = spaced.page
  if (page !== page0) y = spaced.y
  y = drawDoughnut(page, font, fontBold, 'What Built Your Wealth', [
    { label: 'Total Deposits', value: totalDeposits, color: CHART_BLUE },
    { label: 'Interest Earned', value: interestEarned, color: CHART_GOLD },
  ], MARGIN, y, CONTENT_W)
  y -= 22

  const rate = parseFloat(annualRate) / 100
  const freq = compoundFreq.toLowerCase().includes('daily') ? 365 : compoundFreq.toLowerCase().includes('monthly') ? 12 : 1
  const periodicRate = rate / freq
  const withVals: number[] = []
  const withoutVals: number[] = []
  for (let i = 0; i <= years; i++) {
    const periods = i * freq
    const factor = Math.pow(1 + periodicRate, periods)
    withVals.push(Math.round(initialDeposit * factor + (contribution * (factor - 1)) / (periodicRate || 1)))
    withoutVals.push(Math.round(initialDeposit * factor))
  }
  // Anchor both curves to the headline figures.
  if (withVals[years] > 0 && totalBalance > 0) {
    const k = totalBalance / withVals[years]
    for (let i = 0; i <= years; i++) withVals[i] = Math.round(withVals[i] * k)
  }
  if (withoutVals[years] > 0 && withoutContributions > 0) {
    const k = withoutContributions / withoutVals[years]
    for (let i = 0; i <= years; i++) withoutVals[i] = Math.round(withoutVals[i] * k)
  }

  const spaced2 = ensureSpace(pdfDoc, page, font, y, 220)
  const page2 = spaced2.page
  if (page2 !== page) y = spaced2.y
  y = drawLineChart(page2, font, fontBold, 'Compound Growth Over Time',
    withVals.map((_, i) => 'Y' + i),
    [
      { label: 'With Contributions', color: CHART_BLUE, values: withVals },
      { label: 'Without Contributions', color: CHART_GRAY, values: withoutVals },
    ], MARGIN, y, CONTENT_W, 160)
  y -= 20
  y = drawHBars(page2, font, fontBold, 'Impact of Regular Contributions', [
    { label: 'With Contributions', value: totalBalance, color: CHART_GREEN },
    { label: 'Without Contributions', value: withoutContributions, color: CHART_GRAY },
  ], MARGIN, y, CONTENT_W, 'Final Balance')
  y -= 24

  y = sectionHeader(page2, fontBold, 'Key Assumptions', MARGIN, y)
  for (const note of [
    'Contributions at period-end \u00b7 Constant annual rate \u00b7 ' + compoundFreq.toLowerCase() + ' compounding.',
    'No taxes, fees, or withdrawals \u00b7 All values in ' + currency + '.',
    annualRate + '% is the annual rate before compounding, not APY.',
    compoundFreq.toLowerCase() + ' compounding gives an effective annual yield of about ' + apy + '.',
  ]) {
    y = noteRow(page2, font, note, MARGIN, y)
  }

  return pdfDoc.save()
}

// ---------- Handler ----------

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

    console.log('Sending report email to:', email, 'subject:', subject, 'pdf bytes:', pdfBytes.length)

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

// ---------- Email templates ----------

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
      { title: 'Your PDF Report', content: '<p style="margin: 0 0 16px;">A designed PDF version of this report is attached, including the tax allocation chart and full assumptions.</p>' },
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
      { title: 'Your PDF Report', content: '<p style="margin: 0 0 16px;">A designed PDF version of this plan is attached, including the savings vs. goal chart and full assumptions.</p>' },
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
      { title: 'Your PDF Report', content: '<p style="margin: 0 0 16px;">A designed PDF version of this blueprint is attached, including the strategy comparison charts.</p>' },
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
      { title: 'Your PDF Report', content: '<p style="margin: 0 0 16px;">A designed PDF version of this roadmap is attached, including the savings growth chart and income gap analysis.</p>' },
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
      { title: 'Your PDF Report', content: '<p style="margin: 0 0 16px;">A designed PDF version of this report is attached, including the wealth composition chart and growth trajectory chart.</p>' },
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