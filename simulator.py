import asyncio
import math
import random
from datetime import datetime, timezone

from .models import MachineTelemetry

class IndustrialSimulator:
    def __init__(self, state, seed=42, interval=1.0):
        self.state = state
        self.rng = random.Random(seed)
        self.interval = interval
        self.phase = 0.0

    def sample(self, machine_id="MTR-042"):
        self.phase += 0.08
        degradation = (math.sin(self.phase / 20) + 1) / 2

        rpm = 1500 + 18 * math.sin(self.phase) + self.rng.gauss(0, 4)
        load = max(5, min(100, 48 + 8 * math.sin(self.phase / 3) + self.rng.gauss(0, 2)))
        temperature = 39 + 0.11 * load + 3.5 * degradation + self.rng.gauss(0, 0.7)
        vibration = 0.42 + 0.012 * load + 0.34 * degradation + self.rng.gauss(0, 0.04)
        current = 5.8 + 0.012 * load + 0.7 * degradation + self.rng.gauss(0, 0.08)
        voltage = 400 + self.rng.gauss(0, 1.5)
        pressure = 5.1 + 0.005 * load + self.rng.gauss(0, 0.08)

        risk = max(0, min(
            100,
            0.45 * max(0, vibration - 0.9) * 60
            + 0.35 * max(0, temperature - 50) * 3
            + 20 * degradation,
        ))

        state = "critical" if risk >= 65 else "warning" if risk >= 30 else "healthy"
        component = "Bearing" if vibration > 0.9 else None

        return MachineTelemetry(
            timestamp=datetime.now(timezone.utc),
            machine_id=machine_id,
            machine_name="Motor-Gearbox Test Rig",
            rpm=max(0, rpm),
            temperature_c=temperature,
            vibration_mm_s=max(0, vibration),
            current_a=max(0, current),
            voltage_v=max(0, voltage),
            load_percent=load,
            pressure_bar=max(0, pressure),
            health_score=100 - risk,
            risk_percent=risk,
            state=state,
            affected_component=component,
            simulated=True,
        )

    async def run(self):
        while True:
            item = self.sample()
            await self.state.add_machine(item)
            await self.state.broadcast({
                "event": "machine_telemetry",
                "data": item.model_dump(mode="json"),
            })
            await asyncio.sleep(self.interval)
