import { useState } from "react";
import Card from "./Card.jsx";
import { Icon } from "../icons.jsx";

const LEVEL_ICON = { critical: Icon.x, warning: Icon.warn, info: Icon.info, ok: Icon.check };

export default function Alerts({ alerts }) {
  const [all, setAll] = useState(false);
  const list = Array.isArray(alerts) ? alerts : [];
  const shown = all ? list : list.slice(0, 8);
  return (
    <Card
      title="Alerts & Events"
      icon={Icon.bell}
      color="yellow"
      right={<button type="button" className="link" onClick={() => setAll((v) => !v)}>{all ? "Show Less" : "View All"}</button>}
    >
      <div className="alerts" style={all ? { maxHeight: "none" } : undefined}>
        {shown.map((a, i) => {
          const lvl = (a.level || "info").toLowerCase();
          const I = LEVEL_ICON[lvl] || Icon.info;
          return (
            <div className={`alert ${lvl}`} key={`${a.time}-${i}`}>
              <span className="t">{a.time}</span>
              <span className="ic"><I width={14} height={14} /></span>
              <span>{a.message}</span>
            </div>
          );
        })}
        {!list.length && <div className="foot">No alerts.</div>}
      </div>
    </Card>
  );
}
