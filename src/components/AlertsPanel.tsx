import {
  AlertTriangle,
  CheckCircle2,
  ShieldAlert
} from "lucide-react";

import type { MachineTelemetry } from "../types/telemetry";

interface Props {
  telemetry: MachineTelemetry;
}

export function AlertsPanel({
  telemetry
}: Props) {
  const critical =
    telemetry.status ===
    "CRITICAL";

  const warning =
    telemetry.status ===
    "WARNING";

  return (
    <section className="panel alerts">
      <div className="panel-title">
        <div>
          <span className="section-kicker">
            INTELLIGENCE
          </span>

          <h2>
            Live machine analysis
          </h2>
        </div>
      </div>

      {critical && (
        <div className="alert-box critical">
          <ShieldAlert size={22} />

          <div>
            <strong>
              Critical machine condition
            </strong>

            <p>
              Simulated degradation has
              crossed the critical risk
              threshold.
            </p>
          </div>
        </div>
      )}

      {warning && (
        <div className="alert-box warning">
          <AlertTriangle size={22} />

          <div>
            <strong>
              Degradation detected
            </strong>

            <p>
              Simulated vibration and
              temperature are trending
              above baseline.
            </p>
          </div>
        </div>
      )}

      {!warning && !critical && (
        <div className="alert-box healthy">
          <CheckCircle2 size={22} />

          <div>
            <strong>
              Operating normally
            </strong>

            <p>
              Simulated machine telemetry
              remains within the normal
              operating envelope.
            </p>
          </div>
        </div>
      )}

      <div className="analysis-grid">
        <div>
          <span>Health Score</span>
          <strong>
            {telemetry.healthScore.toFixed(
              0
            )}%
          </strong>
        </div>

        <div>
          <span>Risk</span>
          <strong>
            {telemetry.risk.toFixed(0)}%
          </strong>
        </div>

        <div>
          <span>Degradation</span>
          <strong>
            {telemetry.degradation.toFixed(
              1
            )}%
          </strong>
        </div>
      </div>
    </section>
  );
}
