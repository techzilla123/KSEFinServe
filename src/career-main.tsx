import React, { useState, useRef } from "react"
import ReactDOM from "react-dom/client"
import App from "./CareerPage"
import SiteLayout from "./SiteLayout"
import "./career.css"
import "./career-layout.css"

const assetPathPrefix = "/assets"
const socials = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/kayode-samson-elepe", icon: `${assetPathPrefix}/d6da3.svg` },
  { label: "Twitter", href: "https://twitter.com/kayodesamson", icon: `${assetPathPrefix}/d6da3.svg` },
  { label: "Facebook", href: "https://facebook.com/kayode.elepe", icon: `${assetPathPrefix}/d6da3.svg` },
]

function CareerApp() {
  const [mobileMenu, setMobileMenu] = useState(false)
  const [eventsMenuOpen, setEventsMenuOpen] = useState(false)
  const [calcMenuOpen, setCalcMenuOpen] = useState(false)
  const [growing, setGrowing] = useState<number | null>(null)
  const eventsMenuRef = useRef<HTMLDivElement>(null)
  const calcMenuRef = useRef<HTMLDivElement>(null)
  const navigate = (path: string) => { window.location.href = path }
  const setPanel = (_panel: any) => {}
  return (
    <SiteLayout navigate={navigate} setPanel={setPanel} setMobileMenu={setMobileMenu} mobileMenu={mobileMenu} eventsMenuOpen={eventsMenuOpen} setEventsMenuOpen={setEventsMenuOpen} calcMenuOpen={calcMenuOpen} setCalcMenuOpen={setCalcMenuOpen} eventsMenuRef={eventsMenuRef} calcMenuRef={calcMenuRef} growing={growing} setGrowing={setGrowing} socials={socials} hideCareerNav>
      <App />
    </SiteLayout>
  )
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <CareerApp />
  </React.StrictMode>,
)
