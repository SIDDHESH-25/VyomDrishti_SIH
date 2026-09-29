import { useState } from "react";
import Card from "./Card.jsx";
import { Icon } from "../icons.jsx";
import { sendControl } from "../api.js";

const ACTIONS = [
  ["auto_mode", "Auto Mode", "primary"],
  ["stabilize_gimbal", "Stabilize Gimbal", ""],
  ["increase_tracking_sensitivity", "Increase Tracking Sensitivity", ""],
  ["ai_recalibrate", "AI Recalibrate", ""],
  ["mute_alerts", "Mute Alerts", ""],
  ["emergency_stop", "Emergency Stop", "danger"],
];

export default function ControlPanel({ live, onDone }) {
  const [busy, setBusy] = useState(null);
  const [msg, setMsg] = useState("");

  async function run(action, label) {
    if (action === "emergency_stop" && !window.confirm("Trigger EMERGENCY STOP?")) return;
    setBusy(action);
    setMsg("");
    try {
      if (!live) throw new Error("backend offline");
      const res = await sendControl(action);
      setMsg(res?.message || `${label}: OK`);
      onDone?.();
    } catch (e) {
      setMsg(`${label} failed (${e.message})`);
    } finally {
      setBusy(null);
    }
  }

  return (
    <Card title="Control Panel" icon={Icon.gear} color="blue">
      <div className="ctl">
        {ACTIONS.map(([a, l, cls]) => (
          <button key={a} type="button" className={`btn ${cls}`} disabled={busy != null} onClick={() => run(a, l)}>
            {busy === a ? "…" : l}
          </button>
        ))}
      </div>
      <div className="toast">{msg}</div>
    </Card>
  );
}
