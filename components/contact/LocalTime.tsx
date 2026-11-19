"use client";

import { useSyncExternalStore } from "react";

const fmt = new Intl.DateTimeFormat("en-IN", {
  timeZone: "Asia/Kolkata",
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
});

function subscribe(onChange: () => void) {
  const id = setInterval(onChange, 15_000);
  return () => clearInterval(id);
}

/** Current time in Bengaluru. Renders a dash on the server, so there's no hydration mismatch. */
export function LocalTime() {
  const time = useSyncExternalStore(
    subscribe,
    () => fmt.format(Date.now()),
    () => null,
  );
  return <span className="tabular-nums">{time ?? "—"} IST</span>;
}
