"""Minimal stand-in backend on http://localhost:5000 (stdlib only).

Serves the same JSON shape the React app expects (see README.md) with small random
drift each poll, so the UI visibly updates. Replace with the real backend when ready.
"""
import json
import random
import time
from datetime import datetime, timedelta, timezone
from http.server import BaseHTTPRequestHandler, HTTPServer
from urllib.parse import parse_qs, urlparse

START = time.time()


def series(base, n=60, drift=-0.5, noise=4.0, step_min=1):
    out, v = [], base
    t0 = datetime.now(timezone.utc) - timedelta(minutes=n * step_min)
    for i in range(n):
        v = max(0, min(100, v + drift + (random.random() - 0.5) * noise))
        out.append({"t": (t0 + timedelta(minutes=i * step_min)).isoformat(), "v": round(v, 1)})
    return out


def dashboard():
    score = 72 + random.randint(-2, 2)
    up = int(time.time() - START)
    return {
        "header": {
            "title": "HIGH-ALTITUDE ANTI-DRONE SYSTEM",
            "subtitle": "Environment-Aware AI Monitoring & Reliable Operation",
            "altitude_m": 4500,
            "location": {"lat": 34.12, "lon": 77.58},
            "time": datetime.now(timezone.utc).isoformat(),
            "status": "ONLINE",
            "mode": "DEGRADED" if score < 80 else "NORMAL",
        },
        "environment": {
            "temperature_c": round(-12.5 + random.uniform(-0.3, 0.3), 1),
            "wind_speed_ms": round(8.4 + random.uniform(-0.5, 0.5), 1),
            "pressure_kpa": 72.3,
            "altitude_m": 4500,
            "humidity_pct": 35,
            "wind_direction": {"label": "NW", "deg": 310},
        },
        "system_health": {"score": score, "max": 100, "status": "DEGRADED" if score < 80 else "NORMAL"},
        "tracking": {
            "drone_detected": True,
            "confidence": round(0.93 + random.uniform(-0.02, 0.02), 2),
            "reliability": 0.75,
            "fps": 27 + random.randint(-1, 1),
            "latency_ms": 82 + random.randint(-4, 4),
        },
        "prediction": {
            "current": score, "in_10m": 68, "in_30m": 61, "in_1h": 48,
            "trend": [72, 70, 71, 68, 66, 64, 61, 58, 54, 48],
            "warning": "High risk of performance degradation in next 1 hour",
        },
        "live_feed": {
            "stream_url": None,
            "heading_deg": 350, "recording": True, "zoom": 2.5,
            "detection": {"label": "Drone", "confidence": 0.93,
                          "box": {"x": 0.38 + random.uniform(-0.01, 0.01), "y": 0.30, "w": 0.20, "h": 0.34}},
            "altitude_rel_m": 120, "distance_m": 350, "speed_ms": 12, "track_id": 47,
        },
        "sensors": [
            {"name": "Camera", "value": 91}, {"name": "IMU (Vibration)", "value": 78},
            {"name": "GPS", "value": 96}, {"name": "Environmental", "value": 94},
            {"name": "Battery", "value": 85}, {"name": "Gimbal / Servo", "value": 72},
            {"name": "Communication", "value": 98},
        ],
        "shap": [
            {"feature": "High vibration", "value": -0.14}, {"feature": "Low temperature", "value": -0.09},
            {"feature": "High wind speed", "value": -0.05}, {"feature": "Gimbal error", "value": -0.04},
            {"feature": "Low pressure", "value": -0.03}, {"feature": "Battery voltage", "value": -0.02},
            {"feature": "Humidity", "value": -0.01},
        ],
        "graphs": {
            "range": "1h",
            "thresholds": {"normal": 80, "degraded": 50},
            "metrics": {
                "system_health": series(88), "temperature": series(30, drift=0, noise=3),
                "pressure": series(72, drift=0, noise=1), "vibration": series(40, drift=0.3, noise=6),
                "wind_speed": series(45, drift=0.2), "battery": series(92, drift=-0.15, noise=1),
                "fps": series(85, drift=-0.1),
            },
        },
        "alerts": [
            {"time": "14:31", "level": "critical", "message": "High vibration detected (IMU)"},
            {"time": "14:29", "level": "warning", "message": "Tracking reliability reduced"},
            {"time": "14:25", "level": "warning", "message": "Temperature below -10°C"},
            {"time": "14:20", "level": "warning", "message": "Gimbal response delay increased"},
            {"time": "14:18", "level": "critical", "message": "System switched to DEGRADED mode"},
            {"time": "14:12", "level": "info", "message": "Drone detected (ID #47)"},
            {"time": "14:05", "level": "warning", "message": "Wind speed above 8 m/s"},
            {"time": "13:58", "level": "ok", "message": "Battery level normal"},
        ],
        "system_info": {
            "uptime": f"{up // 3600:02d}:{(up % 3600) // 60:02d}:{up % 60:02d}",
            "cpu_pct": 48 + random.randint(-3, 3), "storage_pct": 62,
            "model_version": "v1.2.0",
            "status_text": "All Systems Operational (With Degraded Reliability)",
        },
    }


class Handler(BaseHTTPRequestHandler):
    def _send(self, obj, code=200):
        body = json.dumps(obj).encode()
        self.send_response(code)
        self.send_header("Content-Type", "application/json")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_OPTIONS(self):
        self._send({})

    def do_GET(self):
        u = urlparse(self.path)
        if u.path == "/api/dashboard":
            return self._send(dashboard())
        if u.path == "/api/graphs":
            q = parse_qs(u.query)
            rng = q.get("range", ["1h"])[0]
            n, step = {"1h": (60, 1), "6h": (72, 5), "24h": (96, 15)}.get(rng, (60, 1))
            return self._send({"series": series(85, n=n, step_min=step)})
        self._send({"error": "not found"}, 404)

    def do_POST(self):
        if urlparse(self.path).path != "/api/control":
            return self._send({"error": "not found"}, 404)
        n = int(self.headers.get("Content-Length") or 0)
        payload = json.loads(self.rfile.read(n) or b"{}")
        action = payload.get("action", "?")
        self._send({"ok": True, "message": f"{action.replace('_', ' ').title()} acknowledged"})

    def log_message(self, fmt, *args):  # quieter console
        pass


if __name__ == "__main__":
    print("Mock backend on http://localhost:5000  (Ctrl+C to stop)")
    HTTPServer(("0.0.0.0", 5000), Handler).serve_forever()
