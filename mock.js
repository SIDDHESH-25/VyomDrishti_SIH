// Mock payload used when the backend at localhost:5000 is unreachable.
// Shape matches the API contract in README.md exactly, so the UI code is identical either way.

function series(base, n = 60, drift = -0.6, noise = 4) {
  const out = [];
  let v = base;
  const start = Date.now() - n * 60 * 1000;
  for (let i = 0; i < n; i++) {
    v = Math.max(0, Math.min(100, v + drift + (Math.random() - 0.5) * noise));
    out.push({ t: new Date(start + i * 60 * 1000).toISOString(), v: Math.round(v * 10) / 10 });
  }
  return out;
}

export const MOCK_DASHBOARD = {
  header: {
    title: "HIGH-ALTITUDE ANTI-DRONE SYSTEM",
    subtitle: "Environment-Aware AI Monitoring & Reliable Operation",
    altitude_m: 4500,
    location: { lat: 34.12, lon: 77.58 },
    time: new Date().toISOString(),
    status: "ONLINE",
    mode: "DEGRADED",
  },
  environment: {
    temperature_c: -12.5,
    wind_speed_ms: 8.4,
    pressure_kpa: 72.3,
    altitude_m: 4500,
    humidity_pct: 35,
    wind_direction: { label: "NW", deg: 310 },
  },
  system_health: { score: 72, max: 100, status: "DEGRADED" },
  tracking: {
    drone_detected: true,
    confidence: 0.93,
    reliability: 0.75,
    fps: 27,
    latency_ms: 82,
  },
  prediction: {
    current: 72,
    in_10m: 68,
    in_30m: 61,
    in_1h: 48,
    trend: [72, 70, 71, 68, 66, 64, 61, 58, 54, 48],
    warning: "High risk of performance degradation in next 1 hour",
  },
  live_feed: {
    stream_url: null,
    heading_deg: 350,
    recording: true,
    zoom: 2.5,
    detection: { label: "Drone", confidence: 0.93, box: { x: 0.38, y: 0.3, w: 0.2, h: 0.34 } },
    altitude_rel_m: 120,
    distance_m: 350,
    speed_ms: 12,
    track_id: 47,
  },
  sensors: [
    { name: "Camera", value: 91 },
    { name: "IMU (Vibration)", value: 78 },
    { name: "GPS", value: 96 },
    { name: "Environmental", value: 94 },
    { name: "Battery", value: 85 },
    { name: "Gimbal / Servo", value: 72 },
    { name: "Communication", value: 98 },
  ],
  shap: [
    { feature: "High vibration", value: -0.14 },
    { feature: "Low temperature", value: -0.09 },
    { feature: "High wind speed", value: -0.05 },
    { feature: "Gimbal error", value: -0.04 },
    { feature: "Low pressure", value: -0.03 },
    { feature: "Battery voltage", value: -0.02 },
    { feature: "Humidity", value: -0.01 },
  ],
  graphs: {
    range: "1h",
    metrics: {
      system_health: series(88, 60, -0.75, 5),
      temperature: series(30, 60, 0, 3),
      pressure: series(72, 60, 0, 1),
      vibration: series(40, 60, 0.3, 6),
      wind_speed: series(45, 60, 0.2, 5),
      battery: series(92, 60, -0.15, 1),
      fps: series(85, 60, -0.1, 4),
    },
    thresholds: { normal: 80, degraded: 50 },
  },
  alerts: [
    { time: "14:31", level: "critical", message: "High vibration detected (IMU)" },
    { time: "14:29", level: "warning", message: "Tracking reliability reduced" },
    { time: "14:25", level: "warning", message: "Temperature below -10°C" },
    { time: "14:20", level: "warning", message: "Gimbal response delay increased" },
    { time: "14:18", level: "critical", message: "System switched to DEGRADED mode" },
    { time: "14:12", level: "info", message: "Drone detected (ID #47)" },
    { time: "14:05", level: "warning", message: "Wind speed above 8 m/s" },
    { time: "13:58", level: "ok", message: "Battery level normal" },
  ],
  system_info: {
    uptime: "02:14:36",
    cpu_pct: 48,
    storage_pct: 62,
    model_version: "v1.2.0",
    status_text: "All Systems Operational (With Degraded Reliability)",
  },
};
