// Single source for contact details. Every button below renders only if its value is set.
export const CONTACT = {
  email: "graphicdesigner.nikunj@gmail.com",
  phone: "+919617369907",
  phoneLabel: "+91 96173 69907",
  whatsapp: "919617369907",
  waText: "Hi, I want an AtithiConnect demo",
};
export const telHref = () => `tel:${CONTACT.phone}`;
export const waHref = (text = CONTACT.waText) => `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(text)}`;

const PhoneIc = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M5 4h3.5l1.6 4.2-2.2 1.4a11 11 0 0 0 5.5 5.5l1.4-2.2L19 14.5V18a2 2 0 0 1-2 2A15 15 0 0 1 3 6a2 2 0 0 1 2-2z" />
  </svg>
);
export const WaIc = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M12 2.2A9.7 9.7 0 0 0 3.6 16.8L2.3 21.7l5-1.3A9.7 9.7 0 1 0 12 2.2zm0 17.7a8 8 0 0 1-4.1-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8 8 0 1 1 12 19.9zm4.4-6c-.2-.1-1.4-.7-1.7-.8-.2-.1-.4-.1-.5.1l-.8 1c-.1.2-.3.2-.5.1a6.6 6.6 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.5-.4h-.5a.9.9 0 0 0-.6.3 2.7 2.7 0 0 0-.9 2c0 1.2.9 2.4 1 2.5.1.2 1.7 2.6 4.2 3.7 1.6.7 2.2.7 3 .6.5-.1 1.4-.6 1.6-1.1.2-.6.2-1 .1-1.1l-.5-.5z" />
  </svg>
);

/** Call + WhatsApp buttons. variant: "light" on violet backgrounds, "dark" on white. */
export function ContactButtons({ variant = "light", text, compact = false }: { variant?: "light" | "dark"; text?: string; compact?: boolean }) {
  if (!CONTACT.phone && !CONTACT.whatsapp) return null;
  return (
    <div className={`cbtns ${variant}${compact ? " compact" : ""}`}>
      {CONTACT.phone ? (
        <a className="cbtn call" href={telHref()} aria-label={`Call ${CONTACT.phoneLabel}`}><PhoneIc /><span>Call{compact ? "" : <> <b>{CONTACT.phoneLabel}</b></>}</span></a>
      ) : null}
      {CONTACT.whatsapp ? (
        <a className="cbtn wa" href={waHref(text)} target="_blank" rel="noopener" aria-label="Chat on WhatsApp"><WaIc /><span>WhatsApp</span></a>
      ) : null}
    </div>
  );
}

export function WhatsAppFab() {
  if (!CONTACT.whatsapp) return null;
  return <a className="wa-fab" href={waHref()} target="_blank" rel="noopener" aria-label="Chat on WhatsApp"><WaIc /></a>;
}
