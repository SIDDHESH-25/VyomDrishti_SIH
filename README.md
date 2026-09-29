# VyomDrishti Dashboard

React (Vite) front-end for the High-Altitude Anti-Drone System. It polls the backend at
`http://localhost:5000` every 2 s and renders the mission-control UI. If the backend is
unreachable it renders built-in mock data and shows a yellow **MOCK** badge in the top bar.

## Run

```bash
npm install
npm run dev        # http://localhost:3000  (proxies /api -> http://localhost:5000)
```

Production build: `npm run build` (output in `dist/`). When serving `dist/` yourself,
set `VITE_API_BASE=http://localhost:5000` in `.env` before building so the app calls the
backend directly (the backend must then send CORS headers).

No backend yet? `python mock_server.py` starts a stdlib mock on port 5000.

## Backend API contract

### `GET /api/dashboard`
Returns the whole dashboard state. Every top-level key is optional; missing keys keep
the previous value. All numbers are plain numbers (no units in strings).

```jsonc
{
  "header": {
    "title": "HIGH-ALTITUDE ANTI-DRONE SYSTEM",
    "subtitle": "Environment-Aware AI Monitoring & Reliable Operation",
    "altitude_m": 4500,
    "location": { "lat": 34.12, "lon": 77.58 },
    "time": "2025-09-12T14:32:18Z",         // ISO-8601
    "status": "ONLINE",
    "mode": "DEGRADED"                       // NORMAL | DEGRADED | CRITICAL
  },
  "environment": {
    "temperature_c": -12.5, "wind_speed_ms": 8.4, "pressure_kpa": 72.3,
    "altitude_m": 4500, "humidity_pct": 35,
    "wind_direction": { "label": "NW", "deg": 310 }
  },
  "system_health": { "score": 72, "max": 100, "status": "DEGRADED" },
  "tracking": {
    "drone_detected": true, "confidence": 0.93, "reliability": 0.75,
    "fps": 27, "latency_ms": 82
  },
  "prediction": {
    "current": 72, "in_10m": 68, "in_30m": 61, "in_1h": 48,
    "trend": [72, 70, 71, 68, 66, 64, 61, 58, 54, 48],   // sparkline, oldest -> newest
    "warning": "High risk of performance degradation in next 1 hour"   // or null
  },
  "live_feed": {
    "stream_url": "http://localhost:5000/video_feed",    // MJPEG/JPEG URL, or null for placeholder
    "heading_deg": 350, "recording": true, "zoom": 2.5,
    "detection": {                                        // or null when nothing tracked
      "label": "Drone", "confidence": 0.93,
      "box": { "x": 0.38, "y": 0.30, "w": 0.20, "h": 0.34 }   // fractions of frame size
    },
    "altitude_rel_m": 120, "distance_m": 350, "speed_ms": 12, "track_id": 47
  },
  "sensors": [                                            // 0-100 each
    { "name": "Camera", "value": 91 }, { "name": "IMU (Vibration)", "value": 78 },
    { "name": "GPS", "value": 96 }, { "name": "Environmental", "value": 94 },
    { "name": "Battery", "value": 85 }, { "name": "Gimbal / Servo", "value": 72 },
    { "name": "Communication", "value": 98 }
  ],
  "shap": [                                               // sorted by |value| desc
    { "feature": "High vibration", "value": -0.14 }, { "feature": "Low temperature", "value": -0.09 }
  ],
  "graphs": {
    "range": "1h",
    "thresholds": { "normal": 80, "degraded": 50 },
    "metrics": {                                          // each: [{ "t": ISO-8601, "v": number }]
      "system_health": [], "temperature": [], "pressure": [], "vibration": [],
      "wind_speed": [], "battery": [], "fps": []
    }
  },
  "alerts": [                                             // newest first
    { "time": "14:31", "level": "critical", "message": "High vibration detected (IMU)" }
    // level: critical | warning | info | ok
  ],
  "system_info": {
    "uptime": "02:14:36", "cpu_pct": 48, "storage_pct": 62,
    "model_version": "v1.2.0",
    "status_text": "All Systems Operational (With Degraded Reliability)"
  }
}
```

### `GET /api/graphs?metric=<key>&range=<1h|6h|24h>`
Called only when the user picks a range different from `graphs.range`.
Respond with `{ "series": [{ "t": ISO-8601, "v": number }] }`.

### `POST /api/control`  body `{ "action": "<id>" }`
Action ids: `auto_mode`, `stabilize_gimbal`, `increase_tracking_sensitivity`,
`ai_recalibrate`, `mute_alerts`, `emergency_stop`.
Respond with `{ "ok": true, "message": "Gimbal stabilized" }`; the message is shown under the buttons.

## Project layout

```
src/
  api.js            fetch helpers + useDashboard() polling hook (mock fallback)
  mock.js           mock payload (same shape as the API)
  icons.jsx         inline SVG icon set
  styles.css        theme + layout (3 grid rows, responsive)
  App.jsx           page composition
  components/       one file per panel
```
