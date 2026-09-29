import Card from "./Card.jsx";
import { Icon } from "../icons.jsx";

const ICONS = {
  camera: Icon.camera,
  imu: Icon.imu,
  gps: Icon.gps,
  environmental: Icon.env,
  battery: Icon.battery,
  gimbal: Icon.gimbal,
  communication: Icon.comm,
};

function pickIcon(name = "") {
  const n = name.toLowerCase();
  const key = Object.keys(ICONS).find((k) => n.includes(k));
  return ICONS[key] || Icon.gear;
}

function tone(v) {
  if (v >= 85) return "green";
  if (v >= 70) return "yellow";
  if (v >= 50) return "orange";
  return "red";
}

export default function SensorHealth({ sensors }) {
  const list = Array.isArray(sensors) ? sensors : [];
  return (
    <Card title="Sensor Health" icon={Icon.gear} color="green">
      <div className="sensors">
        {list.map((s) => {
          const I = pickIcon(s.name);
          const t = tone(Number(s.value));
          return (
            <div className="sensor" key={s.name}>
              <span className="ic"><I width={15} height={15} /></span>
              <span className="n">{s.name}</span>
              <div className="bar"><i className={`b-${t}`} style={{ width: `${Math.max(0, Math.min(100, s.value))}%` }} /></div>
              <span className={`p c-${t}`}>{Math.round(s.value)}%</span>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
