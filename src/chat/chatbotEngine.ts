/* KSEFinServe AI guide.
   Answers questions about the site from a fixed knowledge base, grounded by a
   Gemini call.

   The API key is NOT bundled. Vite inlines any VITE_-prefixed env var into the
   client build, which both leaks the secret and trips GitHub push protection, so
   the key is injected at runtime instead: build.mjs writes a small
   public/config.js from .env before Vite runs. */

/** Runtime-injected configuration (see build.mjs). */
const runtimeConfig = (window as unknown as { __KSE_CONFIG__?: { geminiApiKey?: string } }).__KSE_CONFIG__ ?? {}

const API_KEY = runtimeConfig.geminiApiKey ?? ""

export type ChatMessage = {
  id: string
  role: 'user' | 'assistant'
  text: string
  links?: Array<{ label: string; href: string }>
}

export type SuggestedQuestion = { label: string; prompt: string }

/** Questions offered up front, mirroring the reference site's chips. */
export const SUGGESTED_QUESTIONS: SuggestedQuestion[] = [
  { label: 'Who is Kayode Elepe?', prompt: 'Who is Kayode Elepe?' },
  { label: 'What services do you offer?', prompt: 'What services does KSEFinServe offer?' },
  { label: 'How do I book a session?', prompt: 'How do I book a session?' },
  { label: 'Become an advisor', prompt: 'How do I become an advisor with KSEFinServe?' },
  { label: 'Explore Insights', prompt: 'What insights and articles are available?' },
  { label: 'Try a calculator', prompt: 'What financial calculators are available?' },
]

/** The site map the assistant can navigate people to. */
export const SITE_PAGES: Array<{ path: string; label: string; blurb: string }> = [
  { path: '/', label: 'Home', blurb: 'The landing page and an overview of KSEFinServe.' },
  { path: '/about', label: 'About', blurb: 'Kayode Samson Elepe, his background and the KSEFinServe vision.' },
  { path: '/service', label: 'Services', blurb: 'Wealth strategy, retirement, investment, insurance and estate planning.' },
  { path: '/career', label: 'Careers', blurb: 'The Financial Services Business Development path and how to apply.' },
  { path: '/events', label: 'Events', blurb: 'Upcoming programmes, roundtables and the Summer Fest.' },
  { path: '/insights', label: 'Insights', blurb: 'Articles on investing, planning and building a financial future.' },
  { path: '/book-now', label: 'Book now', blurb: 'Request a session with Kayode.' },
  { path: '/tax-calculator', label: 'Tax Calculator', blurb: 'Estimate a simple tax position.' },
  { path: '/college-savings', label: 'College Savings', blurb: 'Plan for education costs.' },
  { path: '/debt-repayment', label: 'Debt Repayment', blurb: 'See how long debt takes to clear.' },
  { path: '/retirement-planning', label: 'Retirement Planning', blurb: 'Project a retirement nest egg.' },
  { path: '/compound-interest', label: 'Compound Interest', blurb: 'See what compounding does over time.' },
  { path: '/contact', label: 'Contact', blurb: 'Reach the team and find the office.' },
]

/** Everything the assistant is allowed to say about the organisation. */
export const KNOWLEDGE_BASE = `
KSEFinServe is a mission-driven financial services practice led by Kayode Samson Elepe, RR.

ABOUT KAYODE
Kayode Samson Elepe, RR, is the founder of KSEFinServe. His career began in engineering and data science before he moved into financial services. He has helped develop more than 1,000 advisors and built a multi-million-dollar organisation across North America. He works with individuals planning for retirement, growing wealth, or exploring a career in financial services.

SERVICES
KSEFinServe offers wealth strategy and financial planning: retirement planning, investment strategy, insurance and protection, and estate planning. Every engagement starts with the client's goals rather than a product. Sessions are booked through the Book now page.

CAREERS
The Financial Services Business Development path is for purpose-driven professionals who want to build a meaningful business. It includes training, leadership development, mentorship and community. Kayode mentors aspiring advisors directly on leadership, business acumen and client service standards. Applications are submitted through the Careers page and reviewed by the team.

EVENTS
KSEFinServe runs programmes and gatherings, including roundtables, leadership sessions and the KSEFinServe Summer Fest. Events are published on the Events page, where visitors can view details and join an interest list.

INSIGHTS
The Insights page publishes articles on investing, planning and building a financial future. Recent topics include the craft of wealth, the recipe for growth, and practical approaches to long-term planning.

CALCULATORS
The site provides financial calculators: Tax Calculator, College Savings, Debt Repayment, Retirement Planning and Compound Interest. They are tools for illustration, not financial advice.

CONTACT
The office is at 363 N Sam Houston Pkwy E Suite 200, Houston TX 77060. The Contact page has the address, a map and a way to get in touch.

TONE
Answer plainly and helpfully. Keep answers short unless the question needs detail. If the answer is not in this brief, say so and suggest the page that would have it. Never invent prices, returns, guarantees or credentials.
`

/** Build the system prompt for the model. */
function systemPrompt(activePage: string): string {
  const pages = SITE_PAGES.map((p) => `- ${p.label} (${p.path}): ${p.blurb}`).join('\n')
  return `${KNOWLEDGE_BASE}

YOU ARE THE KSEFinServe AI GUIDE
You answer questions about the KSEFinServe website and its services. The visitor is currently on: ${activePage}.

SITE PAGES
${pages}

RULES
- Answer only from the brief above. Do not invent facts, figures, prices or credentials.
- Keep answers to a few sentences unless the visitor asks for detail.
- When a page is the right place to go, name it and give its path.
- Be warm, plain and specific. No marketing filler.
- If you are unsure, say you are unsure and point to the most relevant page.
`
}

/**
 * Models tried in order for the guide.
 *
 * Google's free tier gives each model family its own request pool, so a chain
 * across families multiplies the daily allowance instead of exhausting one
 * limit. The `-lite` variants are first: they are cheaper, faster, and their
 * quota is separate from the full-size models.
 */
const MODELS = [
  'gemini-3.5-flash-lite',
  'gemini-3.1-flash-lite',
  'gemini-flash-lite-latest',
  'gemini-3-flash-preview',
  'gemini-3.5-flash',
  'gemini-flash-latest',
]

/** Call Gemini and return the text of the reply.
    Tries each candidate model in turn: the alias can be temporarily
    overloaded, and a pinned version can be retired for new keys. */
export async function askGemini(
  question: string,
  history: ChatMessage[],
  activePage: string,
): Promise<string> {
  if (!API_KEY) {
    return "The AI guide is not configured on this deployment. Please contact the site owner."
  }

  const contents = [
    ...history.slice(-8).map((m) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.text }],
    })),
    { role: 'user', parts: [{ text: question }] },
  ]

  const instruction = systemPrompt(activePage)
  let lastError = ''

  for (const model of MODELS) {
    try {
      const text = await requestModel(model, contents, instruction)
      if (text) return text
    } catch (e) {
      lastError = e instanceof Error ? e.message : String(e)
    }
  }

  // The API is unavailable (quota, network, bad key). Fall back to the local
  // knowledge base so the widget still answers instead of showing an error.
  const local = answerLocally(question, activePage)
  if (local) return local

  throw new Error(lastError || 'The AI guide could not answer that. Please try again.')
}

/**
 * Answer from the knowledge base when the API cannot be reached.
 * Matches on keywords and returns a short, honest reply.
 */
function answerLocally(question: string, activePage: string): string | null {
  const q = question.toLowerCase()

  const rules: Array<{ match: RegExp; answer: string }> = [
    {
      match: /who is|about kayode|your founder|who.*kayode/,
      answer:
        "Kayode Samson Elepe, RR, founded KSEFinServe. He began his career in engineering and data science before moving into financial services, and has helped develop more than 1,000 advisors across North America. You can read more on the /about page.",
    },
    {
      match: /service|offer|what do you do|help with/,
      answer:
        "KSEFinServe offers wealth strategy and financial planning: retirement planning, investment strategy, insurance and protection, and estate planning. Every engagement starts with your goals rather than a product. See the /service page.",
    },
    {
      match: /book|session|appointment|schedule|calendly|call/,
      answer:
        "You can request a session on the Book now page. It takes a minute to complete and the team will follow up to confirm a time. Go to /book-now.",
    },
    {
      match: /career|advisor|job|work with you|join/,
      answer:
        "The Financial Services Business Development path is for purpose-driven professionals. It includes training, leadership development, mentorship and community. Applications are submitted through the /career page.",
    },
    {
      match: /event|workshop|gathering|summer fest|roundtable/,
      answer:
        "KSEFinServe runs programmes and gatherings, including roundtables, leadership sessions and the annual Summer Fest. The /events page lists what is coming up and lets you join an interest list.",
    },
    {
      match: /insight|article|read|blog|news/,
      answer:
        "The Insights page publishes articles on investing, planning and building a financial future, from the craft of wealth to the recipe for growth. See /insights.",
    },
    {
      match: /calculator|calculate|tax|retirement plan|compound|debt|college/,
      answer:
        "There are five calculators: Tax Calculator, College Savings, Debt Repayment, Retirement Planning and Compound Interest. They are illustration tools, not financial advice. Try /tax-calculator to start.",
    },
    {
      match: /contact|email|phone|address|where|location|reach/,
      answer:
        "The office is at 363 N Sam Houston Pkwy E Suite 200, Houston TX 77060. The /contact page has the address, a map and a form to send a message.",
    },
    {
      match: /price|cost|fee|how much|charge/,
      answer:
        "KSEFinServe does not publish fixed prices. Every engagement starts with a conversation about your goals, so the best next step is to visit /book-now.",
    },
  ]

  const hit = rules.find((r) => r.match.test(q))
  if (hit) return hit.answer

  return `I could not reach the AI service just now, so here is what I can tell you from the site. You are on the ${activePageLabel(activePage)} page. Try /insights for articles, /events for upcoming programmes, or /book-now to request a session.`
}

/** How long one model attempt may take before we move to the next. */
const REQUEST_TIMEOUT_MS = 15000

/** One Gemini request. Rejects once the timeout elapses so a slow model
    cannot stall the chat — the caller falls through to the next model. */
async function requestModel(
  model: string,
  contents: unknown,
  systemInstruction: string,
): Promise<string> {
  const controller = new AbortController()
  const timer = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: systemInstruction }] },
          contents,
          generationConfig: {
            temperature: 0.4,
            maxOutputTokens: 384,
            // Ask for plain text: thinking tokens add latency without adding
            // value for short site questions.
            thinkingConfig: { thinkingBudget: 0 },
          },
        }),
      },
    )

    if (!res.ok) {
      const body = await res.text().catch(() => '')
      // A 429 is a quota limit, not a bug — say so plainly and let the caller
      // move on to the next model instead of surfacing raw JSON.
      if (res.status === 429) {
        throw new Error(`${model} is temporarily out of quota`)
      }
      if (res.status === 404) {
        throw new Error(`${model} is not available on this key`)
      }
      throw new Error(`${model} failed (${res.status}). ${body.slice(0, 120)}`)
    }

    const data = await res.json()
    return data?.candidates?.[0]?.content?.parts
      ?.map((p: { text?: string }) => p.text ?? '')
      .join('')
      .trim() ?? ''
  } finally {
    window.clearTimeout(timer)
  }
}

/** Turn a page path into a human label for the panel header. */
export function activePageLabel(path: string): string {
  const found = SITE_PAGES.find((p) => p.path === path)
  return found ? `${found.label} — KSEFinServe` : 'KSEFinServe'
}

/** Pick a page to link to based on keywords in the answer.
    Only links when the answer actually names a page, so the chip is never
    misleading. */
export function suggestLink(text: string): { label: string; href: string } | undefined {
  const lower = text.toLowerCase()
  // Prefer an explicit "/path" mention, which is what the model tends to emit.
  const pathMatch = SITE_PAGES.find((p) => p.path !== '/' && lower.includes(p.path))
  if (pathMatch) return { label: linkLabel(pathMatch), href: pathMatch.path }

  // Otherwise look for the page label, but only when it appears as a word.
  const labelMatch = SITE_PAGES.find(
    (p) => p.path !== '/' && new RegExp(`\\b${p.label.toLowerCase()}\\b`).test(lower),
  )
  return labelMatch ? { label: linkLabel(labelMatch), href: labelMatch.path } : undefined
}

/** Friendly button text for a page, e.g. "Book a Session" for /book-now. */
export function linkLabel(page: { path: string; label: string }): string {
  if (page.path === '/') return 'Home'
  if (page.path === '/book-now') return 'Book a Session'
  if (page.path === '/contact') return 'Contact'
  if (page.path === '/career') return 'Explore Careers'
  if (page.path === '/events') return 'View Events'
  if (page.path === '/insights') return 'Read Insights'
  return `Go to ${page.label}`
}
