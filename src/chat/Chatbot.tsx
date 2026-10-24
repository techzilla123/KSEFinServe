import { useEffect, useRef, useState } from "react"
import {
  activePageLabel,
  askGemini,
  SUGGESTED_QUESTIONS,
  type ChatMessage,
} from "./chatbotEngine"
import { renderAnswer } from "./chatAnswer"

/**
 * Floating chat widget, modelled on the reference site's concierge.
 *
 * Two independent controls:
 *  - the launcher button, which opens the panel;
 *  - the panel's own close button, which hides the panel only.
 * The launcher carries a separate dismiss control that removes the whole
 * widget until the page is reloaded.
 */
export default function Chatbot({ activePath }: { activePath: string }) {
  const [open, setOpen] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(true)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState("")
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pulse, setPulse] = useState(true)
  const listRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Greet once per session, matching the reference widget's first message.
  useEffect(() => {
    if (messages.length > 0) return
    setMessages([
      {
        id: "intro",
        role: "assistant",
        text: "I'm the KSEFinServe AI guide. I can help you learn about Kayode's background, the services, upcoming events, Insights and the financial calculators, or point you to the right page. What would you like to explore?",
      },
    ])
  }, [messages.length])

  // Keep the transcript scrolled to the newest message.
  useEffect(() => {
    const el = listRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages, busy, open])

  // Focus the field whenever the panel opens.
  useEffect(() => {
    if (open) {
      const t = window.setTimeout(() => inputRef.current?.focus(), 250)
      return () => window.clearTimeout(t)
    }
    return undefined
  }, [open])

  // The launcher calls attention for a few seconds after load, then stops.
  useEffect(() => {
    const t = window.setTimeout(() => setPulse(false), 6000)
    return () => window.clearTimeout(t)
  }, [])

  const send = async (raw: string) => {
    const question = raw.trim()
    if (!question || busy) return

    setError(null)
    const userMessage: ChatMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      text: question,
    }
    const next = [...messages, userMessage]
    setMessages(next)
    setInput("")
    setBusy(true)

    try {
      const answer = await askGemini(question, next, activePageLabel(activePath))
      setMessages([
        ...next,
        {
          id: `a-${Date.now()}`,
          role: "assistant",
          text: answer,
        },
      ])
    } catch (e) {
      setError(e instanceof Error ? e.message : "The guide could not answer that. Please try again.")
    } finally {
      setBusy(false)
    }
  }

  // Remove the whole widget until the page is reloaded.
  const dismissWidget = () => {
    setOpen(false)
    setDismissed(true)
  }

  if (dismissed) return null

  return (
    <>
      {/* Launcher: opens the panel. The small x sits on its own top-right
          corner and hides the whole widget until the page is reloaded. */}
      <div className="chat-launcher-wrap">
        <button
          type="button"
          className={`chat-launcher${pulse ? " chat-launcher--pulse" : ""}`}
          aria-label={open ? "Close chat" : "Open chat"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <svg className="size-[20px]" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M21 12a8 8 0 0 1-8 8H5l-2 2V12a8 8 0 0 1 8-8h2a8 8 0 0 1 8 8z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
          </svg>
          <span className="chat-launcher-label">Chat</span>
          <span className="chat-launcher-dismiss" role="button" aria-label="Hide chat until the page is reloaded" title="Hide chat until the page is reloaded" onClick={(e) => { e.stopPropagation(); dismissWidget() }}>
            <svg className="size-[10px]" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M2 2l12 12M14 2L2 14" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
            </svg>
          </span>
        </button>
      </div>

      {/* Panel */}
      {open && (
        <div className="chat-panel" role="dialog" aria-modal="false" aria-label="KSEFinServe chat">
          <header className="chat-panel-head">
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-semibold text-[#081d2b]">KSEFinServe AI Assistant</p>
              <p className="text-[11px] text-[#66757d]">Website &amp; wealth concierge</p>
            </div>
            <button
              type="button"
              className="chat-icon-btn"
              aria-label="Close chat"
              title="Close chat"
              onClick={() => setOpen(false)}
            >
              <svg className="size-[14px]" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M2 2l12 12M14 2L2 14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </button>
          </header>

          <p className="chat-active-page">
            Active page: <span>{activePageLabel(activePath)}</span>
          </p>

          <div className="chat-transcript" ref={listRef}>
            {messages.map((m) => (
              <div key={m.id} className={`chat-bubble chat-bubble--${m.role}`}>
                <p className="text-[12.5px] leading-[1.6]">{renderAnswer(m.text)}</p>
              </div>
            ))}
            {busy && (
              <div className="chat-bubble chat-bubble--assistant">
                <p className="text-[12.5px] text-[#66757d]">Thinking…</p>
              </div>
            )}
            {error && <p className="px-1 text-[11px] text-[#a2493e]">{error}</p>}
          </div>

          {showSuggestions && (
            <div className="chat-suggestions">
              <div className="flex items-center justify-between gap-2">
                <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#876728]">
                  Suggested questions
                </p>
                <button
                  type="button"
                  className="chat-icon-btn chat-icon-btn--small"
                  aria-label="Hide suggested questions"
                  title="Hide suggested questions"
                  onClick={() => setShowSuggestions(false)}
                >
                  <svg className="size-[12px]" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M2 2l12 12M14 2L2 14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  </svg>
                </button>
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {SUGGESTED_QUESTIONS.map((s) => (
                  <button
                    key={s.label}
                    type="button"
                    className="chat-chip"
                    disabled={busy}
                    onClick={() => send(s.prompt)}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <form
            className="chat-form"
            onSubmit={(e) => {
              e.preventDefault()
              void send(input)
            }}
          >
            <input
              ref={inputRef}
              className="chat-input"
              type="text"
              value={input}
              placeholder="Ask a question about the site…"
              onChange={(e) => setInput(e.target.value)}
              disabled={busy}
            />
            <button type="submit" className="chat-send" aria-label="Send message" disabled={busy || !input.trim()}>
              <svg className="size-[15px]" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M2 8l12-5-4 12-3-5-5-2z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
              </svg>
            </button>
          </form>
        </div>
      )}
    </>
  )
}
