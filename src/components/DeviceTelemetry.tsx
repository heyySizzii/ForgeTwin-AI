import {
  Battery,
  Cpu,
  Gauge,
  Globe,
  HardDrive,
  Monitor,
  Network,
  Smartphone
} from "lucide-react";

import type { DeviceTelemetry as DeviceTelemetryType } from "../types/telemetry";

import { MetricCard } from "./MetricCard";

interface Props {
  telemetry: DeviceTelemetryType;
  onMotionPermission: () => void;
}

export function DeviceTelemetry({
  telemetry,
  onMotionPermission
}: Props) {
  const battery =
    telemetry.battery;

  const network =
    telemetry.network;

  const motion =
    telemetry.motion;

  return (
    <section>
      <div className="section-heading">
        <div>
          <span className="section-kicker">
            DEVICE TELEMETRY
          </span>

          <h2>
            Your device
          </h2>
        </div>

        <div className="real-badge">
          ● LIVE BROWSER DATA
        </div>
      </div>

      <div className="telemetry-grid">
        <MetricCard
          label="Battery"
          value={
            battery.level !== null
              ? battery.level.toFixed(0)
              : "N/A"
          }
          unit="%"
          icon={Battery}
          description={
            battery.charging
              ? "Charging"
              : "Discharging"
          }
        />

        <MetricCard
          label="CPU Threads"
          value={
            telemetry.cpuCores !== null
              ? String(
                  telemetry.cpuCores
                )
              : "N/A"
          }
          icon={Cpu}
          description="Logical processors"
        />

        <MetricCard
          label="Memory"
          value={
            telemetry.deviceMemoryGB !==
            null
              ? String(
                  telemetry.deviceMemoryGB
                )
              : "N/A"
          }
          unit="GB"
          icon={HardDrive}
          description="Browser-reported estimate"
        />

        <MetricCard
          label="Network"
          value={
            network.downlinkMbps !== null
              ? network.downlinkMbps.toFixed(1)
              : "N/A"
          }
          unit="Mbps"
          icon={Network}
          description={
            network.effectiveType
          }
        />

        <MetricCard
          label="RTT"
          value={
            network.rttMs !== null
              ? String(network.rttMs)
              : "N/A"
          }
          unit="ms"
          icon={Gauge}
          description="Connection estimate"
        />

        <MetricCard
          label="Browser Workload"
          value={telemetry.estimatedWorkload.toFixed(0)}
          unit="%"
          icon={Monitor}
          description="Estimated UI workload"
        />

        <MetricCard
          label="Display"
          value={`${telemetry.screenWidth}×${telemetry.screenHeight}`}
          icon={Smartphone}
          description={`DPR ${telemetry.devicePixelRatio}`}
        />

        <MetricCard
          label="Frame Rate"
          value={String(telemetry.fps)}
          unit="FPS"
          icon={Globe}
          description="Browser rendering rate"
        />
      </div>

      <div className="hardware-details">
        <div>
          <span>GPU Renderer</span>
          <strong>
            {telemetry.gpu.renderer}
          </strong>
        </div>

        <div>
          <span>GPU Vendor</span>
          <strong>
            {telemetry.gpu.vendor}
          </strong>
        </div>

        <div>
          <span>Platform</span>
          <strong>
            {telemetry.platform}
          </strong>
        </div>

        <div>
          <span>Connection</span>
          <strong>
            {network.type} ·{" "}
            {network.online
              ? "Online"
              : "Offline"}
          </strong>
        </div>
      </div>

      <div className="motion-panel">
        <div>
          <span className="section-kicker">
            MOTION SENSORS
          </span>

          <h3>
            Accelerometer & orientation
          </h3>

          <p>
            Browser access depends on the
            device and permission policy.
          </p>
        </div>

        {motion.permission !== "granted" && (
          <button
            className="primary-button"
            onClick={onMotionPermission}
          >
            Enable Motion
          </button>
        )}

        {motion.permission === "granted" && (
          <div className="sensor-values">
            <span>
              X{" "}
              {motion.acceleration.x.toFixed(
                2
              )}
            </span>

            <span>
              Y{" "}
              {motion.acceleration.y.toFixed(
                2
              )}
            </span>

            <span>
              Z{" "}
              {motion.acceleration.z.toFixed(
                2
              )}
            </span>

            <span>
              β{" "}
              {motion.rotation.beta.toFixed(
                1
              )}°
            </span>

            <span>
              γ{" "}
              {motion.rotation.gamma.toFixed(
                1
              )}°
            </span>
          </div>
        )}
      </div>
    </section>
  );
}
