import React, { useState, useRef, useEffect } from "react";
import ReactDOM from "react-dom/client";
import SiteLayout from "./SiteLayout";
import EventPage from "./EventPage";
import InsightPage from "./InsightPage";
import "./index.css";
import "./event-insight.css";

const assetPathPrefix = "/assets";
const socials = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/kayode-samson-elepe", icon: `${assetPathPrefix}/d6da3.svg` },
  { label: "Twitter", href: "https://twitter.com/kayodesamson", icon: `${assetPathPrefix}/d6da3.svg` },
  { label: "Facebook", href: "https://facebook.com/kayode.elepe", icon: `${assetPathPrefix}/d6da3.svg` },
];

type Mode = "event" | "insight";

function getInitialMode(): Mode {
  const path = window.location.pathname;
  if (path === "/events") return "event";
  if (path === "/insights") return "insight";
  return "insight";
}

function EventInsightApp() {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [eventsMenuOpen, setEventsMenuOpen] = useState(false);
  const [workMenuOpen, setWorkMenuOpen] = useState(false);
  const [calcMenuOpen, setCalcMenuOpen] = useState(false);
  const [growing, setGrowing] = useState<number | null>(null);
  const eventsMenuRef = useRef<HTMLDivElement>(null);
  const workMenuRef = useRef<HTMLDivElement>(null);
  const calcMenuRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<Mode>(getInitialMode);

  // Scale the fixed 1440px design canvas to fit whatever viewport it lands in.
  // Recomputed on resize so it works at any window size, not just the one it
  // happened to load at.
  const [scale, setScale] = useState(() =>
    typeof window === "undefined" ? 1 : window.innerWidth / 1440,
  );
  const [scaledHeight, setScaledHeight] = useState<number | undefined>(undefined);
  const sourceRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const measure = () => {
      const s = window.innerWidth / 1440;
      setScale(s);
      const h = sourceRef.current?.scrollHeight;
      if (h) setScaledHeight(h * s);
    };
    measure();
    window.addEventListener("resize", measure);
    // Re-measure once fonts/images settle so the reserved height is accurate.
    const t = window.setTimeout(measure, 400);
    return () => {
      window.removeEventListener("resize", measure);
      window.clearTimeout(t);
    };
  }, [mode]);

  const navigate = (path: string) => { window.location.href = path };
  const setPanel = (_panel: any) => {};

  // Update URL when mode changes
  useEffect(() => {
    const target = mode === "event" ? "/events" : "/insights";
    if (window.location.pathname !== target) {
      window.history.pushState({}, "", target);
    }
  }, [mode]);

  const changeMode = (nextMode: Mode) => {
    setMode(nextMode);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <SiteLayout navigate={navigate} setPanel={setPanel} setMobileMenu={setMobileMenu} mobileMenu={mobileMenu} eventsMenuOpen={eventsMenuOpen} setEventsMenuOpen={setEventsMenuOpen} calcMenuOpen={calcMenuOpen} setCalcMenuOpen={setCalcMenuOpen} eventsMenuRef={eventsMenuRef} workMenuOpen={workMenuOpen} setWorkMenuOpen={setWorkMenuOpen} workMenuRef={workMenuRef} calcMenuRef={calcMenuRef} growing={growing} setGrowing={setGrowing} socials={socials} isLanding hideCareerNavOnly>
      <main className={`design-viewport design-viewport--${mode}`}>
        <div
          className="design-scale-shell"
          style={scaledHeight ? { height: scaledHeight } : undefined}
        >
          <div
            className="design-source"
            ref={sourceRef}
            style={{ transform: `scale(${scale})` }}
          >
            {mode === "event" ? (
              <EventPage onModeChange={changeMode} />
            ) : (
              <InsightPage onModeChange={changeMode} />
            )}
          </div>
        </div>
      </main>
    </SiteLayout>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <EventInsightApp />
  </React.StrictMode>,
);