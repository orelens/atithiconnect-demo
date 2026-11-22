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

export default function GuestShell({ children }: { children: React.ReactNode }) {
  const { lang } = useDemo();
  const loc = useLocation();
  return (
    <div className="g-page">
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
