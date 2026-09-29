import { Icon } from "../icons.jsx";

function fmtTime(iso) {
  const d = iso ? new Date(iso) : new Date();
  if (Number.isNaN(d.getTime())) return String(iso);
  const date = d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
  const time = d.toLocaleTimeString("en-GB", { hour12: false });
  return `${date}  ${time}`;
}

export default function TopBar({ header, live }) {
  const h = header || {};
  const loc = h.location || {};
  return (
    <header className="topbar">
      <div>
        <div>
          <h1>{h.title || "HIGH-ALTITUDE ANTI-DRONE SYSTEM"}</h1>
          <div className="sub">{h.subtitle || "Environment-Aware AI Monitoring & Reliable Operation"}</div>
        </div>
      </div>
      <div>
        <Icon.mountain className="ico" width={18} height={18} />
        <div className="kv"><span className="k">Altitude</span><span className="v">{h.altitude_m != null ? `${h.altitude_m.toLocaleString()} m` : "—"}</span></div>
      </div>
      <div>
        <Icon.pin className="ico" width={18} height={18} />
        <div className="kv">
          <span className="k">Location</span>
          <span className="v">{loc.lat != null && loc.lon != null ? `${Number(loc.lat).toFixed(2)}° N, ${Number(loc.lon).toFixed(2)}° E` : "—"}</span>
        </div>
      </div>
      <div>
        <Icon.clock className="ico" width={18} height={18} />
        <div className="kv"><span className="k">Time</span><span className="v">{fmtTime(h.time)}</span></div>
      </div>
      <div className="status">
        <span className="status-dot" style={{ background: live ? "var(--green)" : "var(--yellow)", boxShadow: `0 0 10px ${live ? "var(--green)" : "var(--yellow)"}` }} />
        <div className="kv" style={{ alignItems: "flex-end" }}>
          <span className="v">SYSTEM {h.status || "ONLINE"}</span>
          <span className="mode">Mode: <b>{h.mode || "—"}</b></span>
        </div>
        {!live && <span className="mock-badge" title="Backend at localhost:5000 unreachable — showing mock data">MOCK</span>}
      </div>
    </header>
  );
}
