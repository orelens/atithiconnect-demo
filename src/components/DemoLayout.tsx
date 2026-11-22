import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

const B = import.meta.env.BASE_URL;
const roles = [
  { to: "/guest", key: "guest", label: "Guest app", short: "Guest" },
  { to: "/reception", key: "reception", label: "Reception", short: "Desk" },
  { to: "/kitchen", key: "kitchen", label: "Kitchen", short: "Kitchen" },
  { to: "/owner", key: "owner", label: "Owner", short: "Owner" },
];
const titles: Record<string, string> = {
  guest: "What your guest sees",
  reception: "Front desk screen",
  kitchen: "Kitchen display",
  owner: "Owner dashboard",
  staff: "Staff login",
};

function useWide() {
  const q = "(min-width: 901px)";
  const [wide, setWide] = useState(() => typeof window !== "undefined" && window.matchMedia(q).matches);
  useEffect(() => {
    const m = window.matchMedia(q);
    const f = () => setWide(m.matches);
    m.addEventListener("change", f);
    return () => m.removeEventListener("change", f);
  }, []);
  return wide;
}

export default function DemoLayout() {
  const loc = useLocation();
  const role = loc.pathname.split("/")[1] || "guest";
  const wide = useWide();
  const isGuest = role === "guest";
  useEffect(() => { window.scrollTo(0, 0); }, [role]);

  return (
    <>
      <div className="demobar">
        <Link to="/" className="db-back" aria-label="Back to website">←<span className="l"> Website</span></Link>
        <img className="db-logo" src={`${B}brand/logo-violet.png`} alt="AtithiConnect" />
        <span className="db-tag">LIVE DEMO</span>
        <span className="db-label"><b>{titles[role] || "Demo"}</b> · sample data</span>
        <nav className="db-nav" aria-label="Demo screens">
          {roles.map((r) => (
            <NavLink key={r.key} to={r.to} className={role === r.key ? "on" : ""}><span className="l">{r.label}</span><span className="s">{r.short}</span></NavLink>
          ))}
        </nav>
      </div>
      {isGuest && wide ? (
        <div className="demo-stage">
          <div className="demo-explain">
            <span className="db-tag">GUEST APP · ROOM 101</span>
            <h1>This is what your guest sees after scanning the QR in the room.</h1>
            <p>No app to download. Wi‑Fi, room service, housekeeping and a chat with reception open right in the phone's browser, in English or हिंदी.</p>
            <div className="demo-try">
              <h4>Try it in 30 seconds</h4>
              <ol>
                <li><span>Tap <b>Extra towels</b> on the phone.</span></li>
                <li><span>Open <Link to="/reception">Reception</Link> above. Your request is already waiting.</span></li>
                <li><span>Order a chai from <b>Food</b>, then check the <Link to="/kitchen">Kitchen</Link> screen.</span></li>
              </ol>
            </div>
          </div>
          <div className="phone">
            <div className="phone-screen">
              <div className="phone-notch" />
              <div className="phone-scroll"><Outlet /></div>
            </div>
          </div>
        </div>
      ) : (
        <Outlet />
      )}
    </>
  );
}
