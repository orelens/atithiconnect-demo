import { Link } from "react-router-dom";

export default function StaffLogin() {
  return (
    <div className="login">
      <div className="login-card">
        <img src={`${import.meta.env.BASE_URL}brand/logo-violet.png`} alt="AtithiConnect" style={{height:28,margin:"0 auto 8px"}} />
        <h1>Staff login</h1>
        <p>Hotel Demo Indore · a walk-through, no password required.</p>
        <div className="role-list">
          <Link to="/reception"><span className="btn-title">Reception</span><span className="btn-sub">Meera Nair · tickets, rooms, chat, desk</span></Link>
          <Link to="/kitchen"><span className="btn-title">Kitchen</span><span className="btn-sub">Imran Qureshi · the display for new orders</span></Link>
          <Link to="/owner"><span className="btn-title">Owner</span><span className="btn-sub">Arjun Malhotra · occupancy, menu, Wi-Fi, QR</span></Link>
        </div>
        <p style={{ marginTop: 22 }}><Link to="/" style={{ color: "var(--muted)" }}>← Back to website</Link></p>
      </div>
    </div>
  );
}
