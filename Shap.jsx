import Card from "./Card.jsx";
import { Icon } from "../icons.jsx";

function color(i, v) {
  if (v > 0) return "var(--green)";
  const scale = ["#ef4444", "#ef5a44", "#f97316", "#f9a316", "#eab308", "#c9c116", "#a3e635"];
  return scale[Math.min(i, scale.length - 1)];
}

export default function Shap({ shap }) {
  const rows = Array.isArray(shap) ? shap : [];
  const maxAbs = Math.max(0.01, ...rows.map((r) => Math.abs(Number(r.value) || 0)));
  return (
    <Card title="AI Explainability (SHAP)" icon={Icon.brain} color="purple">
      <div className="shap">
        {rows.map((r, i) => {
          const v = Number(r.value) || 0;
          const w = (Math.abs(v) / maxAbs) * 100;
          return (
            <div className="shap-row" key={r.feature}>
              <span className="f">{r.feature}</span>
              <span className="v">{v.toFixed(2)}</span>
              <div className="track">
                <i style={{ left: 0, width: `${w}%`, background: color(i, v) }} />
              </div>
            </div>
          );
        })}
      </div>
      <div className="foot">Top factors affecting system health</div>
    </Card>
  );
}
