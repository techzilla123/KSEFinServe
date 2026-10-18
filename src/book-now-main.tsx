import React, { useState, useRef } from "react"
import ReactDOM from "react-dom/client"
import BookNowPage from "./BookNowPage"
import SiteLayout from "./SiteLayout"
import "./book-now.css"
import "./about-layout.css"

const assetPathPrefix = "/assets"
const socials = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/kayode-samson-elepe", icon: `${assetPathPrefix}/d6da3.svg` },
  { label: "Twitter", href: "https://twitter.com/kayodesamson", icon: `${assetPathPrefix}/d6da3.svg` },
  { label: "Facebook", href: "https://facebook.com/kayode.elepe", icon: `${assetPathPrefix}/d6da3.svg` },
]

function BookNowApp() {
  const [mobileMenu, setMobileMenu] = useState(false)
  const [eventsMenuOpen, setEventsMenuOpen] = useState(false)
  const [workMenuOpen, setWorkMenuOpen] = useState(false)
  const [calcMenuOpen, setCalcMenuOpen] = useState(false)
  const [growing, setGrowing] = useState<number | null>(null)
  const eventsMenuRef = useRef<HTMLDivElement>(null)
  const workMenuRef = useRef<HTMLDivElement>(null)
  const calcMenuRef = useRef<HTMLDivElement>(null)
  const navigate = (path: string) => { window.location.href = path }
  const setPanel = (_panel: any) => {}
  return (
    <SiteLayout navigate={navigate} setPanel={setPanel} setMobileMenu={setMobileMenu} mobileMenu={mobileMenu} eventsMenuOpen={eventsMenuOpen} setEventsMenuOpen={setEventsMenuOpen} calcMenuOpen={calcMenuOpen} setCalcMenuOpen={setCalcMenuOpen} eventsMenuRef={eventsMenuRef} workMenuOpen={workMenuOpen} setWorkMenuOpen={setWorkMenuOpen} workMenuRef={workMenuRef} calcMenuRef={calcMenuRef} growing={growing} setGrowing={setGrowing} socials={socials} isLanding hideCareerNavOnly mobileWorkDropdown>
      <BookNowPage />
    </SiteLayout>
  )
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BookNowApp />
  </React.StrictMode>,
)
