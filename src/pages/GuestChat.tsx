import { useState } from "react";
import GuestShell from "../components/GuestShell";
import { useDemo } from "../store";

const seed = [
  { who: "desk" as const, en: "Good afternoon, Ms. Sharma. Reception is here if you need anything at all.", hi: "नमस्कार, सुश्री शर्मा। रिसेप्शन यहाँ है, कुछ चाहिए तो बताइए।" },
  { who: "guest" as const, en: "Thank you. Could someone bring two bottles of water?", hi: "धन्यवाद। क्या दो बोतल पानी आ सकता है?" },
  { who: "desk" as const, en: "Of course. Housekeeping is on the way.", hi: "ज़रूर। हाउसकीपिंग आ रही है।" },
];

export default function GuestChat() {
  const { lang, t, flash } = useDemo();
  const [text, setText] = useState("");
  const [msgs, setMsgs] = useState(seed);

  function send() {
    const v = text.trim();
    if (!v) return;
    setMsgs((m) => [...m, { who: "guest", en: v, hi: v }]);
    setText("");
    window.setTimeout(() => {
      setMsgs((m) => [...m, { who: "desk", en: "Received. The desk will look after this.", hi: "मिल गया। डेस्क इसका ध्यान रखेगी।" }]);
      flash(t("Reception has your message", "रिसेप्शन तक संदेश पहुँच गया"));
    }, 600);
  }

  return (
    <GuestShell>
      <div className="section" style={{ paddingTop: 20 }}>
        
        <p className="empty" style={{ paddingTop: 0 }}>{t("Hotel Demo Indore · Reception", "होटल डेमो इंदौर · रिसेप्शन")}</p>
        <div style={{ display: "grid", gap: 10, marginTop: 8 }}>
          {msgs.map((m, i) => (
            <div key={i} style={{
              justifySelf: m.who === "guest" ? "end" : "start",
              maxWidth: "85%",
              background: m.who === "guest" ? "#5b12f0" : "#fff",
              color: m.who === "guest" ? "#fff" : "var(--ink)",
              border: m.who === "guest" ? "0" : "1px solid var(--line)",
              borderRadius: m.who === "guest" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
              padding: "12px 14px",
              fontSize: 15,
              lineHeight: 1.45,
            }}>
              {lang === "hi" ? m.hi : m.en}
            </div>
          ))}
        </div>
        <form style={{ display: "flex", gap: 8, marginTop: 16 }} onSubmit={(e) => { e.preventDefault(); send(); }}>
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={t("Write to reception", "रिसेप्शन को लिखें")}
            style={{ flex: 1, background: "#fff", border: "1px solid var(--line)", borderRadius: 14, padding: "14px 14px" }}
          />
          <button className="btn-dark" style={{ width: "auto", marginTop: 0, padding: "12px 18px" }} type="submit">{t("Send", "भेजें")}</button>
        </form>
      </div>
    </GuestShell>
  );
}
