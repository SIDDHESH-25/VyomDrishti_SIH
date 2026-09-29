import { useDashboard } from "./api.js";
import TopBar from "./components/TopBar.jsx";
import Environment from "./components/Environment.jsx";
import SystemHealth from "./components/SystemHealth.jsx";
import Tracking from "./components/Tracking.jsx";
import Prediction from "./components/Prediction.jsx";
import LiveFeed from "./components/LiveFeed.jsx";
import SensorHealth from "./components/SensorHealth.jsx";
import Shap from "./components/Shap.jsx";
import Graphs from "./components/Graphs.jsx";
import Alerts from "./components/Alerts.jsx";
import ControlPanel from "./components/ControlPanel.jsx";
import SystemInfo from "./components/SystemInfo.jsx";

export default function App() {
  const { data, live, refresh } = useDashboard();

  return (
    <div className="app">
      <TopBar header={data.header} live={live} />

      <div className="row row-1">
        <Environment env={data.environment} />
        <SystemHealth health={data.system_health} />
        <Tracking tracking={data.tracking} />
        <Prediction prediction={data.prediction} />
      </div>

      <div className="row row-2">
        <LiveFeed feed={data.live_feed} />
        <SensorHealth sensors={data.sensors} />
        <Shap shap={data.shap} />
      </div>

      <div className="row row-3">
        <Graphs graphs={data.graphs} live={live} />
        <Alerts alerts={data.alerts} />
        <div className="stack">
          <ControlPanel live={live} onDone={refresh} />
          <SystemInfo info={data.system_info} />
        </div>
      </div>
    </div>
  );
}
