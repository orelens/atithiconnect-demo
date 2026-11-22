import { useState } from "react";
import GuestShell from "../components/GuestShell";
import RequestSheet, { StatusSteps } from "../components/RequestSheet";
import { GUEST, requests as reqMeta } from "../data";
import { ago, useDemo } from "../store";
import { IconClean, IconLuggage, IconRepair, IconTowels, IconWake, IconWater } from "../components/Icons";

const icons: Record<string, typeof IconTowels> = {
  towels: IconTowels, cleaning: IconClean, luggage: IconLuggage,
  wakeup: IconWake, water: IconWater, repair: IconRepair,
};

export default function GuestRequests() {
  const { lang, t, tickets } = useDemo();
  const [pick, setPick] = useState<(typeof reqMeta)[number] | null>(null);
  const mine = tickets.filter((x) => x.room === GUEST.room);
  return (
    <GuestShell>
      <div className="section" style={{ paddingTop: 20 }}>
        <h2>{t("Ask the team", "टीम से कहें")}</h2>
        <div className="req-grid">
          {reqMeta.map((r) => {
            const Icon = icons[r.icon];
            return (
              <button key={r.id} className="req-card" onClick={() => setPick(r)}>
                <Icon />
                <span>{lang === "hi" ? r.titleHi : r.title.toUpperCase()}</span>
              </button>
            );
          })}
        </div>
      </div>
      <div className="section">
        <h2>{t("Your requests", "आपके अनुरोध")}</h2>
        {mine.map((x) => (
          <article key={x.id} className="order-card" style={{ marginBottom: 10 }}>
            <div className="order-top">
              <div className="oid" style={{ fontFamily: "var(--serif)", fontWeight: 500 }}>{lang === "hi" ? x.titleHi : x.title}</div>
              <span className={"badge " + x.status}>{label(x.status, lang)}</span>
            </div>
            <div className="order-items">{lang === "hi" ? x.detailHi : x.detail} · {ago(x.agoMin, lang)}</div>
            <StatusSteps status={x.status} />
          </article>
        ))}
      </div>
      <RequestSheet item={pick} onClose={() => setPick(null)} />
    </GuestShell>
  );
}

function label(s: string, lang: "en" | "hi") {
  const m: Record<string, [string, string]> = {
    pending: ["Pending", "लंबित"],
    accepted: ["Accepted", "स्वीकृत"],
    progress: ["In progress", "चल रहा है"],
    done: ["Done", "हो गया"],
  };
  const r = m[s] || [s, s];
  return lang === "hi" ? r[1] : r[0];
}
