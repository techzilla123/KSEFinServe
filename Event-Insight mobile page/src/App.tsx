import { useState } from "react";
import EventsPage from "./EventsPage";
import InsightsPage from "./InsightsPage";

type Page = "events" | "insights";

export default function App() {
  const [page, setPage] = useState<Page>("insights");

  return page === "events" ? (
    <EventsPage onShowInsights={() => setPage("insights")} />
  ) : (
    <InsightsPage onShowEvents={() => setPage("events")} />
  );
}
