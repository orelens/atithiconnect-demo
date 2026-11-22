import { useMemo, useState } from "react";
import GuestShell from "../components/GuestShell";
import { dishes, type Dish } from "../data";
import { useDemo } from "../store";

const cats: { id: "all" | Dish["category"]; en: string; hi: string }[] = [
  { id: "all", en: "All", hi: "सभी" },
  { id: "breakfast", en: "Breakfast", hi: "नाश्ता" },
  { id: "starters", en: "Starters", hi: "स्टार्टर" },
  { id: "mains", en: "Mains", hi: "मुख्य" },
  { id: "breads", en: "Breads & rice", hi: "रोटी और चावल" },
  { id: "drinks", en: "Drinks", hi: "पेय" },
  { id: "sweets", en: "Sweets", hi: "मिठाई" },
];

export default function GuestFood() {
  const { lang, setLang, t, cart, addToCart, cartItems, cartTotal, placeOrder } = useDemo();
  const [cat, setCat] = useState<(typeof cats)[number]["id"]>("all");
  const often = dishes.filter((d) => d.often);
  const list = useMemo(() => (cat === "all" ? dishes : dishes.filter((d) => d.category === cat)), [cat]);
  const groups = cat === "all"
    ? cats.filter((c) => c.id !== "all").map((c) => ({ ...c, items: dishes.filter((d) => d.category === c.id) })).filter((g) => g.items.length)
    : [{ ...cats.find((c) => c.id === cat)!, items: list }];

  return (
    <GuestShell>
      <header className="food-hero">
        <img className="bg" src={`${import.meta.env.BASE_URL}images/room.jpg`} alt="" />
        <div className="veil" />
        <div className="inner">
          <div className="g-top">
            <img className="app-logo" src={`${import.meta.env.BASE_URL}brand/logo-white.png`} alt="AtithiConnect" />
            <button className="lang-btn" onClick={() => setLang(lang === "en" ? "hi" : "en")}>{lang === "en" ? "हिंदी" : "EN"}</button>
          </div>
          <h1>{t("Hotel Demo Indore", "होटल डेमो इंदौर")}</h1>
        </div>
      </header>

      <div className="section" style={{ paddingTop: 18, paddingBottom: 0, display: "flex", justifyContent: "space-between", alignItems: "end" }}>
        <h2>{t("Food", "भोजन")}</h2>
      </div>

      <div className="chips">
        {cats.map((c) => (
          <button key={c.id} className={"chip" + (cat === c.id ? " on" : "")} onClick={() => setCat(c.id)}>
            {lang === "hi" ? c.hi : c.en}
          </button>
        ))}
      </div>

      {cat === "all" ? (
        <>
          <div className="food-sec-k">{t("OFTEN ORDERED", "अक्सर ऑर्डर किए गए")}</div>
          <div className="often">
            {often.map((d) => (
              <button key={d.id} className="often-card" onClick={() => addToCart(d.id)}>
                <img src={d.image} alt={d.name} />
                <p>{lang === "hi" ? d.nameHi : d.name}<span className="pr">₹{d.price}</span></p>
              </button>
            ))}
          </div>
        </>
      ) : null}

      {groups.map((g) => (
        <div key={g.id}>
          <div className="food-sec-k" style={{ paddingTop: 6 }}>{lang === "hi" ? g.hi : g.en}</div>
          {g.items.map((d) => (
            <article key={d.id} className="dish">
              <img src={d.image} alt="" />
              <div>
                <h3>
                  {lang === "hi" ? d.nameHi : d.name}
                  <span className={d.veg === "veg" ? "veg" : "nonveg"} />
                </h3>
                <p>{lang === "hi" ? d.descHi : d.desc}</p>
                {cart[d.id] ? (
                  <div className="qty">
                    <button onClick={() => addToCart(d.id, -1)} aria-label="less">−</button>
                    <span>{cart[d.id]}</span>
                    <button onClick={() => addToCart(d.id, 1)} aria-label="more">+</button>
                  </div>
                ) : (
                  <button className="add-btn" onClick={() => addToCart(d.id)}>{t("Add", "जोड़ें")}</button>
                )}
              </div>
              <div className="pr">₹{d.price}</div>
            </article>
          ))}
        </div>
      ))}
      <div style={{ height: cartItems.length ? 80 : 16 }} />
      {cartItems.length ? (
        <div className="cartbar">
          <div>
            <div style={{ fontSize: 13, opacity: 0.75 }}>{cartItems.reduce((s, i) => s + i.qty, 0)} {t("items", "आइटम")}</div>
            <div style={{ fontWeight: 650 }}>₹{cartTotal}</div>
          </div>
          <button onClick={() => placeOrder()}>{t("Place order", "ऑर्डर करें")}</button>
        </div>
      ) : null}
    </GuestShell>
  );
}
