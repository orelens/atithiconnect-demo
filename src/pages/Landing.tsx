import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { Link } from "react-router-dom";
import "../landing.css";
import "../motion.css";
import { useMotion, isLite } from "../motion";
import Pricing from "../components/Pricing";
import { CONTACT, ContactButtons, WhatsAppFab } from "../contact";

const B = import.meta.env.BASE_URL;
const MAIL = CONTACT.email;

/* ---------- small icons (stroke, 24px) ---------- */
const I = ({ d, children }: { d?: string; children?: ReactNode }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    {d ? <path d={d} /> : children}
  </svg>
);
const icons = {
  wifi: <I><path d="M2.5 9a14 14 0 0 1 19 0" /><path d="M5.5 12.5a9.5 9.5 0 0 1 13 0" /><path d="M8.7 16a5 5 0 0 1 6.6 0" /><circle cx="12" cy="19" r="1" /></I>,
  food: <I><path d="M3 13h18a8 8 0 0 1-8 7h-2a8 8 0 0 1-8-7z" /><path d="M12 6v3M7.5 9.5a4.5 4.5 0 0 1 9 0" /></I>,
  towel: <I><rect x="5" y="3" width="11" height="16" rx="2" /><path d="M16 7h3v12H8" /><path d="M8 7h5M8 11h5" /></I>,
  chat: <I><path d="M4 5h16v11H9l-5 4V5z" /><path d="M8 9.5h8M8 12.5h5" /></I>,
  pin: <I><path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z" /><circle cx="12" cy="9.5" r="2.5" /></I>,
  tag: <I><path d="M3 12V4h8l10 10-8 8L3 12z" /><circle cx="7.5" cy="8" r="1.5" /></I>,
  lang: <I><path d="M4 5h9M8.5 3v2M6 5c0 4 3 7 6 8M11 5c-1 4-4 7-7 8" /><path d="M13 21l4-9 4 9M14.5 18h5" /></I>,
  grid: <I><rect x="3" y="3" width="8" height="8" rx="2" /><rect x="13" y="3" width="8" height="8" rx="2" /><rect x="3" y="13" width="8" height="8" rx="2" /><rect x="13" y="13" width="8" height="8" rx="2" /></I>,
  qr: <I><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><path d="M14 14h3v3h-3zM20 14v.01M17 20h4v-3M14 20v.01" /></I>,
  tap: <I><path d="M9 11V5.5a1.5 1.5 0 0 1 3 0V11" /><path d="M12 10.5a1.5 1.5 0 0 1 3 0V12M15 11.5a1.5 1.5 0 0 1 3 0V15a6 6 0 0 1-6 6h-.5a6 6 0 0 1-4.6-2.2L4.5 15.5a1.5 1.5 0 0 1 2.2-2L9 15.5" /></I>,
  bell: <I><path d="M6 16h12l-1.3-2.3a6 6 0 0 1-.7-2.8V9a4 4 0 0 0-8 0v1.9a6 6 0 0 1-.7 2.8L6 16z" /><path d="M10 19a2 2 0 0 0 4 0" /></I>,
  phone: <I><rect x="6" y="2.5" width="12" height="19" rx="3" /><path d="M10.5 18.5h3" /></I>,
  chart: <I><path d="M4 20V10M10 20V4M16 20v-7M22 20H2" /></I>,
  chef: <I><path d="M7 14a4 4 0 1 1 1.2-7.8 4 4 0 0 1 7.6 0A4 4 0 1 1 17 14" /><path d="M7 14v6h10v-6" /></I>,
  desk: <I><path d="M3 10h18M5 10v10M19 10v10M8 6h8l2 4H6l2-4z" /></I>,
  star: <I><path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9L12 3z" /></I>,
  rupee: <I><path d="M7 4h10M7 8.5h10M7 4h3a4.5 4.5 0 0 1 0 9H7l7 7" /></I>,
  check: <I d="M5 12.5l4.5 4.5L19 7.5" />,
  arrow: <I d="M5 12h14M13 6l6 6-6 6" />,
  plus: <I d="M12 5v14M5 12h14" />,
};

function Ribbons({ className = "" }: { className?: string }) {
  return (
    <svg className={"ribbons " + className} viewBox="0 0 1440 800" preserveAspectRatio="xMidYMid slice" aria-hidden>
      <path d="M-80 650 C 180 520, 260 120, 520 140 C 760 160, 700 560, 980 600 C 1240 640, 1300 260, 1560 220" />
      <path d="M-120 300 C 120 220, 380 260, 520 420 C 680 600, 980 700, 1180 520 C 1320 400, 1420 360, 1560 420" />
    </svg>
  );
}

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".rv");
    if (!("IntersectionObserver" in window)) { els.forEach((e) => e.classList.add("in")); return; }
    const io = new IntersectionObserver((ents) => ents.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } }), { threshold: 0.12 });
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, []);
}

const STATUS = ["New request", "Accepted", "On the way", "Done"] as const;

function HeroPhone() {
  const [s, setS] = useState(0);
  useEffect(() => { const t = setInterval(() => setS((x) => (x + 1) % STATUS.length), 1800); return () => clearInterval(t); }, []);
  return (
    <div className="hp-wrap" data-tilt="9" data-tilt-global>
      <div className="stage">
      <div className="hp-glow" aria-hidden />
      <div className="hp">
        <div className="hp-screen">
          <div className="hp-notch" />
          <div className="hp-top">
            <img src={`${B}brand/logo-white.png`} alt="" />
            <span>ROOM 101</span>
          </div>
          <div className="hp-hello">Good evening,<br />Ms. Sharma</div>
          <div className="hp-wifi">
            <div><small>WI‑FI</small><b>Atithi_Guest</b></div>
            <span>Copy password</span>
          </div>
          <div className="hp-k">Ask the team</div>
          <div className="hp-grid">
            {[["towel", "Towels"], ["grid", "Cleaning"], ["food", "Food"], ["chat", "Chat"], ["pin", "Nearby"], ["tag", "Offers"]].map(([ic, l], i) => (
              <div key={l} className={"hp-tile" + (i === 0 ? " on" : "")}>{icons[ic as keyof typeof icons]}<span>{l}</span></div>
            ))}
          </div>
          <div className="hp-order">
            <div><small>YOUR ORDER</small><b>2 × Masala chai</b></div>
            <span className="chip-p">Preparing</span>
          </div>
        </div>
      </div>
      <div className="float f1">
        <div className="fl-ic">{icons.bell}</div>
        <div><small>Reception · just now</small><b>Room 101 · Extra towels</b></div>
        <span className={"st st" + s}>{STATUS[s]}</span>
      </div>
      <div className="float f2">
        <div className="fl-ic g">{icons.check}</div>
        <div><small>Kitchen</small><b>Order #1051 ready</b></div>
      </div>
      <div className="float f3">
        <div className="fl-ic o">{icons.chart}</div>
        <div><small>Owner · live</small><b>All requests on one screen</b></div>
      </div>
      </div>
    </div>
  );
}

const features = [
  { ic: "wifi", t: "Wi‑Fi in one tap", d: "Network and password on the first screen. No more calls asking for it." },
  { ic: "food", t: "Room service menu", d: "Photos, prices, veg / non‑veg marks. Guests order, the kitchen sees it instantly." },
  { ic: "towel", t: "Housekeeping requests", d: "Towels, cleaning, water, repairs or a wake‑up call in a single tap." },
  { ic: "chat", t: "Chat with reception", d: "Guests type, your desk replies. No waiting on the room phone." },
  { ic: "pin", t: "Local places & cabs", d: "Your own list of nearby sights, food spots and how to get a cab." },
  { ic: "tag", t: "Offers & packages", d: "Show a spa deal, sunset chai or late checkout right where guests look." },
  { ic: "lang", t: "English + हिंदी", d: "Guests switch language with one button. Comfortable for every traveller." },
  { ic: "chart", t: "Live room status", d: "Occupied, cleaning or ready. Front desk and owner see the same picture." },
];

const screens = [
  { key: "guest", to: "/guest", img: "screens/guest.jpg", phone: true, ic: "phone", who: "Guest", t: "The guest's phone", d: "Opens from the QR in the room. Wi‑Fi, menu, requests and chat, without installing anything.", pts: ["No download, no login", "English and हिंदी", "Order tracking on the same page"] },
  { key: "reception", to: "/reception", img: "screens/reception.jpg", ic: "desk", who: "Reception", t: "The front desk screen", d: "Every request arrives as a clear ticket with room number and time. One tap to accept, one to finish.", pts: ["Room 101 · Extra towels · Pending", "Accept → In progress → Done", "Room status and guest chat"] },
  { key: "kitchen", to: "/kitchen", img: "screens/kitchen.jpg", ic: "chef", who: "Kitchen", t: "The kitchen display", d: "Food orders land in three simple columns: New, Preparing, Ready. Big text, easy to read from the stove.", pts: ["No paper slips", "Room and dish at a glance", "Mark ready in one tap"] },
  { key: "owner", to: "/owner", img: "screens/owner.jpg", ic: "chart", who: "Owner", t: "The owner dashboard", d: "See occupancy, open requests, food orders and staff speed from anywhere. Edit menu, Wi‑Fi and offers yourself.", pts: ["Occupancy and food sales", "Team response times", "Menu, Wi‑Fi and QR settings"] },
];

const faqs = [
  { q: "Do guests need to download an app?", a: "No. Guests scan the QR card in the room and AtithiConnect opens in their phone's browser. It works on any Android or iPhone." },
  { q: "What does my hotel need to start?", a: "Guest Wi‑Fi, a phone or computer at reception, and a screen or tablet in the kitchen if you serve food. We prepare your menu, rooms and QR cards with you." },
  { q: "Can I change the menu, prices and Wi‑Fi myself?", a: "Yes. The owner dashboard lets you edit dishes, prices, Wi‑Fi details, nearby places and offers at any time." },
  { q: "Does it work in Hindi?", a: "Yes. Guests can switch between English and हिंदी with one tap." },
  { q: "How much does it cost?", a: "Core starts at ₹1,499/month and goes by rooms (₹149 down to ₹99 per room), plus only the add-ons you pick. Use the pricing calculator above to see your exact total." },
  { q: "Is this demo real?", a: "This website uses a sample hotel (Hotel Demo Indore) with sample guests, so you can click through every screen safely. Nothing is billed." },
];

export default function Landing() {
  useReveal();
  useMotion();
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);
  const [open, setOpen] = useState<number | null>(0);
  const [sent, setSent] = useState(false);
  const [tab, setTab] = useState(0);
  useEffect(() => {
    const f = () => setScrolled(window.scrollY > 12);
    f(); window.addEventListener("scroll", f, { passive: true });
    return () => window.removeEventListener("scroll", f);
  }, []);

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const body = `Hi, I'd like a free AtithiConnect demo.%0D%0A%0D%0AName: ${f.get("name")}%0D%0AHotel: ${f.get("hotel")}%0D%0ACity: ${f.get("city")}%0D%0ARooms: ${f.get("rooms")}%0D%0AEmail: ${f.get("email")}`;
    window.location.href = `mailto:${MAIL}?subject=${encodeURIComponent("AtithiConnect demo request")}&body=${body}`;
    setSent(true);
  }

  const nav = [["#how", "How it works"], ["#features", "Features"], ["#screens", "Screens"], ["#pricing", "Pricing"], ["#faq", "FAQ"]];
  const sc = screens[tab];

  return (
    <div className="mk">
      {/* NAV */}
      <header className={"mk-nav" + (scrolled ? " solid" : "")}>
        <div className="mk-wrap nav-in">
          <a href="#top" className="nav-logo" aria-label="AtithiConnect home">
            <img className="lw" src={`${B}brand/logo-white.png`} alt="AtithiConnect" />
            <img className="lv" src={`${B}brand/logo-violet.png`} alt="" />
          </a>
          <nav className={"nav-links" + (menu ? " open" : "")}>
            {nav.map(([h, l]) => <a key={h} href={h} onClick={() => setMenu(false)}>{l}</a>)}
            <a href="#demo" className="nav-try" onClick={() => setMenu(false)}>Try live demo</a>
          </nav>
          <a href="#contact" className="btn btn-nav">Book a free demo</a>
          <button className="burger" aria-label="Menu" onClick={() => setMenu(!menu)}><span /><span /></button>
        </div>
      </header>

      {/* HERO */}
      <section className="hero" id="top" data-scroll>
        <div className="hero-amb" aria-hidden><i className="b1" /><i className="b2" /><i className="b3" /><span className="sweep" /><span className="grain" /></div>
        <Ribbons />
        <div className="mk-wrap hero-in">
          <div className="hero-copy intro">
            <span className="eyebrow-pill"><i />Guest app for hotels · no download</span>
            <h1 className="split" aria-label="Guests scan a QR. Everything opens on their phone.">{["Guests","scan","a","QR."].map((w, i) => <span className="w" key={w} aria-hidden><span style={{ ["--i" as string]: i }}>{w}</span></span>)}<span className="w" aria-hidden><mark style={{ ["--i" as string]: 4 }}>Everything</mark></span>{["opens","on","their","phone."].map((w, i) => <span className="w" key={w} aria-hidden><span style={{ ["--i" as string]: i + 5 }}>{w}</span></span>)}</h1>
            <p className="hero-sub">Wi‑Fi, room service, towels, cleaning and a chat with reception, all in one simple page. Your staff get every request live on their screen.</p>
            <div className="hero-cta">
              <a href="#contact" className="btn btn-white">Book a free demo {icons.arrow}</a>
              <a href="#demo" className="btn btn-line">Try the live demo</a>
            </div>
            <ul className="hero-ticks">
              <li>{icons.check} Works on any phone</li>
              <li>{icons.check} English + हिंदी</li>
              <li>{icons.check} Nothing to install</li>
            </ul>
          </div>
          <HeroPhone />
        </div>
        <div className="hero-wave" aria-hidden>
          <svg viewBox="0 0 1440 90" preserveAspectRatio="none"><path d="M0 60 C 240 10, 480 10, 720 45 C 960 80, 1200 85, 1440 30 L1440 90 L0 90 Z" /></svg>
        </div>
      </section>

      {/* PROBLEM */}
      <section className="problem">
        <div className="mk-wrap">
          <h2 className="rv">Every hotel day runs on <mark className="mv">small requests.</mark></h2>
          <div className="prob-row rv">
            {["Calls to reception nobody picks up", "Paper menus and lost order slips", "Rooms nobody updated"].map((t) => (
              <div key={t} className="prob-pill"><span className="x">×</span>{t}</div>
            ))}
          </div>
          <p className="prob-end rv">Then <img src={`${B}brand/logo-violet.png`} alt="AtithiConnect" /> steps in: one system connecting guests, front desk, kitchen and owner.</p>
        </div>
      </section>

      {/* FACTS */}
      <section className="facts">
        <div className="mk-wrap facts-row" data-stagger>
          {[
            [1, "QR card", "in every room"],
            [0, "apps", "for guests to install"],
            [4, "live screens", "guest, desk, kitchen, owner"],
            [2, "languages", "English and हिंदी"],
          ].map(([n, k, d]) => (
            <div className="fact mo" key={String(k)}>
              <b data-count={n}>0</b>
              <span>{k}</span>
              <small>{d}</small>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="how" id="how">
        <div className="mk-wrap">
          <div className="sec-head rv">
            <span className="kick">How it works</span>
            <h2>Three steps. That's it.</h2>
            <p>Your guest doesn't learn anything new, and neither does your staff.</p>
          </div>
          <div className="steps3 mo" data-stagger><span className="steps-line" aria-hidden />
            <div className="step3 rv">
              <div className="s-num">1</div>
              <div className="s-vis v1">
                <div className="qr-card"><div className="qr-ic">{icons.qr}</div><b>Scan for room service</b><small>Room 101 · Wi‑Fi · Requests</small></div>
              </div>
              <h3>Guest scans the QR</h3>
              <p>A small QR card sits in every room. The phone camera opens AtithiConnect in a second.</p>
            </div>
            <div className="step3 rv">
              <div className="s-num">2</div>
              <div className="s-vis v2">
                <div className="mini-tiles">
                  <span>{icons.towel}Extra towels</span><span className="on">{icons.food}Masala chai ×2</span><span>{icons.chat}Chat</span>
                </div>
              </div>
              <h3>Guest asks or orders</h3>
              <p>Towels, food, cleaning or a question for reception, with one tap and no phone call.</p>
            </div>
            <div className="step3 rv">
              <div className="s-num">3</div>
              <div className="s-vis v3">
                <div className="ticket-mini">
                  <small>LIVE · RECEPTION</small><b>Room 101 · Extra towels</b>
                  <div className="tm-flow"><span>Pending</span>{icons.arrow}<span>Accepted</span>{icons.arrow}<span className="done">Done</span></div>
                </div>
              </div>
              <h3>Staff get it live</h3>
              <p>The right team sees it instantly, accepts it and marks it done. The guest sees the update too.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SEE IT IN ACTION */}
      <section className="action" id="video">
        <div className="mk-wrap">
          <div className="sec-head rv">
            <span className="kick">See it in action</span>
            <h2>One system, connecting guests and your team.</h2>
            <p>A one-minute look at how AtithiConnect turns every guest request into a live task for the right team.</p>
          </div>
          <div className="rv"><DemoVideo /></div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="features" id="features">
        <Ribbons className="soft" />
        <div className="mk-wrap">
          <div className="sec-head light rv">
            <span className="kick">Features</span>
            <h2>Everything a guest needs, <mark>in one place.</mark></h2>
            <p>Built for Indian hotels: simple for guests, quick for staff.</p>
          </div>
          <div className="feat-grid" data-stagger>
            {features.map((f) => (
              <div key={f.t} className="feat rv" data-tilt="5">
                <div className="feat-ic">{icons[f.ic as keyof typeof icons]}</div>
                <h3>{f.t}</h3>
                <p>{f.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHO USES IT */}
      <section className="screens" id="screens">
        <div className="mk-wrap">
          <div className="sec-head rv">
            <span className="kick">Who uses it</span>
            <h2>One system, four simple screens.</h2>
            <p>Everyone in your hotel sees exactly what they need. Nothing more.</p>
          </div>
          <div className="sc-tabs rv" role="tablist">
            {screens.map((s, i) => (
              <button key={s.key} role="tab" aria-selected={tab === i} className={tab === i ? "on" : ""} onClick={() => setTab(i)}>
                {icons[s.ic as keyof typeof icons]}{s.who}
              </button>
            ))}
          </div>
          <div className="sc-body rv in" key={sc.key}>
            <div className="sc-copy">
              <span className="kick">{sc.who}</span>
              <h3>{sc.t}</h3>
              <p>{sc.d}</p>
              <ul>{sc.pts.map((p) => <li key={p}>{icons.check}{p}</li>)}</ul>
              <Link to={sc.to} className="btn btn-violet">Open the {sc.who.toLowerCase()} screen {icons.arrow}</Link>
            </div>
            <div className={"sc-shot" + (sc.phone ? " is-phone" : "")}>
              {sc.phone ? (
                <div className="mini-phone"><img src={`${B}${sc.img}`} alt={sc.t} loading="lazy" /></div>
              ) : (
                <div className="browser"><div className="br-bar"><i /><i /><i /><span>{sc.t}</span></div><img src={`${B}${sc.img}`} alt={sc.t} loading="lazy" /></div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="benefits">
        <div className="mk-wrap ben-in">
          <div className="sec-head left rv">
            <span className="kick">For hotel owners</span>
            <h2>Happier guests. Calmer staff. <mark className="mv">Clearer numbers.</mark></h2>
            <p>AtithiConnect replaces the room phone, paper menus and WhatsApp chaos with one simple flow you can see from anywhere.</p>
            <a href="#contact" className="btn btn-violet">Book a free demo {icons.arrow}</a>
          </div>
          <div className="ben-list" data-stagger>
            {[
              ["bell", "Fewer calls to reception", "Requests arrive as tickets, so your desk can focus on guests in front of them."],
              ["rupee", "More food orders from rooms", "A menu with photos on every phone makes ordering easy, day and night."],
              ["star", "Better reviews", "Quick replies and nothing forgotten. That's what guests remember."],
              ["chart", "Everything on one dashboard", "Occupancy, open requests, orders and staff speed, live."],
              ["qr", "No new hardware", "QR cards in rooms and the phones or computers you already have."],
            ].map(([ic, t, d]) => (
              <div className="ben rv" key={t}>
                <div className="ben-ic">{icons[ic as keyof typeof icons]}</div>
                <div><h3>{t}</h3><p>{d}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DEMO */}
      <section className="demo" id="demo">
        <Ribbons />
        <div className="mk-wrap">
          <div className="sec-head light rv">
            <span className="kick">Live demo</span>
            <h2>Click through it yourself.</h2>
            <p>A sample hotel with sample guests. Pick a screen and try it. Tip: request towels as the guest, then open Reception to see it arrive.</p>
          </div>
          <div className="demo-grid" data-stagger>
            {[
              ["/guest", "phone", "Guest app", "Room 101 · order food, ask for towels, chat", "Start here"],
              ["/reception", "desk", "Reception desk", "Accept requests and track every room"],
              ["/kitchen", "chef", "Kitchen screen", "New, preparing and ready orders"],
              ["/owner", "chart", "Owner dashboard", "Occupancy, sales, team and settings"],
            ].map(([to, ic, t, d, badge]) => (
              <Link to={to} key={to} className="demo-card rv">
                {badge ? <span className="badge-start">{badge}</span> : null}
                <div className="dc-ic">{icons[ic as keyof typeof icons]}</div>
                <h3>{t}</h3>
                <p>{d}</p>
                <span className="dc-go">Open {icons.arrow}</span>
              </Link>
            ))}
          </div>
          <div className="demo-extra">
            <div className="qr-card rv">
              <img className="qr-img" src={`${B}qr/room-101-qr.png`} alt="QR code that opens the Room 101 guest app" />
              <div>
                <span className="kick dark">Try it on your phone</span>
                <h3>Scan for Room 101</h3>
                <p>Open your phone camera and point it at this code. The guest app opens in the browser. No download, no login. This is the same QR we print on the standee in every room.</p>
                <a className="qr-dl" href={`${B}qr/room-101-standee.png`} download>Download the room standee (print-ready)</a>
              </div>
            </div>
            <div className="apps-card rv">
              <span className="kick dark">Apps for your team</span>
              <h3>Reception and owner get a real app.</h3>
              <p>Install it on the front-desk phone, tablet or computer. It opens full screen from the home screen and alerts on every new request.</p>
              <div className="app-list">
                {[
                  ["/reception", "desk", "AtithiConnect Desk", "Reception & housekeeping"],
                  ["/owner", "owner", "AtithiConnect Owner", "Sales, rooms and team"],
                  ["/kitchen", "kitchen", "AtithiConnect Kitchen", "Food orders, live"],
                ].map(([to, k, n, d]) => (
                  <Link key={to} to={to} className="app-row">
                    <img src={`${B}pwa/${k}-192.png`} alt="" />
                    <div><b>{n}</b><span>{d}</span></div>
                    <span className="app-get">Download app</span>
                  </Link>
                ))}
              </div>
              <p className="apps-note">Android: tap <b>Download app</b> on the app page. iPhone: Share → <b>Add to Home Screen</b>.</p>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <Pricing />

      {/* FAQ */}
      <section className="faq" id="faq">
        <div className="mk-wrap faq-in">
          <div className="sec-head left rv">
            <span className="kick">FAQ</span>
            <h2>Questions hotel owners ask.</h2>
            <p>Anything else? Ask us on the demo call.</p>
          </div>
          <div className="faq-list">
            {faqs.map((f, i) => (
              <div key={f.q} className={"qa" + (open === i ? " open" : "")}>
                <button onClick={() => setOpen(open === i ? null : i)} aria-expanded={open === i}>
                  <span>{f.q}</span><i>{icons.plus}</i>
                </button>
                <div className="qa-a"><p>{f.a}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section className="contact" id="contact">
        <div className="mk-wrap">
          <div className="contact-card rv">
            <Ribbons />
            <div className="cc-copy">
              <span className="kick">Book a free demo</span>
              <h2>See AtithiConnect working for <mark>your hotel.</mark></h2>
              <p>A short online call. We show every screen with your rooms and menu, and answer your questions, including pricing.</p>
              <ul><li>{icons.check} Free, no commitment</li><li>{icons.check} 20 minutes on Google Meet</li><li>{icons.check} Hindi or English</li></ul>
              <ContactButtons variant="light" />
            </div>
            {sent ? (
              <div className="cc-form thanks">
                <div className="th-ic">{icons.check}</div>
                <h3>Thank you!</h3>
                <p>Your email app should open with your details filled in. Press send and we'll reply to set up your demo.</p>
                <p className="small">If it didn't open, write to <a href={`mailto:${MAIL}?subject=AtithiConnect%20demo%20request`}>{MAIL}</a>.</p>
                <button className="btn btn-violet" onClick={() => setSent(false)}>Back to form</button>
              </div>
            ) : (
              <form className="cc-form" onSubmit={submit}>
                <label>Your name<input name="name" required placeholder="e.g. Rohit Verma" /></label>
                <label>Hotel name<input name="hotel" required placeholder="e.g. Hotel Shree Palace" /></label>
                <div className="two">
                  <label>City<input name="city" required placeholder="e.g. Indore" /></label>
                  <label>Rooms<select name="rooms" defaultValue="11–30"><option>1–10</option><option>11–30</option><option>31–60</option><option>60+</option></select></label>
                </div>
                <label>Email<input name="email" type="email" required placeholder="you@hotel.com" /></label>
                <button className="btn btn-violet full" type="submit">Book my free demo {icons.arrow}</button>
                <small className="fine">We only use this to arrange your demo.</small>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="mk-foot">
        <div className="mk-wrap foot-in">
          <div>
            <img src={`${B}brand/logo-white.png`} alt="AtithiConnect" className="foot-logo" />
            <p>Connect guest services with hotel operations.</p>
            <div className="foot-contact"><ContactButtons variant="light" /></div>
          </div>
          <div className="foot-links">
            <a href="#how">How it works</a><a href="#features">Features</a><a href="#demo">Live demo</a><a href="#pricing">Pricing</a><a href="#contact">Book a demo</a>
          </div>
        </div>
        <div className="mk-wrap foot-base"><span>© 2026 AtithiConnect</span><span>Demo uses a sample hotel and sample guests.</span></div>
      </footer>
      <WhatsAppFab />
    </div>
  );
}

function DemoVideo() {
  const ref = useRef<HTMLVideoElement>(null);
  const [lite] = useState(isLite);
  const [muted, setMuted] = useState(true);
  useEffect(() => {
    const v = ref.current;
    if (!v || lite || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) v.play().catch(() => {});
      else v.pause();
    }, { threshold: 0.45 });
    io.observe(v);
    return () => io.disconnect();
  }, []);
  function toggle() {
    const v = ref.current; if (!v) return;
    v.muted = !v.muted; setMuted(v.muted);
    if (!v.muted) v.play().catch(() => {});
  }
  return (
    <>
      <div className="vid-frame" data-scroll>
        <video ref={ref} src={`${B}video/atithiconnect-promo.mp4`} poster={`${B}video/atithiconnect-promo-poster.jpg`}
          muted={!lite} loop playsInline controls preload={lite ? "none" : "metadata"} onVolumeChange={(e) => setMuted(e.currentTarget.muted)}
          aria-label="AtithiConnect promo video" />
        {muted && !lite ? (
          <button className="vid-sound" onClick={toggle}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 5 6 9H3v6h3l5 4V5z" /><path d="M16 9a4 4 0 0 1 0 6M19 6a8 8 0 0 1 0 12" /></svg>
            Tap for sound
          </button>
        ) : null}
      </div>
      <div className="vid-cap">AtithiConnect · product film · 55 sec</div>
    </>
  );
}
