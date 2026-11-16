import { ChartJSNodeCanvas } from 'chartjs-node-canvas'
import fs from 'fs'

const chartWidth = 600
const chartHeight = 350

const chartCallback = (chartJS: any) => {
  chartJS.defaults.font.family = 'Helvetica'
  chartJS.defaults.font.size = 12
  chartJS.defaults.color = '#374151'
}

const chartJSNodeCanvas = new ChartJSNodeCanvas({
  width: chartWidth,
  height: chartHeight,
  backgroundColour: 'white',
  chartCallback,
})

// Sample charts for each calculator type

// 1. Tax Pie Chart
async function generateTaxPie() {
  const config = {
    type: 'doughnut' as const,
    data: { 
      labels: ['Federal Tax', 'State Tax', 'FICA', 'After-Tax Income'],
      datasets: [{ data: [12500, 4200, 6120, 57180], backgroundColor: ['#3b82f6', '#f59e0b', '#ef4444', '#10b981'], borderWidth: 0 }]
    },
    options: {
      responsive: false, maintainAspectRatio: false,
      plugins: {
        legend: { position: 'right' as const, labels: { font: { size: 12 }, padding: 16, usePointStyle: true, pointStyle: 'circle' } },
        title: { display: true, text: 'Tax Allocation', font: { size: 16, weight: 'bold' as const, family: 'Helvetica' }, color: '#081d2b', padding: { bottom: 20 } },
        tooltip: { backgroundColor: '#081d2b', titleFont: { size: 13 }, bodyFont: { size: 12 }, padding: 12 },
      },
      cutout: '60%',
    },
  }
  return chartJSNodeCanvas.renderToBuffer(config)
}

// 2. College Savings Bar Chart
async function generateCollegeBar() {
  const config = {
    type: 'bar' as const,
    data: { labels: ['Projected Savings', 'Funding Goal'], datasets: [{ data: [68400, 85000], backgroundColor: ['#10b981', '#3b82f6'], borderRadius: 8, borderSkipped: false }] },
    options: {
      responsive: false, maintainAspectRatio: false, indexAxis: 'y' as const,
      plugins: { legend: { display: false }, title: { display: true, text: 'Savings vs. Education Goal', font: { size: 16, weight: 'bold' as const, family: 'Helvetica' }, color: '#081d2b', padding: { bottom: 20 } }, tooltip: { backgroundColor: '#081d2b', callbacks: { label: (ctx: any) => ` $${ctx.raw.toLocaleString()}` } } },
      scales: { x: { grid: { display: false }, ticks: { font: { size: 11 } } }, y: { grid: { color: '#f3f4f6' }, ticks: { font: { size: 11 } }, title: { display: true, text: 'Amount ($)', font: { size: 11 }, color: '#6b7280' } } },
    },
  }
  return chartJSNodeCanvas.renderToBuffer(config)
}

// 3. Debt Strategy Comparison
async function generateDebtBar() {
  const config = {
    type: 'bar' as const,
    data: { labels: ['Avalanche', 'Snowball'], datasets: [{ data: [34, 41], backgroundColor: ['#10b981', '#3b82f6'], borderRadius: 8, borderSkipped: false }] },
    options: {
      responsive: false, maintainAspectRatio: false, indexAxis: 'y' as const,
      plugins: { legend: { display: false }, title: { display: true, text: 'Months to Debt Freedom', font: { size: 16, weight: 'bold' as const, family: 'Helvetica' }, color: '#081d2b', padding: { bottom: 20 } } },
      scales: { x: { grid: { display: false }, ticks: { font: { size: 11 } } }, y: { grid: { color: '#f3f4f6' }, ticks: { font: { size: 11 } }, title: { display: true, text: 'Months', font: { size: 11 }, color: '#6b7280' } } },
    },
  }
  return chartJSNodeCanvas.renderToBuffer(config)
}

// 4. Retirement Line Chart
async function generateRetirementLine() {
  const labels = Array.from({ length: 26 }, (_, i) => (40 + i).toString())
  const data = labels.map((_, i) => Math.round(120000 * Math.pow(1.05, i) * (i / 25)))
  const config = {
    type: 'line' as const,
    data: { labels, datasets: [{ label: 'Projected Savings', data, borderColor: '#3b82f6', backgroundColor: '#3b82f620', fill: true, tension: 0.3, pointRadius: 4, pointHoverRadius: 6, borderWidth: 3 }] },
    options: {
      responsive: false, maintainAspectRatio: false,
      plugins: { legend: { position: 'top' as const, labels: { font: { size: 12 }, padding: 16, usePointStyle: true } }, title: { display: true, text: 'Retirement Savings Growth', font: { size: 16, weight: 'bold' as const, family: 'Helvetica' }, color: '#081d2b', padding: { bottom: 20 } }, tooltip: { backgroundColor: '#081d2b', callbacks: { label: (ctx: any) => `${ctx.dataset.label}: $${ctx.raw.toLocaleString()}` } } },
      scales: { x: { grid: { color: '#f3f4f6' }, ticks: { font: { size: 11 } } }, y: { grid: { color: '#f3f4f6' }, ticks: { font: { size: 11 }, callback: (val: number) => '$' + val.toLocaleString() }, title: { display: true, text: 'Savings ($)', font: { size: 11 }, color: '#6b7280' } } },
      interaction: { intersect: false, mode: 'index' as const },
    },
  }
  return chartJSNodeCanvas.renderToBuffer(config)
}

// 5. Compound Interest Pie
async function generateCompoundPie() {
  const config = {
    type: 'doughnut' as const,
    data: { labels: ['Total Deposits', 'Interest Earned'], datasets: [{ data: [46000, 18500], backgroundColor: ['#3b82f6', '#c9a963'], borderWidth: 0 }] },
    options: {
      responsive: false, maintainAspectRatio: false,
      plugins: { legend: { position: 'right' as const, labels: { font: { size: 12 }, padding: 16, usePointStyle: true, pointStyle: 'circle' } }, title: { display: true, text: 'What Built Your Wealth', font: { size: 16, weight: 'bold' as const, family: 'Helvetica' }, color: '#081d2b', padding: { bottom: 20 } } },
      cutout: '60%',
    },
  }
  return chartJSNodeCanvas.renderToBuffer(config)
}

// 6. Compound Interest Line (with vs without)
async function generateCompoundLine() {
  const labels = Array.from({ length: 11 }, (_, i) => i.toString())
  const dataWith = [10000, 11200, 12450, 13750, 15100, 16500, 17950, 19450, 21000, 22600, 24250]
  const dataWithout = [10000, 10400, 10816, 11249, 11699, 12167, 12653, 13159, 13685, 14233, 14802]
  const config = {
    type: 'line' as const,
    data: { labels, datasets: [
      { label: 'With Contributions', data: dataWith, borderColor: '#3b82f6', backgroundColor: '#3b82f620', fill: true, tension: 0.3, pointRadius: 4, pointHoverRadius: 6, borderWidth: 3 },
      { label: 'Without Contributions', data: dataWithout, borderColor: '#9ca3af', backgroundColor: '#9ca3af20', fill: true, tension: 0.3, pointRadius: 4, pointHoverRadius: 6, borderWidth: 3 },
    ]},
    options: {
      responsive: false, maintainAspectRatio: false,
      plugins: { legend: { position: 'top' as const, labels: { font: { size: 12 }, padding: 16, usePointStyle: true } }, title: { display: true, text: 'Compound Growth Over Time', font: { size: 16, weight: 'bold' as const, family: 'Helvetica' }, color: '#081d2b', padding: { bottom: 20 } }, tooltip: { backgroundColor: '#081d2b', callbacks: { label: (ctx: any) => `${ctx.dataset.label}: $${ctx.raw.toLocaleString()}` } } },
      scales: { x: { grid: { color: '#f3f4f6' }, ticks: { font: { size: 11 } } }, y: { grid: { color: '#f3f4f6' }, ticks: { font: { size: 11 }, callback: (val: number) => '$' + val.toLocaleString() }, title: { display: true, text: 'Balance ($)', font: { size: 11 }, color: '#6b7280' } } },
      interaction: { intersect: false, mode: 'index' as const },
    },
  }
  return chartJSNodeCanvas.renderToBuffer(config)
}

// Generate all and save
async function main() {
  const charts = [
    { name: 'tax-pie', buffer: await generateTaxPie() },
    { name: 'college-bar', buffer: await generateCollegeBar() },
    { name: 'debt-bar', buffer: await generateDebtBar() },
    { name: 'retirement-line', buffer: await generateRetirementLine() },
    { name: 'compound-pie', buffer: await generateCompoundPie() },
    { name: 'compound-line', buffer: await generateCompoundLine() },
  ]
  
  for (const chart of charts) {
    fs.writeFileSync(`./sample-${chart.name}.png`, chart.buffer)
    console.log(`Saved sample-${chart.name}.png (${chart.buffer.length} bytes)`)
  }
}

main().catch(console.error)