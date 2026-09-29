import Card from "./Card.jsx";
import { Icon } from "../icons.jsx";

export default function SystemInfo({ info }) {
  const s = info || {};
  return (
    <Card title="System Information" icon={Icon.info} color="blue">
      <div className="sysinfo">
        <div className="kvlist">
          <div className="kvrow"><span className="k">Uptime</span><span className="v">{s.uptime ?? "—"}</span></div>
          <div className="kvrow"><span className="k">CPU Usage</span><span className="v">{s.cpu_pct != null ? `${s.cpu_pct} %` : "—"}</span></div>
          <div className="kvrow"><span className="k">Storage</span><span className="v">{s.storage_pct != null ? `${s.storage_pct} %` : "—"}</span></div>
          <div className="kvrow"><span className="k">Model Version</span><span className="v">{s.model_version ?? "—"}</span></div>
        </div>
        <div className="ok">
          <Icon.check className="ic" width={22} height={22} />
          <span>{s.status_text || "All Systems Operational"}</span>
        </div>
      </div>
    </Card>
  );
}
