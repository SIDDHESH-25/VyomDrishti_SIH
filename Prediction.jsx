import Card from "./Card.jsx";
import { Icon } from "../icons.jsx";
import { healthColor } from "./SystemHealth.jsx";

function Spark({ points = [] }) {
  if (!points.length) return null;
  const w = 84, h = 44, pad = 3;
  const min = Math.min(...points), max = Math.max(...points);
  const span = max - min || 1;
  const d = points
    .map((p, i) => {
      const x = pad + (i / (points.length - 1)) * (w - pad * 2);
      const y = h - pad - ((p - min) / span) * (h - pad * 2);
      return `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ background: "rgba(255,255,255,.04)", borderRadius: 6 }}>
      <path d={d} fill="none" stroke="var(--blue)" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

export default function Prediction({ prediction }) {
  const p = prediction || {};
  const Row = ({ k, v }) => (
    <div className="kvrow">
      <span className="k">{k}</span>
      <span className="v" style={{ color: healthColor(v) }}>{v != null ? `${v}%` : "—"}</span>
    </div>
  );
  return (
    <Card title="Predictive Analysis" icon={Icon.chart} color="purple">
      <div style={{ color: "var(--muted)", fontSize: 11.5 }}>Expected System Health</div>
      <div className="pred">
        <div className="kvlist">
          <Row k="Current" v={p.current} />
          <Row k="In 10 minutes" v={p.in_10m} />
          <Row k="In 30 minutes" v={p.in_30m} />
          <Row k="In 1 hour" v={p.in_1h} />
        </div>
        <Spark points={p.trend || []} />
      </div>
      {p.warning && (
        <div className="warn-box">
          <Icon.warn className="ic" width={16} height={16} />
          <span>{p.warning}</span>
        </div>
      )}
    </Card>
  );
}
