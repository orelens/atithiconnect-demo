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
  const [review, setReview] = useState(false);
  const [note, setNote] = useState("");
  const [placed, setPlaced] = useState<number | null>(null);
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
            <div className="price" style={{ fontWeight: 650 }}>₹{cartTotal}</div>
          </div>
          <button onClick={() => { setNote(""); setPlaced(null); setReview(true); }}>{t("Review order", "ऑर्डर देखें")}</button>
        </div>
      ) : null}
      {review ? (
        <div className="sheet-wrap" role="dialog" aria-modal="true" aria-label={t("Confirm order", "ऑर्डर पक्का करें")}>
          <button className="sheet-scrim" aria-label="Close" onClick={() => setReview(false)} />
          <div className="sheet">
            <div className="sheet-grab" />
            {placed === null ? (
              <>
                <div className="sheet-k">{t("ROOM 101 · ROOM SERVICE", "कमरा 101 · रूम सर्विस")}</div>
                <h3 className="sheet-title" style={{ marginBottom: 12 }}>{t("Your order", "आपका ऑर्डर")}</h3>
                <div className="o-lines">
                  {cartItems.map(({ dish, qty }) => (
                    <div key={dish.id} className="o-line">
                      <img src={dish.image} alt="" />
                      <div className="o-name">{lang === "hi" ? dish.nameHi : dish.name}</div>
                      <div className="qty">
                        <button onClick={() => addToCart(dish.id, -1)} aria-label="less">−</button>
                        <span>{qty}</span>
                        <button onClick={() => addToCart(dish.id, 1)} aria-label="more">+</button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="sheet-row">
                  <div className="sheet-label">{t("Note for the kitchen", "रसोई के लिए नोट")} <span>{t("(optional)", "(वैकल्पिक)")}</span></div>
                  <input className="sheet-input" value={note} onChange={(e) => setNote(e.target.value)} placeholder={t("e.g. less sugar", "जैसे कम चीनी")} />
                </div>
                <div className="sheet-sum price">{t("Total", "कुल")} <b>₹{cartTotal}</b> · {t("added to your room bill", "आपके रूम बिल में जुड़ेगा")}</div>
                <button className="sheet-cta" disabled={!cartItems.length} onClick={() => { const id = placeOrder(note.trim() || undefined); setPlaced(id); }}>{t("Confirm order", "ऑर्डर पक्का करें")}</button>
                <button className="sheet-cancel" onClick={() => setReview(false)}>{t("Cancel", "रद्द करें")}</button>
              </>
            ) : (
              <div className="sheet-done">
                <div className="done-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg></div>
                <h3 className="sheet-title">{t("Order sent to the kitchen", "ऑर्डर रसोई तक पहुँच गया")}</h3>
                <p className="sheet-p">{t(`Order #${placed} · we'll bring it to Room 101.`, `ऑर्डर #${placed} · कमरा 101 में लाएंगे।`)}</p>
                <button className="sheet-cta" onClick={() => setReview(false)}>{t("Done", "ठीक है")}</button>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </GuestShell>
  );
}
