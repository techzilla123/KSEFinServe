import { FormEvent, useEffect, useRef, useState } from "react"
import { submitContactMessage } from "./admin/contactDirectory"

const assets = "/assets"

function ContactDialog({ onClose }: { onClose: () => void }) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "failed">("idle")

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    dialogRef.current?.focus()

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose()
    }
    window.addEventListener("keydown", closeOnEscape)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener("keydown", closeOnEscape)
    }
  }, [onClose])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (status === "sending") return

    const form = event.currentTarget
    const data = new FormData(form)
    const name = String(data.get("name") ?? "")
    const email = String(data.get("email") ?? "")
    const subject = String(data.get("subject") ?? "")
    const message = String(data.get("message") ?? "")

    setStatus("sending")
    const result = await submitContactMessage({ name, email, subject, message })
    if (result.ok) {
      setStatus("sent")
      // Show success modal briefly, then close everything
      setTimeout(() => {
        setStatus("idle")
        onClose()
      }, 2000)
    } else {
      setStatus("failed")
    }
  }

  return (
    <div className="dialog-backdrop" onMouseDown={onClose}>
      <div
        aria-labelledby="contact-dialog-title"
        aria-modal="true"
        className="contact-dialog"
        onMouseDown={(event) => event.stopPropagation()}
        ref={dialogRef}
        role="dialog"
        tabIndex={-1}
      >
        <div className="dialog-heading">
          <p className="dialog-eyebrow">LET'S CONNECT</p>
          <h2 id="contact-dialog-title">Contact Us</h2>
          <p>
            Tell us what's on your mind. Share a little about yourself
            <br className="desktop-break" /> and how we can help you take the
            next step.
          </p>
        </div>

        <button
          aria-label="Close contact form"
          className="dialog-close"
          onClick={onClose}
          type="button"
        >
          <img alt="" height="18" src={`${assets}/09fb2.svg`} width="18" />
        </button>

        <div className="dialog-divider" />

        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="field-row">
            <label className="form-field">
              <span>Name *</span>
              <input
                name="name"
                placeholder="Your full name"
                required
                type="text"
              />
            </label>
            <label className="form-field">
              <span>Email *</span>
              <input
                name="email"
                placeholder="you@example.com"
                required
                type="email"
              />
            </label>
          </div>
          <label className="form-field">
            <span>Subject *</span>
            <input
              name="subject"
              placeholder="What would you like to discuss?"
              required
              type="text"
            />
          </label>
          <label className="form-field">
            <span>Message *</span>
            <textarea
              name="message"
              placeholder="Tell us a little about your question or goals…"
              required
            />
          </label>
          <div className="form-action">
            <button className="send-button" type="submit" disabled={status === "sending" || status === "sent"}>
              {status === "sending" ? "Sending…" : status === "sent" ? "Sent!" : "Send message"}
            </button>
          </div>
        </form>

        <>
          {status === "sent" && (
            <div className="success-modal-overlay" role="status" aria-live="polite">
              <div className="success-modal">
                <div className="success-icon">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <circle cx="12" cy="12" r="11" stroke="#276b55" strokeWidth="2" />
                    <path d="M8 12l3 3 7-7" stroke="#276b55" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <h3>Message Sent</h3>
                <p>Thank you — your message has been sent. We'll get back to you within 1–2 business days.</p>
              </div>
            </div>
          )}

          {status === "failed" && (
            <p className="form-status form-status--error" role="alert">
              Something went wrong. Please try again.
            </p>
          )}
        </>
      </div>
    </div>
  )
}

export default function ContactPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [pointerVisible, setPointerVisible] = useState(true)
  const pointerRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (window.innerWidth <= 680) {
      setPointerVisible(true)
    }
  }, [])

  return (
    <main className="contact-page">
      <section className="contact-section">
        <header className="introduction">
          <div className="section-label">
            <span />
            <p>CONTACT US</p>
          </div>
          <h1>
            A clear path starts with
            <strong>a conversation.</strong>
          </h1>
          <p className="intro-copy">
            Have a question about your wealth, your future, or working together?
            <br className="desktop-break" /> Connect with Kayode Samson Elepe.
            Let's take the next step.
          </p>
        </header>

        <div className="contact-hero">
          <a href="tel:+14699747416" aria-label="Call KSEFinServe" className="telephone-display">
            <img className="halo-outline" height="368" src={`${assets}/7b0d5.svg`} width="368" />
            <img className="telephone-halo" height="336" src={`${assets}/24387.svg`} width="336" />
            <img className="telephone" height="360" src={`${assets}/39a77.png`} width="520" />
          </a>
          <div className="contact-hero-action">
            <span className={`contact-pointer${pointerVisible ? "" : " hidden"}`} aria-hidden="true" ref={pointerRef}>👆</span>
            <button onClick={() => { setIsDialogOpen(true); setPointerVisible(false) }} type="button">Contact Us</button>
          </div>
          <p>Your next chapter begins with a simple hello.</p>
        </div>

        <div className="contact-options">
          <article className="email-contact">
            <div className="contact-icon">
              <img alt="" height="22" src={`${assets}/aec2f.svg`} width="22" />
            </div>
            <div className="email-details">
              <h2>Drop us a line.</h2>
              <p>
                {"For questions, collaborations, or a\nconversation about what comes next."}
              </p>
            </div>
            <div className="email-address">
              <a href="mailto:info@ksefinserve.com">info@ksefinserve.com</a>
              <p>We usually respond within 1-2 business days.</p>
            </div>
            <div className="contact-divider" />
            <p className="write-here">
              Prefer to write here? <span className="mobile-write-here">click the contact us button above</span> to share your message.
            </p>
          </article>

          <a href="tel:+14699747416" aria-label="Call KSEFinServe" className="telephone-display">
            <img
              className="halo-outline"
              height="368"
              src={`${assets}/7b0d5.svg`}
              width="368"
            />
            <img
              className="telephone-halo"
              height="336"
              src={`${assets}/24387.svg`}
              width="336"
            />
            <img
              className="telephone"
              height="360"
              src={`${assets}/39a77.png`}
              width="520"
            />
          </a>

          <article className="office-contact">
            <div className="office-heading">
              <img alt="" height="22" src={`${assets}/9b886.svg`} width="22" />
              <h2>Find us.</h2>
            </div>
            <div className="address">
              <p>363 N Sam Houston Pkwy E</p>
              <span>Suite 200, Houston, TX 77060</span>
            </div>
            <div className="location-preview">
              <a
                className="map-preview"
                href="https://www.google.com/maps/search/?api=1&query=363+N+Sam+Houston+Pkwy+E+Suite+200+Houston+TX+77060"
                target="_blank"
                rel="noreferrer"
                aria-label="Open 363 N Sam Houston Pkwy E Suite 200, Houston TX 77060 in Google Maps"
              >
                <iframe
                  title="KSEFinServe office location"
                  className="street-map"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  src="https://www.google.com/maps?q=363%20N%20Sam%20Houston%20Pkwy%20E%20Suite%20200%2C%20Houston%2C%20TX%2077060&output=embed"
                />
                <span className="preview-badge">
                  View larger map ↗
                </span>
                <span className="location-marker">
                  <img
                    alt=""
                    height="20"
                    src={`${assets}/1f9e2.svg`}
                    width="20"
                  />
                </span>
              </a>
              <p>
                Tap the map to open directions in Google Maps.
              </p>
            </div>
          </article>
        </div>

        <div className="contact-action">
          <div className="contact-action-wrapper">
            <span className={`contact-pointer${pointerVisible ? "" : " hidden"}`} aria-hidden="true" ref={pointerRef}>👆</span>
            <button onClick={() => { setIsDialogOpen(true); setPointerVisible(false) }} type="button">
              Contact Us
            </button>
          </div>
          <p>Your next chapter begins with a simple hello.</p>
        </div>
      </section>

      {isDialogOpen && <ContactDialog onClose={() => setIsDialogOpen(false)} />}
    </main>
  )
}
