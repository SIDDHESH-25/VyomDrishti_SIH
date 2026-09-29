import Card from "./Card.jsx";
import { Icon } from "../icons.jsx";

const pct = (x) => (x == null ? "—" : `${Number(x).toFixed(2)} (${Math.round(x * 100)}%)`);

export default function Tracking({ tracking }) {
  const t = tracking || {};
  return (
    <Card title="Tracking Status" icon={Icon.drone} color="cyan">
      <div className={`badge ${t.drone_detected ? "detected" : "clear"}`} style={{ alignSelf: "center", minWidth: 150 }}>
        {t.drone_detected ? "DRONE DETECTED" : "NO TARGET"}
      </div>
      <div className="kvlist">
        <div className="kvrow"><span className="k">Detection Confidence</span><span className="v">{pct(t.confidence)}</span></div>
        <div className="kvrow"><span className="k">Tracking Reliability</span><span className="v">{pct(t.reliability)}</span></div>
        <div className="kvrow"><span className="k">Tracking FPS</span><span className="v">{t.fps ?? "—"}</span></div>
        <div className="kvrow"><span className="k">Latency</span><span className="v">{t.latency_ms != null ? `${t.latency_ms} ms` : "—"}</span></div>
      </div>
    </Card>
  );
}
