import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { dishes, feedback, nearby, rooms, STAFF, WIFI } from "../data";
import { useDemo } from "../store";

const tabs = ["Overview", "Menu", "Wi-Fi & info", "Nearby", "Team", "Rooms & QR"] as const;

export default function Owner() {
  const { tickets, orders } = useDemo();
  const [tab, setTab] = useState<(typeof tabs)[number]>("Overview");
  const occ = rooms.filter((r) => r.status === "occupied").length;
  const cleaning = rooms.filter((r) => r.status === "cleaning").length;
  const ready = rooms.filter((r) => r.status === "ready").length;
  const foodTotal = 1715;
  const openOrders = orders.filter((o) => o.status === "new" || o.status === "preparing" || o.status === "ready").length;

  const team = useMemo(() => [
    { name: STAFF.kitchen, role: "kitchen", done: tickets.filter((t) => false).length + orders.filter((o) => o.status === "served" || o.status === "ready" || o.status === "preparing").length, bar: 70, extra: "2 done" },
    { name: STAFF.reception, role: "reception", done: 1, bar: 40, extra: "1 done · 40 min" },
    { name: STAFF.housekeeping, role: "housekeeping", done: 1, bar: 35, extra: "1 done · 30 min" },
    { name: STAFF.owner, role: "owner", done: 0, bar: 4, extra: "0 done" },
  ], [tickets, orders]);

  return (
    <div className="staff-page">
      <header className="owner-head">
        <div style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
          <div>
            <div className="kicker">ATITHI</div>
            <h1 className="head-title">The house</h1>
            <div className="head-sub">Hotel Demo Indore · {STAFF.owner}</div>
          </div>
          <div className="head-actions">
            <Link to="/reception" className="pill">Desk</Link>
            <Link to="/" className="pill">Out</Link>
          </div>
        </div>
      </header>
      <div className="tabs">
        {tabs.map((t) => (
          <button key={t} className={"tab-btn" + (tab === t ? " on" : "")} onClick={() => setTab(t)}>{t}</button>
        ))}
      </div>

      <div className="owner-body">
        {tab === "Overview" && (
          <>
            <div className="stats">
              <article className="stat">
                <div className="stat-k">OCCUPANCY</div>
                <div className="ring-wrap">
                  <Ring value={occ / rooms.length} />
                  <div>
                    <div className="stat-v">{occ}/{rooms.length}</div>
                    <div className="stat-s">{ready} ready · {cleaning} cleaning</div>
                  </div>
                </div>
              </article>
              <article className="stat">
                <div className="stat-k">ROOM REVENUE</div>
                <div className="stat-v">₹53,600</div>
                <div className="stat-s">On the books, demo rates</div>
              </article>
              <article className="stat">
                <div className="stat-k">FOOD</div>
                <div className="stat-v">₹{foodTotal.toLocaleString("en-IN")}</div>
                <div className="stat-s">{orders.length} orders in 24h · {openOrders} open</div>
              </article>
              <article className="stat">
                <div className="stat-k">RESPONSE</div>
                <div className="stat-v">10.5 min</div>
                <div className="stat-s">Done in 35 min avg</div>
              </article>
            </div>
            <div className="owner-two">
              <article className="panel">
                <h3>Team</h3>
                {team.map((m) => (
                  <div key={m.name} className="team-row">
                    <div><span className="team-name">{m.name}</span><span className="team-role">{m.role}</span></div>
                    <div className="meta" style={{ color: "var(--muted)", fontSize: 13 }}>{m.extra}</div>
                    <div className="bar"><span style={{ width: m.bar + "%" }} /></div>
                  </div>
                ))}
              </article>
              <article className="panel">
                <h3>Feedback · 4.5</h3>
                {feedback.map((f) => (
                  <div key={f.who} className="fb">
                    <div className="fb-who">{f.who} · Room {f.room} · {f.score}/5</div>
                    <div className="fb-t">{f.text}</div>
                    <div className="fb-ago">{f.ago}</div>
                  </div>
                ))}
              </article>
            </div>
          </>
        )}

        {tab === "Menu" && (
          <article className="panel">
            <h3>The house menu</h3>
            {dishes.map((d) => (
              <div key={d.id} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid var(--line)" }}>
                <div>
                  <div style={{ fontWeight: 600 }}>{d.name} {d.veg === "veg" ? "· veg" : "· non-veg"}</div>
                  <div className="order-items">{d.desc}</div>
                </div>
                <div style={{ fontWeight: 650 }}>₹{d.price}</div>
              </div>
            ))}
          </article>
        )}

        {tab === "Wi-Fi & info" && (
          <article className="panel">
            <h3>Guest Wi-Fi</h3>
            <div className="stat-k">NETWORK</div>
            <div className="stat-v">{WIFI.network}</div>
            <div className="stat-k" style={{ marginTop: 16 }}>PASSWORD</div>
            <div className="stat-v">{WIFI.password}</div>
            <p className="order-items" style={{ marginTop: 16 }}>Shown in every open stay. Change it from the live product, not this demo.</p>
          </article>
        )}

        {tab === "Nearby" && (
          <article className="panel">
            <h3>Places to send a guest</h3>
            {nearby.map((n) => (
              <div key={n.name} style={{ padding: "12px 0", borderBottom: "1px solid var(--line)" }}>
                <div style={{ fontFamily: "var(--serif)", fontSize: 24 }}>{n.name}</div>
                <div className="order-items">{n.walk}</div>
              </div>
            ))}
          </article>
        )}

        {tab === "Team" && (
          <article className="panel">
            <h3>The people on shift</h3>
            {team.map((m) => (
              <div key={m.name} style={{ padding: "12px 0", borderBottom: "1px solid var(--line)" }}>
                <div style={{ fontWeight: 600 }}>{m.name}</div>
                <div className="order-items">{m.role} · {m.extra}</div>
              </div>
            ))}
          </article>
        )}

        {tab === "Rooms & QR" && (
          <div className="ticket-grid">
            {rooms.map((r) => (
              <article key={r.room} className="ticket" style={{ textAlign: "center" }}>
                <div className="t-room">ROOM {r.room}</div>
                <div style={{ display: "grid", placeItems: "center", padding: 12 }}>
                  <Qr label={`atithi://stay/${r.room}`} />
                </div>
                <h3 style={{ fontSize: 22 }}>{r.guest || "Ready"}</h3>
                <div className="meta">{r.status}</div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Ring({ value }: { value: number }) {
  const r = 22, c = 2 * Math.PI * r, off = c * (1 - value);
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" aria-hidden>
      <circle cx="32" cy="32" r={r} fill="none" stroke="#efe8de" strokeWidth="8" />
      <circle cx="32" cy="32" r={r} fill="none" stroke="#8a6a45" strokeWidth="8" strokeDasharray={`${c} ${c}`} strokeDashoffset={off} strokeLinecap="round" transform="rotate(-90 32 32)" />
      <text x="32" y="36" textAnchor="middle" fontSize="11" fill="#7a736c">{Math.round(value * 100)}%</text>
    </svg>
  );
}

function Qr({ label }: { label: string }) {
  // Decorative demo QR — not a phone number, just a room mark.
  const cells = 11;
  const bits = Array.from(label).map((ch, i) => (ch.charCodeAt(0) * (i + 3)) % 2);
  return (
    <svg width="120" height="120" viewBox={`0 0 ${cells} ${cells}`} style={{ background: "#fff", borderRadius: 8, border: "1px solid var(--line)" }}>
      {Array.from({ length: cells * cells }, (_, i) => {
        const x = i % cells, y = Math.floor(i / cells);
        const finder = (x < 3 && y < 3) || (x > cells - 4 && y < 3) || (x < 3 && y > cells - 4);
        const on = finder || bits[(x * 7 + y * 3) % bits.length];
        return on ? <rect key={i} x={x} y={y} width="1" height="1" fill="#1a1714" /> : null;
      })}
    </svg>
  );
}
