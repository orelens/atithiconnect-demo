import { useState } from "react";
import GuestShell from "../components/GuestShell";
import RequestSheet, { StatusSteps } from "../components/RequestSheet";
import { GUEST, WIFI, requests as reqMeta } from "../data";
import { ago, greeting, useDemo } from "../store";
import { IconClean, IconCopy, IconLuggage, IconRepair, IconTowels, IconWake, IconWater } from "../components/Icons";

const icons: Record<string, typeof IconTowels> = {
  towels: IconTowels, cleaning: IconClean, luggage: IconLuggage,
  wakeup: IconWake, water: IconWater, repair: IconRepair,
};

export default function GuestHome() {
  const { lang, setLang, t, orders, tickets, flash } = useDemo();
  const [pick, setPick] = useState<(typeof reqMeta)[number] | null>(null);
  const myReq = tickets.filter((x) => x.room === GUEST.room && x.id.startsWith("t1") && x.id.length > 6).slice(0, 2);
  const greet = greeting(lang);
  const mine = orders.filter((o) => o.room === GUEST.room && o.status !== "cancelled" && o.status !== "served");

  function copyWifi() {
    navigator.clipboard?.writeText(WIFI.password).catch(() => {});
    flash(t("Password copied", "पासवर्ड कॉपी हो गया"));
  }

  return (
    <GuestShell>
      <header className="g-hero">
        <img className="bg" src={`${import.meta.env.BASE_URL}images/room.jpg`} alt="" />
        <div className="veil" />
        <div className="inner">
          <div className="g-top">
            <img className="app-logo" src={`${import.meta.env.BASE_URL}brand/logo-white.png`} alt="AtithiConnect" />
            <button className="lang-btn" onClick={() => setLang(lang === "en" ? "hi" : "en")} lang="hi">
              {lang === "en" ? "हिंदी" : "EN"}
            </button>
          </div>
          <div className="g-hotel">{HOTEL_UP}</div>
          <h1 className={"g-hello" + (lang === "hi" ? " hi" : "")}>
            {greet}, {lang === "hi" ? GUEST.formalHi : GUEST.formal}
          </h1>
          <div className="g-meta">
            <div className="g-co">{t("Checkout " + GUEST.checkout, "चेकआउट " + GUEST.checkoutHi)}</div>
            <div className="room-pill">ROOM {GUEST.room}</div>
          </div>
        </div>
      </header>

      <section className="wifi-card">
        <div className="wifi-top">
          <div className="wifi-k">WI-FI</div>
          <button className="copy-btn" onClick={copyWifi}><IconCopy /> {t("COPY PASSWORD", "पासवर्ड कॉपी")}</button>
        </div>
        <div className="wifi-label">{t("NETWORK", "नेटवर्क")}</div>
        <div className="wifi-val">{WIFI.network}</div>
        <div className="wifi-label">{t("PASSWORD", "पासवर्ड")}</div>
        <div className="wifi-val">{WIFI.password}</div>
      </section>

      <section className="section">
        <h2>{t("Ask the team", "टीम से कहें")}</h2>
        <div className="req-grid">
          {reqMeta.map((r) => {
            const Icon = icons[r.icon];
            return (
              <button
                key={r.id}
                className="req-card"
                onClick={() => setPick(r)}
              >
                <Icon />
                <span>{lang === "hi" ? r.titleHi : r.title.toUpperCase()}</span>
              </button>
            );
          })}
        </div>
      </section>

      {myReq.length ? (
        <section className="section">
          <h2>{t("Your requests", "आपके अनुरोध")}</h2>
          {myReq.map((x) => (
            <article key={x.id} className="order-card req-live" style={{ marginBottom: 10 }}>
              <div className="order-top">
                <div className="oid" style={{ fontFamily: "var(--display)", fontWeight: 600 }}>{lang === "hi" ? x.titleHi : x.title}</div>
                <span className={"badge " + x.status}>{reqLabel(x.status, lang)}</span>
              </div>
              <div className="order-items">{lang === "hi" ? x.detailHi : x.detail}</div>
              <StatusSteps status={x.status} />
            </article>
          ))}
        </section>
      ) : null}

      <section className="section">
        <h2>{t("Your orders", "आपके ऑर्डर")}</h2>
        {mine.length === 0 ? <p className="empty">{t("Nothing in the kitchen yet.", "अभी रसोई में कुछ नहीं है।")}</p> : mine.map((o) => (
          <article key={o.id} className="order-card" style={{ marginBottom: 10 }}>
            <div className="order-top">
              <div className="oid">#{o.id}</div>
              <span className={"badge " + (o.status === "preparing" ? "prep" : o.status)}>{statusLabel(o.status, lang)}</span>
            </div>
            <div className="order-items">
              {o.items.map((i) => `${i.qty}× ${lang === "hi" ? i.nameHi : i.name}`).join(", ")}
            </div>
            {o.note ? <div className="note">{t("Note: ", "नोट: ")}{lang === "hi" && o.noteHi ? o.noteHi : o.note}</div> : null}
          </article>
        ))}
      </section>

      <section className="section" style={{ paddingBottom: 24 }}>
        <h2>{t("Offers for your stay", "आपके ठहरने पर ऑफ़र")}</h2>
        <div className="order-card">
          <div className="oid" style={{ fontFamily: "var(--serif)", fontWeight: 600, fontSize: 17 }}>{t("Sunset chai", "सनसेट चाय")}</div>
          <p className="order-items">{t("A complimentary masala chai after 5 pm, on the house.", "शाम 5 बजे के बाद मुफ़्त मसाला चाय, होटल की ओर से।")}</p>
        </div>
      </section>
      <RequestSheet item={pick} onClose={() => setPick(null)} />
    </GuestShell>
  );
}

function reqLabel(s: string, lang: "en" | "hi") {
  const m: Record<string, [string, string]> = { pending: ["Pending", "लंबित"], accepted: ["Accepted", "स्वीकृत"], progress: ["On the way", "आ रहा है"], done: ["Done", "हो गया"] };
  const r = m[s] || [s, s];
  return lang === "hi" ? r[1] : r[0];
}

const HOTEL_UP = "HOTEL DEMO INDORE";

function statusLabel(s: string, lang: "en" | "hi") {
  const map: Record<string, [string, string]> = {
    new: ["New", "नया"],
    preparing: ["Being prepared", "तैयार हो रहा है"],
    ready: ["Ready", "तैयार"],
    served: ["Served", "परोसा गया"],
  };
  const row = map[s] || [s, s];
  return lang === "hi" ? row[1] : row[0];
}
