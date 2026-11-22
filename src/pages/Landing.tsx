import { Link } from "react-router-dom";
import { greeting } from "../store";
import { GUEST, HOTEL } from "../data";

export default function Landing() {
  const greet = greeting("en");
  return (
    <div className="landing">
      <div className="wrap">
        <header className="l-header">
          <div>
            <div className="brand-kicker" lang="hi">अतिथि</div>
            <div className="brand-name">AtithiConnect</div>
          </div>
          <Link to="/staff" className="staff-link">STAFF LOGIN</Link>
        </header>

        <section className="hero-grid">
          <div>
            <div className="eyebrow">FOR THE INDIAN HOTEL DESK</div>
            <h1 className="headline">The room already has a key. It is the guest’s phone.</h1>
            <p className="lede">
              AtithiConnect is the quiet link between a stay and the people who run it. A door QR, four digits, then food, towels, a cab, and the bill — in the browser. No store. No WhatsApp fee.
            </p>
            <p className="hindi-line" lang="hi">मेहमान कमरे से टीम तक।</p>
            <div className="cta-grid">
              <Link to="/guest" className="btn-primary">
                <span className="btn-title">Try as Guest (Room {GUEST.room})</span>
                <span className="btn-sub">Priya Sharma’s stay, already open</span>
              </Link>
              <Link to="/reception" className="btn-ghost">
                <span className="btn-title">Open Reception</span>
                <span className="btn-sub">Tickets, rooms, chat, checkout</span>
              </Link>
              <Link to="/kitchen" className="btn-ghost">
                <span className="btn-title">Open Kitchen</span>
                <span className="btn-sub">The display screen for new orders</span>
              </Link>
              <Link to="/owner" className="btn-ghost">
                <span className="btn-title">Open Owner Dashboard</span>
                <span className="btn-sub">Occupancy, menu, Wi-Fi, QR codes</span>
              </Link>
            </div>
          </div>
          <div className="hero-photo">
            <img src={`${import.meta.env.BASE_URL}images/hotel-hero.jpg`} alt={HOTEL} />
            <div className="hero-glass">
              <div className="k">{HOTEL.toUpperCase()}</div>
              <h3>{greet}, {GUEST.formal}</h3>
              <div className="rk">ROOM {GUEST.room}</div>
            </div>
          </div>
        </section>

        <section className="steps">
          <article className="step">
            <div className="step-n">1</div>
            <h3>Check the guest in</h3>
            <p>Name, room, and dates. The room’s QR is already on the door.</p>
          </article>
          <article className="step">
            <div className="step-n">2</div>
            <h3>They confirm four digits</h3>
            <p>A short door code at reception. Wrong digits do not open the stay.</p>
          </article>
          <article className="step">
            <div className="step-n">3</div>
            <h3>The team hears it</h3>
            <p>Food hits the kitchen screen. Towels hit housekeeping. Chat hits reception.</p>
          </article>
        </section>

        <section className="stay">
          <h2>What a stay can do</h2>
          <div className="stay-grid">
            <article className="stay-card">
              <h3>Breakfast to the room</h3>
              <p>Dosa, poha, chai — the kitchen sees the ticket the moment it is placed.</p>
            </article>
            <article className="stay-card">
              <h3>Towels, water, a cab</h3>
              <p>One tap from the stay. Housekeeping and the desk share the same list.</p>
            </article>
            <article className="stay-card">
              <h3>The bill, already waiting</h3>
              <p>Food and extras settle in the stay. Checkout does not need a paper trail.</p>
            </article>
          </div>
        </section>

        <footer className="foot">
          <span>AtithiConnect · {HOTEL}</span>
          <span>A walk-through demo. Nothing here is billed.</span>
        </footer>
      </div>
    </div>
  );
}
