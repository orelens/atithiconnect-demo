import { useState } from "react";
import { HOTEL, type Order, type OrderStatus } from "../data";
import { ago, useDemo } from "../store";

export default function Kitchen() {
  const { orders, setOrderStatus, flash } = useDemo();
  const [armed, setArmed] = useState(false);
  const cols: { key: OrderStatus; title: string }[] = [
    { key: "new", title: "New" },
    { key: "preparing", title: "Preparing" },
    { key: "ready", title: "Ready" },
  ];

  function arm() {
    if (!armed) { setArmed(true); flash("New-order sound is armed"); }
  }

  function next(o: Order) {
    if (o.status === "new") setOrderStatus(o.id, "preparing");
    else if (o.status === "preparing") setOrderStatus(o.id, "ready");
    else if (o.status === "ready") setOrderStatus(o.id, "served");
  }

  const action: Record<string, string> = { new: "Start preparing", preparing: "Mark ready", ready: "Served" };

  return (
    <div className="kitchen" onClick={arm}>
      <header className="kitch-head">
        <div>
          <img className="app-logo" src={`${import.meta.env.BASE_URL}brand/logo-white.png`} alt="AtithiConnect" />
          <h1 className="head-title">Kitchen display</h1>
          <div className="head-sub">{HOTEL} · new food orders appear here</div>
        </div>
        <div className="head-actions" style={{ marginTop: 8 }}>
          <span className={"pill" + (armed ? " live dot" : "")}>{armed ? "Sound on" : "Tap to turn sound on"}</span>
        </div>
      </header>
      <div className="k-cols">
        {cols.map((c) => {
          const list = orders.filter((o) => o.status === c.key);
          return (
            <div key={c.key} className="k-col">
              <h2><span className="k-count">{list.length}</span>{c.title}</h2>
              {list.map((o) => (
                <article key={o.id} className="k-card">
                  <div className="k-meta">#{o.id} · {ago(o.agoMin, "en").toUpperCase()}</div>
                  <h3>Room {o.room}</h3>
                  <div className="k-guest">{o.guest}</div>
                  <div className="k-items">
                    {o.items.map((i, idx) => (
                      <div key={idx}>
                        {i.qty} × {i.name}{" "}
                        <span className={"tick" + (i.veg === "nonveg" ? " off" : "")} />
                      </div>
                    ))}
                  </div>
                  {o.note ? <div className="note">Note: {o.note}</div> : null}
                  <button className="btn-dark" onClick={() => next(o)}>{action[o.status]}</button>
                  {o.status !== "ready" ? (
                    <button className="btn-link" onClick={() => setOrderStatus(o.id, "cancelled")}>Cancel order</button>
                  ) : null}
                </article>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
