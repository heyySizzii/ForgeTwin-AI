import { useMemo, useState } from "react";

import type { MachineTelemetry } from "../types/telemetry";

interface Props {
  telemetry: MachineTelemetry;
}

export function WhatIfSimulator({
  telemetry
}: Props) {
  const [
    rpmMultiplier,
    setRpmMultiplier
  ] = useState(1);

  const result = useMemo(() => {
    const rpm =
      telemetry.rpm *
      rpmMultiplier;

    const loadFactor =
      rpmMultiplier - 1;

    const temperature =
      telemetry.temperature +
      Math.max(
        0,
        loadFactor
      ) *
        18;

    const vibration =
      telemetry.vibration *
      (1 + Math.max(0, loadFactor) * 1.8);

    const risk =
      Math.min(
        100,
        telemetry.risk +
          Math.max(
            0,
            loadFactor
          ) *
            35
      );

    return {
      rpm,
      temperature,
      vibration,
      risk
    };
  }, [
    telemetry,
    rpmMultiplier
  ]);

  return (
    <section className="panel what-if">
      <div className="panel-title">
        <div>
          <span className="section-kicker">
            EXPERIMENTAL MODEL
          </span>

          <h2>
            What-if simulation
          </h2>
        </div>
      </div>

      <p className="experimental-note">
        Prototype browser-side scenario
        model. These relationships are
        experimental and are not industrially
        validated.
      </p>

      <label className="range-label">
        RPM multiplier

        <strong>
          {rpmMultiplier.toFixed(2)}×
        </strong>
      </label>

      <input
        className="range"
        type="range"
        min="0.7"
        max="1.4"
        step="0.01"
        value={rpmMultiplier}
        onChange={(event) =>
          setRpmMultiplier(
            Number(event.target.value)
          )
        }
      />

      <div className="scenario-grid">
        <div>
          <span>RPM</span>
          <strong>
            {Math.round(
              result.rpm
            )}
          </strong>
        </div>

        <div>
          <span>Temperature</span>
          <strong>
            {result.temperature.toFixed(
              1
            )}°C
          </strong>
        </div>

        <div>
          <span>Vibration</span>
          <strong>
            {result.vibration.toFixed(
              2
            )}
          </strong>
        </div>

        <div>
          <span>Risk</span>
          <strong>
            {result.risk.toFixed(0)}%
          </strong>
        </div>
      </div>
    </section>
  );
}
