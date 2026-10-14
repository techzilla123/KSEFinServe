import { FormEvent, useEffect, useRef, useState } from "react"

const assets = "/assets"

function ContactDialog({ onClose }: { onClose: () => void }) {
  const dialogRef = useRef<HTMLDivElement>(null)

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

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
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
          <p className="dialog-eyebrow">LET’S CONNECT</p>
          <h2 id="contact-dialog-title">Contact Us</h2>
          <p>
            Tell us what’s on your mind. Share a little about yourself
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
            <button className="send-button" type="submit">
              Send message
            </button>
            <p className="privacy-note">
              <img alt="" height="13" src={`${assets}/efaa1.svg`} width="13" />
              Your information is only used to respond to your enquiry.
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function App() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

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
            Let’s take the next step.
          </p>
        </header>

        <div className="contact-options">
          <article className="email-contact">
            <div className="contact-icon">
              <img alt="" height="22" src={`${assets}/aec2f.svg`} width="22" />
            </div>
            <div className="email-details">
              <h2>Drop us a line.</h2>
              <p>
                For questions, collaborations, or a conversation about what
                comes next.
              </p>
            </div>
            <div className="email-address">
              <a href="mailto:info@ksefinserve.com">info@ksefinserve.com</a>
              <p>Email details to be added</p>
            </div>
            <div className="contact-divider" />
            <p className="write-here">
              Prefer to write here? Use the contact form below to share your
              message.
            </p>
          </article>

          <div aria-hidden="true" className="telephone-display">
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
          </div>

          <article className="office-contact">
            <div className="office-heading">
              <img alt="" height="22" src={`${assets}/9b886.svg`} width="22" />
              <h2>Find us.</h2>
            </div>
            <div className="address">
              <p>[Add office address]</p>
              <span>[City, region, postal code]</span>
            </div>
            <div className="location-preview">
              <div className="map-preview">
                <img
                  alt="Illustrative street map"
                  className="street-map"
                  height="156"
                  src={`${assets}/60a2a.png`}
                  width="280"
                />
                <span className="preview-badge">
                  Location preview · placeholder
                </span>
                <div className="map-controls">
                  <img
                    alt=""
                    height="14"
                    src={`${assets}/b500f.svg`}
                    width="14"
                  />
                  <img
                    alt=""
                    height="14"
                    src={`${assets}/77324.svg`}
                    width="14"
                  />
                </div>
                <span className="location-marker">
                  <img
                    alt=""
                    height="20"
                    src={`${assets}/1f9e2.svg`}
                    width="20"
                  />
                </span>
              </div>
              <p>
                Google Maps preview to be connected once the office address is
                added.
              </p>
            </div>
          </article>
        </div>

        <div className="contact-action">
          <button onClick={() => setIsDialogOpen(true)} type="button">
            Contact Us
          </button>
          <p>Your next chapter begins with a simple hello.</p>
        </div>
      </section>

      {isDialogOpen && <ContactDialog onClose={() => setIsDialogOpen(false)} />}
    </main>
  )
}
