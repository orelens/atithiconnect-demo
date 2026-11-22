import { useEffect, useMemo, useRef, useState } from "react";
import { ContactButtons } from "../contact";
import "../pricing.css";

const inr = (n: number) => "₹" + Math.round(n).toLocaleString("en-IN");
const MIN_CORE = 1499;
const SETUP = 2499;
const TIERS = [
  { max: 15, rate: 149, label: "1–15 rooms" },
  { max: 40, rate: 129, label: "16–40 rooms" },
  { max: 80, rate: 109, label: "41–80 rooms" },
  { max: Infinity, rate: 99, label: "81+ rooms" },
];
const ADDONS = [
  { id: "food", name: "Food ordering + Kitchen app", d: "Room-service menu, live kitchen display", price: 799 },
  { id: "owner", name: "Owner dashboard + reports", d: "Sales, occupancy, team speed, menu edits", price: 599 },
  { id: "chat", name: "Chat with reception", d: "Guests message the desk from their phone", price: 299 },
  { id: "offers", name: "Offers & nearby places", d: "Promote packages, share local spots & cabs", price: 299 },
] as const;
type AddonId = (typeof ADDONS)[number]["id"];
const PRESETS = [
  { label: "Small", rooms: 10, add: ["chat"] as AddonId[] },
  { label: "Mid", rooms: 30, add: ["food", "chat"] as AddonId[] },
  { label: "Large", rooms: 80, add: ["food", "owner", "chat", "offers"] as AddonId[] },
];

const Check = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>;

export default function Pricing() {
  const [rooms, setRooms] = useState(30);
  const [draft, setDraft] = useState("30");
  const [sel, setSel] = useState<Record<AddonId, boolean>>({ food: true, owner: false, chat: true, offers: false });
  const [yearly, setYearly] = useState(false);
  const [barOn, setBarOn] = useState(false);
  const secRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const setR = (n: number) => { const v = Math.max(5, Math.min(200, Math.round(n) || 5)); setRooms(v); setDraft(String(v)); };

  const q = useMemo(() => {
    const tier = TIERS.find((t) => rooms <= t.max)!;
    const raw = rooms * tier.rate;
    const core = Math.max(MIN_CORE, raw);
    const adds = ADDONS.filter((a) => sel[a.id]);
    const monthly = core + adds.reduce((s, a) => s + a.price, 0);
    return { tier, raw, core, minApplied: raw < MIN_CORE, adds, monthly, yearly: monthly * 10, saving: monthly * 2, perRoom: monthly / rooms };
  }, [rooms, sel]);

  // mobile: compact sticky bar while the calculator is on screen but the full card isn't
  useEffect(() => {
    const sec = secRef.current, card = cardRef.current;
    if (!sec || !card || !("IntersectionObserver" in window)) return;
    let inSec = false, cardVis = false;
    const upd = () => { const on = inSec && !cardVis; setBarOn(on); document.documentElement.classList.toggle("pr-bar-on", inSec); };
    const a = new IntersectionObserver(([e]) => { inSec = e.isIntersecting; upd(); }, { rootMargin: "-30% 0px -30% 0px" });
    const b = new IntersectionObserver(([e]) => { cardVis = e.isIntersecting; upd(); }, { threshold: 0.35 });
    a.observe(sec); b.observe(card);
    return () => { a.disconnect(); b.disconnect(); document.documentElement.classList.remove("pr-bar-on"); };
  }, []);

  const fill = ((rooms - 5) / 195) * 100;
  const headline = yearly ? q.yearly : q.monthly;
  const waText = `Hi, I want an AtithiConnect demo. ${rooms} rooms${q.adds.length ? " + " + q.adds.map((a) => a.name).join(", ") : ""}. Estimate ${inr(q.monthly)}/month.`;

  return (
    <section className="pricing" id="pricing" ref={secRef}>
      <div className="mk-wrap">
        <div className="sec-head rv">
          <span className="kick">Pricing</span>
          <h2>Simple pricing, <mark className="mv">based on your rooms.</mark></h2>
          <p>Pick your room count and the features you need. Your total updates instantly. No hidden charges.</p>
        </div>

        <div className="pr-grid">
          <div className="pr-controls rv">
            <div className="pr-block">
              <div className="pr-row">
                <label htmlFor="pr-rooms" className="pr-label">Number of rooms</label>
                <div className="pr-num">
                  <button type="button" onClick={() => setR(rooms - 1)} aria-label="Fewer rooms">−</button>
                  <input id="pr-rooms-n" inputMode="numeric" value={draft} aria-label="Rooms"
                    onChange={(e) => { const t = e.target.value.replace(/\D/g, "").slice(0, 3); setDraft(t); const n = Number(t); if (n >= 5 && n <= 200) setRooms(n); }}
                    onBlur={() => setR(Number(draft))} />
                  <button type="button" onClick={() => setR(rooms + 1)} aria-label="More rooms">+</button>
                </div>
              </div>
              <input id="pr-rooms" type="range" min={5} max={200} value={rooms} onChange={(e) => setR(Number(e.target.value))}
                className="pr-range" style={{ ["--f" as string]: fill + "%" }} />
              <div className="pr-scale"><span>5</span><span>50</span><span>100</span><span>150</span><span>200</span></div>
              <div className="pr-chips">
                {PRESETS.map((p) => (
                  <button type="button" key={p.label} className={"pr-chip" + (rooms === p.rooms ? " on" : "")}
                    onClick={() => { setR(p.rooms); setSel({ food: p.add.includes("food"), owner: p.add.includes("owner"), chat: p.add.includes("chat"), offers: p.add.includes("offers") }); }}>
                    <b>{p.label}</b> {p.rooms} rooms
                  </button>
                ))}
              </div>
              <div className="pr-tiers">
                {TIERS.map((t) => (
                  <div key={t.label} className={"pr-tier" + (t === q.tier ? " on" : "")}><span>{t.label}</span><b>{inr(t.rate)}<small>/room</small></b></div>
                ))}
              </div>
            </div>

            <div className="pr-block">
              <div className="pr-label">Features</div>
              <div className="pr-feat core">
                <span className="pr-tick on"><Check /></span>
                <div><b>Core <em>Always included</em></b><small>Room QR, Wi‑Fi, housekeeping requests, Reception Desk app</small></div>
                <span className="pr-price">{inr(q.tier.rate)}/room</span>
              </div>
              {ADDONS.map((a) => (
                <label key={a.id} className={"pr-feat" + (sel[a.id] ? " sel" : "")}>
                  <input type="checkbox" checked={sel[a.id]} onChange={(e) => setSel({ ...sel, [a.id]: e.target.checked })} />
                  <span className="pr-tick"><Check /></span>
                  <div><b>{a.name}</b><small>{a.d}</small></div>
                  <span className="pr-price">+{inr(a.price)}<small>/mo</small></span>
                </label>
              ))}
            </div>

            <div className="pr-block pr-bill">
              <div className="pr-label">Billing</div>
              <div className="pr-toggle" role="radiogroup" aria-label="Billing period">
                <button type="button" role="radio" aria-checked={!yearly} className={!yearly ? "on" : ""} onClick={() => setYearly(false)}>Monthly</button>
                <button type="button" role="radio" aria-checked={yearly} className={yearly ? "on" : ""} onClick={() => setYearly(true)}>Yearly <span>2 months free</span></button>
                <i style={{ transform: yearly ? "translateX(100%)" : "none" }} aria-hidden />
              </div>
            </div>
          </div>

          <aside className="pr-card" ref={cardRef} aria-live="polite">
            <div className="pr-card-top">
              <span className="pr-card-k">Your estimate · {rooms} rooms</span>
              <div className="pr-total"><b>{inr(headline)}</b><span>/{yearly ? "year" : "month"}</span></div>
              <div className="pr-sub">{yearly ? <>Works out to {inr(q.yearly / 12)}/month · you save {inr(q.saving)}</> : <>About {inr(q.perRoom)} per room per month</>}</div>
            </div>
            <ul className="pr-lines">
              <li><span>Core · {rooms} rooms × {inr(q.tier.rate)}{q.minApplied ? <em>Minimum {inr(MIN_CORE)} applies</em> : null}</span><b>{inr(q.core)}</b></li>
              {q.adds.map((a) => <li key={a.id}><span>{a.name}</span><b>{inr(a.price)}</b></li>)}
              <li className="sum"><span>Monthly total</span><b>{inr(q.monthly)}</b></li>
              <li className={"sum" + (yearly ? " hl" : "")}><span>Yearly total <em>pay 10 months, get 12</em></span><b>{inr(q.yearly)}</b></li>
              <li className="save"><span>Yearly savings</span><b>{inr(q.saving)}</b></li>
              <li className="setup"><span>One‑time setup <em>QR standees + setup</em></span><b>{inr(SETUP)}</b></li>
            </ul>
            <a href="#contact" className="btn btn-violet full">Book a free demo
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M5 12h14M13 6l6 6-6 6" /></svg>
            </a>
            <ContactButtons variant="dark" text={waText} />
            <p className="pr-note">Estimate only. We confirm the final quote on your free demo call.</p>
          </aside>
        </div>
      </div>

      <div className={"pr-bar" + (barOn ? " on" : "")} aria-hidden={!barOn}>
        <div><small>{rooms} rooms · {yearly ? "yearly" : "monthly"}</small><b>{inr(headline)}<span>/{yearly ? "yr" : "mo"}</span></b></div>
        <a href="#contact" className="btn btn-violet" tabIndex={barOn ? 0 : -1}>Book demo</a>
      </div>
    </section>
  );
}
