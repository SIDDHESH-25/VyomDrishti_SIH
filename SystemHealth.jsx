import Card from "./Card.jsx";
import { Icon } from "../icons.jsx";

export function healthColor(score) {
  if (score >= 80) return "var(--green)";
  if (score >= 50) return "var(--yellow)";
  return "var(--red)";
}

export default function SystemHealth({ health }) {
  const h = health || {};
  const score = Number(h.score ?? 0);
  const max = Number(h.max ?? 100);
  const status = (h.status || (score >= 80 ? "NORMAL" : score >= 50 ? "DEGRADED" : "CRITICAL")).toUpperCase();
  const r = 54;
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(1, score / max));
  const color = healthColor((score / max) * 100);

  return (
    <Card title="System Health" icon={Icon.heart} color="red" className="health">
      <div className="ring-wrap">
        <svg width="136" height="136" viewBox="0 0 136 136">
          <circle cx="68" cy="68" r={r} fill="none" stroke="rgba(255,255,255,.08)" strokeWidth="11" />
          <circle
            cx="68" cy="68" r={r} fill="none" stroke={color} strokeWidth="11" strokeLinecap="round"
            strokeDasharray={c} strokeDashoffset={c * (1 - pct)}
            transform="rotate(-90 68 68)" style={{ transition: "stroke-dashoffset .6s ease" }}
          />
        </svg>
        <div className="ring-center">
          <Icon.heart className="heart" width={16} height={16} />
          <div className="score">{score}<small> /{max}</small></div>
        </div>
      </div>
      <div className={`badge ${status.toLowerCase()}`}>{status}</div>
    </Card>
  );
}
