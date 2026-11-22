import { useEffect, useState } from "react";
import { APPS, type AppKey, canPrompt, isIOS, isStandalone, onInstallChange, promptInstall } from "../pwa";

/** "Download app" button for the staff apps. Android/desktop Chrome: real install prompt. iPhone: Add to Home Screen steps. */
export default function InstallApp({ app, variant = "light" }: { app: AppKey; variant?: "light" | "solid" }) {
  const [, force] = useState(0);
  const [help, setHelp] = useState(false);
  const [done, setDone] = useState(false);
  useEffect(() => onInstallChange(() => force((n) => n + 1)), []);
  if (isStandalone()) return null;
  const a = APPS[app];

  async function click(e: React.MouseEvent) {
    e.stopPropagation();
    if (canPrompt()) {
      const ok = await promptInstall();
      if (ok) setDone(true);
    } else setHelp(true);
  }

  return (
    <>
      <button className={"install-btn " + variant} onClick={click}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 4v11M7 10l5 5 5-5M5 20h14" /></svg>
        {done ? "Installed" : "Download app"}
      </button>
      {help ? (
        <div className="sheet-wrap" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
          <button className="sheet-scrim" aria-label="Close" onClick={() => setHelp(false)} />
          <div className="sheet install-sheet">
            <div className="sheet-grab" />
            <div className="sheet-head">
              <img className="inst-icon" src={a.icon} alt="" />
              <div>
                <div className="sheet-k">INSTALL THE APP</div>
                <h3 className="sheet-title">{a.name}</h3>
              </div>
            </div>
            {isIOS() ? (
              <ol className="inst-steps">
                <li>Open this page in <b>Safari</b>.</li>
                <li>Tap <b>Share</b> <span className="ios-share">⬆︎</span> at the bottom of the screen.</li>
                <li>Choose <b>Add to Home Screen</b>, then <b>Add</b>.</li>
                <li>Open <b>{a.name.replace("AtithiConnect ", "Atithi ")}</b> from your home screen. It runs full screen, like any app.</li>
              </ol>
            ) : (
              <ol className="inst-steps">
                <li>Open this page in <b>Chrome</b> on Android, or Chrome / Edge on a computer.</li>
                <li>Tap the <b>⋮ menu</b>, then <b>Install app</b> (or <b>Add to Home screen</b>).</li>
                <li>Open <b>{a.name}</b> from your home screen or desktop. It opens full screen, without the browser bar.</li>
              </ol>
            )}
            <p className="inst-note">Guests never install anything. They only scan the room QR.</p>
            <button className="sheet-cta" onClick={() => setHelp(false)}>Got it</button>
          </div>
        </div>
      ) : null}
    </>
  );
}
