import { motion } from "framer-motion";

import type {
  MachineStatus,
  MachineTelemetry
} from "../types/telemetry";

interface Props {
  telemetry: MachineTelemetry;
}

function getStateClass(
  status: MachineStatus
) {
  if (status === "CRITICAL") {
    return "twin-critical";
  }

  if (status === "WARNING") {
    return "twin-warning";
  }

  return "twin-healthy";
}

export function DigitalTwin({
  telemetry
}: Props) {
  const stateClass =
    getStateClass(
      telemetry.status
    );

  return (
    <section className="twin-container">
      <div className="twin-header">
        <div>
          <span className="section-kicker">
            DIGITAL TWIN
          </span>

          <h2>
            MTR-042
          </h2>
        </div>

        <span className={`twin-status ${stateClass}`}>
          {telemetry.status}
        </span>
      </div>

      <div className={`twin-stage ${stateClass}`}>
        <div className="twin-grid" />

        <motion.div
          className="motor-body"
          animate={{
            rotateY: [0, 360]
          }}
          transition={{
            duration:
              Math.max(
                2,
                1500 /
                  telemetry.rpm
              ),
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <div className="motor-front">
            <div className="motor-fan">
              <span />
              <span />
              <span />
              <span />
            </div>
          </div>

          <div className="motor-core" />

          <div className="motor-gearbox">
            <div />
            <div />
          </div>
        </motion.div>

        <div className="twin-label label-motor">
          MOTOR
        </div>

        <div className="twin-label label-bearing">
          BEARING
        </div>

        <div className="twin-label label-gearbox">
          GEARBOX
        </div>

        <div className="twin-telemetry">
          <span>
            RPM{" "}
            <strong>
              {Math.round(
                telemetry.rpm
              )}
            </strong>
          </span>

          <span>
            TEMP{" "}
            <strong>
              {telemetry.temperature.toFixed(
                1
              )}°C
            </strong>
          </span>

          <span>
            VIB{" "}
            <strong>
              {telemetry.vibration.toFixed(
                2
              )}
            </strong>
          </span>
        </div>
      </div>
    </section>
  );
}
