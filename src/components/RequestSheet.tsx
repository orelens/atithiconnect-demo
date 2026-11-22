import { useEffect, useState } from "react";
import { GUEST, requests as reqMeta } from "../data";
import { useDemo } from "../store";
import { IconClean, IconLuggage, IconRepair, IconTowels, IconWake, IconWater } from "./Icons";

export const reqIcons: Record<string, typeof IconTowels> = {
  towels: IconTowels, cleaning: IconClean, luggage: IconLuggage,
  wakeup: IconWake, water: IconWater, repair: IconRepair,
};

type Meta = (typeof reqMeta)[number];

const qtyConf: Record<string, { en: string; hi: string; max: number; def: number }> = {
  towels: { en: "bath towel", hi: "बाथ तौलिया", max: 4, def: 2 },
  water: { en: "bottle", hi: "बोतल", max: 4, def: 2 },
  luggage: { en: "bag", hi: "बैग", max: 4, def: 2 },
};

const hints: Record<string, [string, string]> = {
  towels: ["e.g. one hand towel too", "जैसे एक हैंड टॉवल भी"],
  cleaning: ["e.g. after 3 pm is fine", "जैसे 3 बजे के बाद ठीक है"],
  luggage: ["e.g. to the car at 10 am", "जैसे 10 बजे गाड़ी तक"],
  wakeup: ["e.g. 6:30 am, please", "जैसे सुबह 6:30 बजे"],
  water: ["e.g. one cold bottle", "जैसे एक ठंडी बोतल"],
  repair: ["e.g. AC is not cooling", "जैसे एसी ठंडा नहीं कर रहा"],
};

/** Bottom sheet: pick item -> review qty / note -> Confirm request -> sent. */
export default function RequestSheet({ item, onClose }: { item: Meta | null; onClose: () => void }) {
  const { lang, t, addRequest, tickets } = useDemo();
  const [qty, setQty] = useState(2);
  const [note, setNote] = useState("");
  const [sentId, setSentId] = useState<string | null>(null);

  useEffect(() => {
    if (item) {
      setQty(qtyConf[item.id]?.def ?? 1);
      setNote("");
      setSentId(null);
    }
  }, [item]);

  if (!item) return null;
  const Icon = reqIcons[item.icon];
  const q = qtyConf[item.id];
  const sent = sentId ? tickets.find((x) => x.id === sentId) : null;

  function confirm() {
    if (!item) return;
    let detail = item.detail, detailHi = item.detailHi;
    if (q) {
      detail = `${qty} ${q.en}${qty > 1 ? (q.en.endsWith("s") ? "es" : "s") : ""}`;
      detailHi = `${qty} ${q.hi}`;
    }
    if (note.trim()) { detail += ` · ${note.trim()}`; detailHi += ` · ${note.trim()}`; }
    const id = addRequest({
      room: GUEST.room, title: item.title, titleHi: item.titleHi, guest: GUEST.name,
      department: item.department, detail, detailHi,
    });
    setSentId(id);
  }

  return (
    <div className="sheet-wrap" role="dialog" aria-modal="true" aria-label={t("Confirm request", "अनुरोध पक्का करें")}>
      <button className="sheet-scrim" aria-label={t("Close", "बंद करें")} onClick={onClose} />
      <div className="sheet">
        <div className="sheet-grab" />
        {!sent ? (
          <>
            <div className="sheet-head">
              <div className="sheet-ic"><Icon /></div>
              <div>
                <div className="sheet-k">{t("ROOM 101 · ASK THE TEAM", "कमरा 101 · टीम से कहें")}</div>
                <h3 className="sheet-title">{lang === "hi" ? item.titleHi : item.title}</h3>
              </div>
            </div>
            {q ? (
              <div className="sheet-row">
                <div className="sheet-label">{t("How many?", "कितने?")}</div>
                <div className="qty-pick">
                  {Array.from({ length: q.max }, (_, i) => i + 1).map((n) => (
                    <button key={n} className={"qp" + (qty === n ? " on" : "")} onClick={() => setQty(n)}>{n}</button>
                  ))}
                </div>
              </div>
            ) : null}
            <div className="sheet-row">
              <div className="sheet-label">{t("Note for the team", "टीम के लिए नोट")} <span>{t("(optional)", "(वैकल्पिक)")}</span></div>
              <input className="sheet-input" value={note} onChange={(e) => setNote(e.target.value)} placeholder={hints[item.id]?.[lang === "hi" ? 1 : 0] || ""} />
            </div>
            <div className="sheet-sum">
              {t("Goes to", "जाएगा")} <b>{item.department === "housekeeping" ? t("Housekeeping", "हाउसकीपिंग") : item.department === "maintenance" ? t("Maintenance", "मेंटेनेंस") : t("Reception", "रिसेप्शन")}</b> {t("· usually accepted in a few minutes", "· आमतौर पर कुछ मिनट में स्वीकार")}
            </div>
            <button className="sheet-cta" onClick={confirm}>{t("Confirm request", "अनुरोध पक्का करें")}</button>
            <button className="sheet-cancel" onClick={onClose}>{t("Cancel", "रद्द करें")}</button>
          </>
        ) : (
          <div className="sheet-done">
            <div className="done-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg></div>
            <h3 className="sheet-title">{t("Request sent", "अनुरोध भेज दिया")}</h3>
            <p className="sheet-p">{t("Reception will accept shortly.", "रिसेप्शन जल्द ही स्वीकार करेगा।")}</p>
            <div className="sent-card">
              <div className="sent-name">{lang === "hi" ? sent.titleHi : sent.title}</div>
              <div className="sent-det">{lang === "hi" ? sent.detailHi : sent.detail}</div>
              <StatusSteps status={sent.status} />
            </div>
            <button className="sheet-cta" onClick={onClose}>{t("Done", "ठीक है")}</button>
          </div>
        )}
      </div>
    </div>
  );
}

export function StatusSteps({ status }: { status: string }) {
  const { t } = useDemo();
  const order = ["pending", "accepted", "done"];
  const cur = status === "progress" ? 1 : Math.max(0, order.indexOf(status));
  const labels: [string, string][] = [["Pending", "लंबित"], ["Accepted", "स्वीकृत"], ["Done", "हो गया"]];
  return (
    <div className="rsteps" aria-label="Request status">
      {labels.map((l, i) => (
        <div key={i} className={"rstep" + (i <= cur ? " on" : "") + (i === cur ? " cur" : "")}>
          <span className="rdot">{i < cur || (i === cur && i === 2) ? "✓" : i + 1}</span>
          <span className="rsl">{t(l[0], l[1])}</span>
          {i < 2 ? <span className={"rbar" + (i < cur ? " on" : "")} /> : null}
        </div>
      ))}
    </div>
  );
}
