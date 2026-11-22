import { NavLink, useLocation } from "react-router-dom";
import { IconBell, IconChat, IconFood, IconHome, IconMore } from "./Icons";
import { useDemo } from "../store";

const tabs = [
  { to: "/guest", icon: IconHome, en: "Home", hi: "होम", end: true },
  { to: "/guest/food", icon: IconFood, en: "Food", hi: "भोजन" },
  { to: "/guest/requests", icon: IconBell, en: "Requests", hi: "अनुरोध" },
  { to: "/guest/chat", icon: IconChat, en: "Chat", hi: "चैट" },
  { to: "/guest/more", icon: IconMore, en: "More", hi: "और" },
];

const heads: Record<string, { en: string; hi: string; sen: string; shi: string }> = {
  "/guest/requests": { en: "Requests", hi: "अनुरोध", sen: "One tap and the right team gets it. Track it here.", shi: "एक टैप में सही टीम तक। यहाँ स्थिति देखें।" },
  "/guest/chat": { en: "Chat with reception", hi: "रिसेप्शन से चैट", sen: "Type a message. The front desk replies here.", shi: "संदेश लिखें, डेस्क यहीं जवाब देगा।" },
  "/guest/more": { en: "My stay", hi: "मेरा ठहराव", sen: "Wi‑Fi, your bill so far and places nearby.", shi: "वाई-फाई, अब तक का बिल और आस-पास की जगहें।" },
};

export default function GuestShell({ children }: { children: React.ReactNode }) {
  const { lang } = useDemo();
  const loc = useLocation();
  const head = heads[loc.pathname.replace(/\/$/, "")];
  return (
    <div className="g-page">
      {head ? (
        <header className="g-subhead">
          <div className="g-top">
            <img className="app-logo" src={`${import.meta.env.BASE_URL}brand/logo-white.png`} alt="AtithiConnect" />
            <span className="room-pill">ROOM 101</span>
          </div>
          <h1>{lang === "hi" ? head.hi : head.en}</h1>
          <p>{lang === "hi" ? head.shi : head.sen}</p>
        </header>
      ) : null}
      {children}
      <nav className="tabbar">
        {tabs.map((t) => {
          const on = t.end ? loc.pathname === "/guest" : loc.pathname.startsWith(t.to);
          return (
            <NavLink key={t.to} to={t.to} end={t.end} className={"tab" + (on ? " on" : "")}>
              <t.icon />
              {lang === "hi" ? t.hi : t.en}
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
}
