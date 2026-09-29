import Card from "./Card.jsx";
import { Icon } from "../icons.jsx";

const DIRS = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];

function nearestDir(deg) {
  if (deg == null) return "N";
  return DIRS[Math.round((((deg % 360) + 360) % 360) / 45) % 8];
}

export default function LiveFeed({ feed }) {
  const f = feed || {};
  const det = f.detection;
  const box = det?.box;
  const active = nearestDir(f.heading_deg);
  const show = ["W", "NW", "N", "NE", "E"];

  return (
    <Card title="Live Drone Feed" icon={Icon.camera} color="blue">
      <div className="feed">
        {f.stream_url ? (
          <img src={f.stream_url} alt="Live feed" />
        ) : (
          <>
            <div className="scene" />
            <svg className="peaks" viewBox="0 0 100 40" preserveAspectRatio="none">
              <path d="M0 40 L0 26 L10 16 L18 24 L28 8 L38 20 L46 12 L56 24 L66 6 L76 18 L86 10 L100 22 L100 40 Z" fill="#c9d6e6" />
              <path d="M0 40 L0 30 L12 22 L22 30 L34 18 L44 28 L58 16 L70 26 L82 20 L100 30 L100 40 Z" fill="#7a8ea6" />
              <path d="M0 40 L0 34 L16 30 L30 36 L48 28 L64 34 L80 30 L100 36 L100 40 Z" fill="#3d4d63" />
            </svg>
          </>
        )}

        <div className="overlay">
          <div className="compass">
            {show.map((d) => (
              <span key={d} className={d === active ? "active" : ""}>{d}</span>
            ))}
          </div>
          {f.recording && <div className="rec"><i />REC</div>}
          <span className="corner tl" /><span className="corner tr" /><span className="corner bl" /><span className="corner br" />
          <div className="reticle" />

          {det && box && (
            <div
              className="bbox"
              style={{ left: `${box.x * 100}%`, top: `${box.y * 100}%`, width: `${box.w * 100}%`, height: `${box.h * 100}%` }}
            >
              <span>{det.label} {det.confidence != null ? Number(det.confidence).toFixed(2) : ""}</span>
              {!f.stream_url && <Icon.drone stroke="#111" strokeWidth={1.6} />}
            </div>
          )}

          <div className="telemetry">
            <div>Altitude (rel.): {f.altitude_rel_m ?? "—"} m</div>
            <div>Distance: {f.distance_m ?? "—"} m</div>
            <div>Speed: {f.speed_ms ?? "—"} m/s</div>
            <div>Track ID: #{f.track_id ?? "—"}</div>
          </div>
          <div className="zoom">Zoom {f.zoom ?? 1}x</div>
          <button className="nav l" type="button" aria-label="Previous camera"><Icon.chevL width={14} height={14} /></button>
          <button className="nav r" type="button" aria-label="Next camera"><Icon.chevR width={14} height={14} /></button>
        </div>
      </div>
    </Card>
  );
}
