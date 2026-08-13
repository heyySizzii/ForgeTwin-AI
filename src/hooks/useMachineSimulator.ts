import {
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";

import type {
  MachinePoint,
  MachineStatus,
  MachineTelemetry
} from "../types/telemetry";

function clamp(
  value: number,
  min: number,
  max: number
) {
  return Math.min(
    max,
    Math.max(min, value)
  );
}

function noise(
  amount: number
) {
  return (
    Math.random() * amount * 2 -
    amount
  );
}

export function useMachineSimulator() {
  const [telemetry, setTelemetry] =
    useState<MachineTelemetry>(() =>
      createInitialTelemetry()
    );

  const [history, setHistory] =
    useState<MachinePoint[]>([]);

  const [running, setRunning] =
    useState(true);

  const degradationRef =
    useRef(0);

  useEffect(() => {
    if (!running) {
      return;
    }

    const interval =
      window.setInterval(() => {
        degradationRef.current =
          clamp(
            degradationRef.current +
              Math.random() * 0.035,
            0,
            100
          );

        const degradation =
          degradationRef.current;

        const rpm =
          1500 +
          noise(12) -
          degradation * 1.15;

        const temperature =
          38 +
          degradation * 0.24 +
          noise(1.5);

        const vibration =
          0.35 +
          degradation * 0.035 +
          Math.abs(noise(0.08));

        const current =
          5.8 +
          degradation * 0.025 +
          noise(0.15);

        const load =
          clamp(
            42 +
              degradation * 0.12 +
              noise(2),
            0,
            100
          );

        const pressure =
          3.4 +
          degradation * 0.015 +
          noise(0.08);

        const healthScore =
          clamp(
            100 -
              degradation * 0.9 -
              vibration * 3,
            0,
            100
          );

        const risk =
          clamp(
            degradation * 0.95 +
              vibration * 4,
            0,
            100
          );

        const status: MachineStatus =
          risk >= 75
            ? "CRITICAL"
            : risk >= 35
              ? "WARNING"
              : "HEALTHY";

        const next: MachineTelemetry = {
          timestamp: Date.now(),

          rpm,
          temperature,
          vibration,
          current,
          voltage: 230 + noise(2),
          load,
          pressure,

          healthScore,
          risk,

          status,

          degradation
        };

        setTelemetry(next);

        setHistory((previous) => [
          ...previous.slice(-59),
          {
            time: new Date(
              next.timestamp
            ).toLocaleTimeString([], {
              minute: "2-digit",
              second: "2-digit"
            }),

            rpm: Math.round(rpm),

            temperature:
              Number(
                temperature.toFixed(1)
              ),

            vibration:
              Number(
                vibration.toFixed(2)
              ),

            current:
              Number(
                current.toFixed(2)
              ),

            load:
              Number(
                load.toFixed(1)
              )
          }
        ]);
      }, 1000);

    return () =>
      window.clearInterval(interval);
  }, [running]);

  const machine = useMemo(
    () => ({
      id: "MTR-042",
      name: "Primary Drive Motor",
      components: [
        "Electric Motor",
        "Gearbox",
        "Bearing",
        "Shaft"
      ]
    }),
    []
  );

  return {
    machine,
    telemetry,
    history,
    running,
    setRunning
  };
}

function createInitialTelemetry(): MachineTelemetry {
  return {
    timestamp: Date.now(),
    rpm: 1500,
    temperature: 38,
    vibration: 0.35,
    current: 5.8,
    voltage: 230,
    load: 42,
    pressure: 3.4,
    healthScore: 95,
    risk: 5,
    status: "HEALTHY",
    degradation: 0
  };
}
