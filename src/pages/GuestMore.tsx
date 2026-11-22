import { Link } from "react-router-dom";
import GuestShell from "../components/GuestShell";
import { GUEST, WIFI, nearby } from "../data";
import { useDemo } from "../store";

export default function GuestMore() {
  const { lang, t, orders, flash } = useDemo();
  const mine = orders.filter((o) => o.room === GUEST.room && o.status !== "cancelled");
  const total = mine.reduce((s, o) => s + o.items.reduce((a, i) => a + i.qty * priceOf(i.name), 0), 0);

  return (
    <GuestShell>
      <div className="section" style={{ paddingTop: 28 }}>
        <h2>{t("Your stay", "आपका ठहरना")}</h2>
        <div className="order-card">
          <div className="oid" style={{ fontFamily: "var(--serif)", fontWeight: 500, fontSize: 20 }}>{lang === "hi" ? GUEST.formalHi : GUEST.formal}</div>
          <div className="order-items">
            {t("Room", "कमरा")} {GUEST.room} · {t("Checkout " + GUEST.checkout, "चेकआउट " + GUEST.checkoutHi)}
          </div>
        </div>
      </div>
      <div className="section">
        <h2>Wi-Fi</h2>
        <div className="order-card">
          <div className="order-items">{t("Network", "नेटवर्क")}</div>
          <div className="oid">{WIFI.network}</div>
          <div className="order-items" style={{ marginTop: 8 }}>{t("Password", "पासवर्ड")}</div>
          <div className="oid">{WIFI.password}</div>
          <button className="btn-dark" onClick={() => { navigator.clipboard?.writeText(WIFI.password).catch(() => {}); flash(t("Password copied", "पासवर्ड कॉपी हो गया")); }}>
            {t("Copy password", "पासवर्ड कॉपी करें")}
          </button>
        </div>
      </div>
      <div className="section">
        <h2>{t("The bill so far", "अभी तक का बिल")}</h2>
        <div className="order-card">
          {mine.length === 0 ? <p className="empty">{t("No charges yet.", "अभी कोई शुल्क नहीं।")}</p> : mine.map((o) => (
            <div key={o.id} style={{ marginBottom: 10 }}>
              <div className="order-top"><span>#{o.id}</span><span className={"badge " + o.status}>{o.status}</span></div>
              <div className="order-items">{o.items.map((i) => `${i.qty}× ${lang === "hi" ? i.nameHi : i.name}`).join(", ")}</div>
            </div>
          ))}
          <div className="oid" style={{ marginTop: 8 }}>{t("Running total", "कुल")} · ₹{total}</div>
          <p className="order-items">{t("Settles at checkout. This is a demo, nothing is billed.", "चेकआउट पर जमा होगा। यह डेमो है, कोई बिल नहीं कटेगा।")}</p>
        </div>
      </div>
      <div className="section" style={{ paddingBottom: 24 }}>
        <h2>{t("Nearby", "आस-पास")}</h2>
        {nearby.map((n) => (
          <div key={n.name} className="order-card" style={{ marginBottom: 8 }}>
            <div className="oid" style={{ fontFamily: "var(--serif)", fontWeight: 600, fontSize: 17 }}>{lang === "hi" ? n.nameHi : n.name}</div>
            <div className="order-items">{lang === "hi" ? n.walkHi : n.walk}</div>
          </div>
        ))}
        <p style={{ marginTop: 16 }}><Link to="/" style={{ color: "var(--muted)", fontSize: 14 }}>{t("Back to AtithiConnect", "AtithiConnect पर वापस")}</Link></p>
      </div>
    </GuestShell>
  );
}

function priceOf(name: string) {
  const map: Record<string, number> = {
    "Masala dosa": 140, Poha: 80, "Aloo paratha": 120, "Chicken tikka": 290,
    "Paneer butter masala": 260, "Chicken biryani": 320, "Butter naan": 50,
    "Masala chai": 40, "Filter coffee": 60, "Gulab jamun": 90,
  };
  return map[name] ?? 0;
}
