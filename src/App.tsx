import { motion } from "framer-motion";
import {
  Activity,
  Battery,
  Cpu,
  Gauge,
  Network,
  Thermometer,
  Zap
} from "lucide-react";

import { Layout } from "./components/Layout";
import { MetricCard } from "./components/MetricCard";
import { DeviceTelemetry } from "./components/DeviceTelemetry";
import { DigitalTwin } from "./components/DigitalTwin";
import { TelemetryChart } from "./components/TelemetryChart";
import { AlertsPanel } from "./components/AlertsPanel";
import { WhatIfSimulator } from "./components/WhatIfSimulator";
import { DeveloperCard } from "./components/DeveloperCard";

import { useDeviceTelemetry } from "./hooks/useDeviceTelemetry";
import { useMachineSimulator } from "./hooks/useMachineSimulator";

function App() {
  const {
    telemetry: device,
    requestMotionPermission
  } = useDeviceTelemetry();

  const {
    machine,
    telemetry,
    history,
    running,
    setRunning
  } = useMachineSimulator();

  if (!device) {
    return (
      <div className="loading-screen">
        <div className="loader" />

        <span>
          Initializing telemetry engine...
        </span>
      </div>
    );
  }

  return (
    <Layout>
      <main className="dashboard">
        <motion.section
          className="hero"
          initial={{
            opacity: 0,
            y: 15
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
        >
          <div>
            <div className="hero-kicker">
              <Activity size={14} />
              FORGETWIN AI · LOCAL TELEMETRY
            </div>

            <h1>
              Turn machine data into
              <span>
                engineering intelligence.
              </span>
            </h1>

            <p>
              A frontend-only industrial
              intelligence console combining
              live browser device telemetry
              with a clearly-labelled simulated
              industrial machine.
            </p>
          </div>

          <div className="hero-status">
            <span className="live-dot" />
            LIVE
          </div>
        </motion.section>

        <section className="quick-grid">
          <MetricCard
            label="Battery"
            value={
              device.battery.level !== null
                ? device.battery.level.toFixed(0)
                : "N/A"
            }
            unit="%"
            icon={Battery}
            description={
              device.battery.charging
                ? "Charging"
                : "Battery state"
            }
          />

          <MetricCard
            label="Network"
            value={
              device.network.downlinkMbps !==
              null
                ? device.network.downlinkMbps.toFixed(
                    1
                  )
                : "N/A"
            }
            unit="Mbps"
            icon={Network}
            description={
              device.network.effectiveType
            }
          />

          <MetricCard
            label="Device Memory"
            value={
              device.deviceMemoryGB !== null
                ? String(
                    device.deviceMemoryGB
                  )
                : "N/A"
            }
            unit="GB"
            icon={Cpu}
            description="Browser estimate"
          />

          <MetricCard
            label="Machine Temp"
            value={telemetry.temperature.toFixed(1)}
            unit="°C"
            icon={Thermometer}
            description={
              "Simulated telemetry"
            }
            status={
              telemetry.status ===
              "CRITICAL"
                ? "critical"
                : telemetry.status ===
                    "WARNING"
                  ? "warning"
                  : "normal"
            }
          />

          <MetricCard
            label="Machine RPM"
            value={Math.round(
              telemetry.rpm
            ).toString()}
            unit="RPM"
            icon={Gauge}
            description={
              "Simulated telemetry"
            }
          />

          <MetricCard
            label="Machine Current"
            value={telemetry.current.toFixed(2)}
            unit="A"
            icon={Zap}
            description={
              "Simulated telemetry"
            }
          />
        </section>

        <div className="section-divider">
          <span>
            REAL DEVICE TELEMETRY
          </span>
        </div>

        <DeviceTelemetry
          telemetry={device}
          onMotionPermission={
            requestMotionPermission
          }
        />

        <div className="section-divider">
          <span>
            SIMULATED INDUSTRIAL ASSET
          </span>

          <button
            className="simulation-toggle"
            onClick={() =>
              setRunning(!running)
            }
          >
            {running
              ? "Pause simulator"
              : "Resume simulator"}
          </button>
        </div>

        <section className="machine-heading">
          <div>
            <span className="section-kicker">
              SIMULATED MACHINE
            </span>

            <h2>
              {machine.id} ·{" "}
              {machine.name}
            </h2>
          </div>

          <div
            className={`machine-state ${telemetry.status.toLowerCase()}`}
          >
            <span />
            {telemetry.status}
          </div>
        </section>

        <section className="machine-grid">
          <DigitalTwin
            telemetry={telemetry}
          />

          <div className="machine-side">
            <AlertsPanel
              telemetry={telemetry}
            />

            <WhatIfSimulator
              telemetry={telemetry}
            />
          </div>
        </section>

        <section className="panel chart-panel">
          <div className="panel-title">
            <div>
              <span className="section-kicker">
                REAL-TIME SIMULATOR STREAM
              </span>

              <h2>
                Temperature & vibration
              </h2>
            </div>

            <div className="chart-legend">
              <span>
                <i className="temp-dot" />
                Temperature
              </span>

              <span>
                <i className="vibration-dot" />
                Vibration
              </span>
            </div>
          </div>

          <TelemetryChart
            data={history}
          />
        </section>

        <DeveloperCard />

        <footer>
          <span>
            ForgeTwin AI
          </span>

          <span>
            Device telemetry is collected
            locally by the browser.
          </span>

          <span>
            Industrial telemetry shown in
            this frontend-only version is
            simulated.
          </span>
        </footer>
      </main>
    </Layout>
  );
}

export default App;
