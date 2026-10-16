import { useEffect, useState } from "react"
import EventPage from "./EventPage"
import InsightPage from "./InsightPage"

type Mode = "event" | "insight"

export default function App() {
  const [mode, setMode] = useState<Mode>("insight")
  const [scale, setScale] = useState(() =>
    typeof window === "undefined" ? 1 : Math.min(window.innerWidth / 1440, 1),
  )

  useEffect(() => {
    const updateScale = () => setScale(Math.min(window.innerWidth / 1440, 1))
    window.addEventListener("resize", updateScale)
    return () => window.removeEventListener("resize", updateScale)
  }, [])

  const changeMode = (nextMode: Mode) => {
    setMode(nextMode)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <main className={`design-viewport design-viewport--${mode}`}>
      <div className="design-source" style={{ zoom: scale }}>
        {mode === "event" ? (
          <EventPage onModeChange={changeMode} />
        ) : (
          <InsightPage onModeChange={changeMode} />
        )}
      </div>
    </main>
  )
}
