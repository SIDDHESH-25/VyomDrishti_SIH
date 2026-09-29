import { useEffect, useMemo, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer } from "recharts";
import Card from "./Card.jsx";
import { Icon } from "../icons.jsx";
import { fetchGraph } from "../api.js";

const TABS = [
  ["system_health", "System Health", "Health Score"],
  ["temperature", "Temperature", "°C (normalised)"],
  ["pressure", "Pressure", "kPa (normalised)"],
  ["vibration", "Vibration", "Index"],
  ["wind_speed", "Wind Speed", "m/s (normalised)"],
  ["battery", "Battery", "%"],
  ["fps", "FPS", "Frames / s"],
];
const RANGES = [["1h", "Last 1 Hour"], ["6h", "Last 6 Hours"], ["24h", "Last 24 Hours"]];

const hhmm = (iso) => {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? String(iso) : d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false });
};

export default function Graphs({ graphs, live }) {
  const [metric, setMetric] = useState("system_health");
  const [range, setRange] = useState("1h");
  const [override, setOverride] = useState(null); // series fetched for a non-default range

  // When the user changes range and the backend is live, ask it for that window explicitly.
  useEffect(() => {
    let cancelled = false;
    setOverride(null);
    if (!live || range === (graphs?.range || "1h")) return undefined;
    fetchGraph(metric, range)
      .then((res) => { if (!cancelled) setOverride(res.series || res.data || res); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [metric, range, live, graphs?.range]);

  const series = override || graphs?.metrics?.[metric] || [];
  const data = useMemo(() => series.map((p) => ({ t: hhmm(p.t), v: p.v })), [series]);
  const th = graphs?.thresholds || { normal: 80, degraded: 50 };
  const yLabel = TABS.find((t) => t[0] === metric)?.[2] || "";

  return (
    <Card
      title="Real-Time Graphs"
      icon={Icon.chart}
      color="blue"
      right={
        <select className="select" value={range} onChange={(e) => setRange(e.target.value)}>
          {RANGES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>
      }
    >
      <div className="tabs">
        {TABS.map(([k, l]) => (
          <button key={k} type="button" className={`tab ${metric === k ? "active" : ""}`} onClick={() => setMetric(k)}>{l}</button>
        ))}
      </div>
      <div className="chart-wrap">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 70, bottom: 4, left: -18 }}>
            <CartesianGrid stroke="rgba(255,255,255,.07)" vertical={false} />
            <XAxis dataKey="t" tick={{ fill: "#8b9bb4", fontSize: 10 }} axisLine={{ stroke: "#1e2e4d" }} tickLine={false} interval="preserveStartEnd" minTickGap={28} />
            <YAxis domain={[0, 100]} tick={{ fill: "#8b9bb4", fontSize: 10 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: "#0f1a2e", border: "1px solid #1e2e4d", borderRadius: 6, fontSize: 12 }} labelStyle={{ color: "#8b9bb4" }} />
            <ReferenceLine y={th.normal} stroke="#22c55e" strokeDasharray="4 4" label={{ value: `Normal (> ${th.normal})`, position: "right", fill: "#22c55e", fontSize: 10 }} />
            <ReferenceLine y={th.degraded} stroke="#eab308" strokeDasharray="4 4" label={{ value: `Degraded (${th.degraded} - ${th.normal})`, position: "right", fill: "#eab308", fontSize: 10 }} />
            <ReferenceLine y={Math.max(0, th.degraded - 20)} stroke="#ef4444" strokeDasharray="4 4" label={{ value: `Critical (< ${th.degraded})`, position: "right", fill: "#ef4444", fontSize: 10 }} />
            <Line type="monotone" dataKey="v" stroke="#3b82f6" strokeWidth={2} dot={false} isAnimationActive={false} name={yLabel} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="legend-lines">
        <span>{yLabel}</span>
        <span style={{ marginLeft: "auto" }}>Time (Last {RANGES.find((r) => r[0] === range)?.[1].replace("Last ", "").toLowerCase()})</span>
      </div>
    </Card>
  );
}
