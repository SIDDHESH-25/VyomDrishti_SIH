import Card from "./Card.jsx";
import { Icon } from "../icons.jsx";

function Stat({ icon: I, value, label }) {
  return (
    <div className="stat">
      <span className="ic"><I width={14} height={14} /></span>
      <div>
        <div className="v">{value}</div>
        <div className="l">{label}</div>
      </div>
    </div>
  );
}

export default function Environment({ env }) {
  const e = env || {};
  const wd = e.wind_direction || {};
  return (
    <Card title="Environment" icon={Icon.mountain} color="blue">
      <div className="env-grid">
        <Stat icon={Icon.thermo} value={e.temperature_c != null ? `${e.temperature_c} °C` : "—"} label="Temperature" />
        <Stat icon={Icon.wind} value={e.wind_speed_ms != null ? `${e.wind_speed_ms} m/s` : "—"} label="Wind Speed" />
        <Stat icon={Icon.gauge} value={e.pressure_kpa != null ? `${e.pressure_kpa} kPa` : "—"} label="Pressure" />
        <Stat icon={Icon.mountain} value={e.altitude_m != null ? `${e.altitude_m.toLocaleString()} m` : "—"} label="Altitude" />
        <Stat icon={Icon.drop} value={e.humidity_pct != null ? `${e.humidity_pct} %` : "—"} label="Humidity" />
        <Stat icon={Icon.compass} value={wd.label ? `${wd.label} (${wd.deg}°)` : "—"} label="Wind Direction" />
      </div>
    </Card>
  );
}
