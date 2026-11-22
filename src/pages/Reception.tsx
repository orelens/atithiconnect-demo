import { useMemo, useState, type CSSProperties } from "react";
import { rooms, STAFF, type TicketStatus } from "../data";
import { ago, useDemo } from "../store";

const tabs = ["Tickets", "Rooms", "Chat", "Desk"] as const;

export default function Reception() {
  const { lang, tickets, setTicketStatus, flash } = useDemo();
  const [tab, setTab] = useState<(typeof tabs)[number]>("Tickets");
  const [armed, setArmed] = useState(false);
  const open = tickets.filter((t) => t.status !== "done").length;

  function act(id: string, status: TicketStatus) {
    setTicketStatus(id, status);
  }

  function arm() {
    if (!armed) {
      setArmed(true);
      flash("Request sound is armed");
    }
  }

  const chat = useMemo(() => [
    { room: "101", guest: "Priya Sharma", preview: "Could someone bring two bottles of water?", unread: 1 },
  ], []);

  return (
    <div className="staff-page" onClick={arm}>
      <header className="desk-head">
        <img className="app-logo" src={`${import.meta.env.BASE_URL}brand/logo-white.png`} alt="AtithiConnect" />
        <div style={{ display: "flex", justifyContent: "space-between", gap: 16, alignItems: "flex-start", flexWrap: "wrap" }}>
          <div>
            <h1 className="head-title">Reception desk</h1>
            <div className="head-sub">Hotel Demo Indore · {STAFF.reception}</div>
            <div className="head-note">Every guest request lands here. Accept it, start it, mark it done.</div>
          </div>
          <div className="head-actions">
            <span className={"pill" + (armed ? " live dot" : "")}>{armed ? "Live" : "Sound off"}</span>
            <span className="pill">Alerts</span>
          </div>
        </div>
      </header>
      <div className="tabs">
        {tabs.map((t) => (
          <button key={t} className={"tab-btn" + (tab === t ? " on" : "")} onClick={() => setTab(t)}>
            {t === "Tickets" ? `${t} ${open}` : t === "Chat" ? "Chat 1" : t}
          </button>
        ))}
      </div>

      {tab === "Tickets" && (
        <div className="ticket-grid">
          {tickets.map((t) => (
            <article key={t.id} className="ticket">
              <div className="t-top">
                <div className="t-room">ROOM {t.room}</div>
                <span className={"badge " + t.status}>{label(t.status)}</span>
              </div>
              <h3>{t.title}</h3>
              <div className="meta">{t.guest} · {ago(t.agoMin, lang)} · {t.department}</div>
              <div className="detail">{t.detail}</div>
              {t.status === "pending" && <button className="btn-dark" onClick={() => act(t.id, "accepted")}>Accept</button>}
              {t.status === "accepted" && <button className="btn-dark" onClick={() => act(t.id, "progress")}>Start</button>}
              {t.status === "progress" && <button className="btn-dark" onClick={() => act(t.id, "done")}>Mark done</button>}
            </article>
          ))}
        </div>
      )}

      {tab === "Rooms" && (
        <div className="ticket-grid">
          {rooms.map((r) => (
            <article key={r.room} className="ticket">
              <div className="t-top">
                <div className="t-room">ROOM {r.room}</div>
                <span className={"badge " + (r.status === "occupied" ? "progress" : r.status === "cleaning" ? "pending" : "done")}>{r.status}</span>
              </div>
              <h3>{r.guest || "Ready"}</h3>
              <div className="meta">{r.checkout || "Available for check-in"}</div>
            </article>
          ))}
        </div>
      )}

      {tab === "Chat" && (
        <div className="wrap" style={{ padding: "8px 0 40px" }}>
          {chat.map((c) => (
            <article key={c.room} className="ticket" style={{ marginBottom: 12 }}>
              <div className="t-top">
                <div className="t-room">ROOM {c.room}</div>
                <span className="badge pending">{c.unread} new</span>
              </div>
              <h3>{c.guest}</h3>
              <div className="detail">{c.preview}</div>
            </article>
          ))}
        </div>
      )}

      {tab === "Desk" && (
        <div className="wrap" style={{ padding: "8px 0 40px" }}>
          <article className="ticket">
            <h3>Check a guest in</h3>
            <p className="meta">Name, room, and dates. The door code for this demo stay is 2491 — four digits, not a personal number.</p>
            <form className="role-list" style={{ marginTop: 16 }} onSubmit={(e) => { e.preventDefault(); flash("Guest stay opened — this is a demo"); }}>
              <input required placeholder="Guest name" style={inp} />
              <input required placeholder="Room number" defaultValue="109" style={inp} />
              <input required placeholder="Door code (4 digits)" maxLength={4} style={inp} />
              <button className="btn-dark" type="submit">Open the stay</button>
            </form>
          </article>
        </div>
      )}
    </div>
  );
}

const inp: CSSProperties = { background: "#fff", border: "1px solid var(--line)", borderRadius: 14, padding: "14px 14px", width: "100%" };

function label(s: string) {
  return ({ pending: "Pending", accepted: "Accepted", progress: "In progress", done: "Done" } as Record<string, string>)[s] || s;
}
