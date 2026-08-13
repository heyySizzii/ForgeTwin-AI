from datetime import datetime, timezone
from typing import Literal
from pydantic import BaseModel, Field

def utc_now() -> datetime:
    return datetime.now(timezone.utc)

class BatteryTelemetry(BaseModel):
    percent: float | None = Field(default=None, ge=0, le=100)
    plugged: bool | None = None
    seconds_left: int | None = Field(default=None, ge=-1)

class GpuTelemetry(BaseModel):
    name: str
    utilization_percent: float | None = Field(default=None, ge=0, le=100)
    memory_used_mb: float | None = Field(default=None, ge=0)
    memory_total_mb: float | None = Field(default=None, ge=0)
    temperature_c: float | None = None

class NetworkInterfaceTelemetry(BaseModel):
    name: str
    is_up: bool
    speed_mbps: float | None = Field(default=None, ge=0)
    rx_bytes: int = Field(ge=0)
    tx_bytes: int = Field(ge=0)
    rx_mbps: float = Field(ge=0)
    tx_mbps: float = Field(ge=0)

class SystemTelemetry(BaseModel):
    schema_version: str = "1.0"
    telemetry_type: Literal["device"] = "device"
    timestamp: datetime = Field(default_factory=utc_now)
    agent_id: str = Field(min_length=1, max_length=128)
    hostname: str
    platform: str
    platform_release: str
    architecture: str
    python_version: str

    cpu_percent: float = Field(ge=0, le=100)
    cpu_count_logical: int = Field(ge=1)
    cpu_count_physical: int | None = Field(default=None, ge=1)
    cpu_frequency_mhz: float | None = Field(default=None, ge=0)
    load_1m: float | None = Field(default=None, ge=0)

    ram_total_mb: float = Field(ge=0)
    ram_used_mb: float = Field(ge=0)
    ram_percent: float = Field(ge=0, le=100)
    swap_percent: float = Field(ge=0, le=100)

    disk_total_gb: float = Field(ge=0)
    disk_used_gb: float = Field(ge=0)
    disk_percent: float = Field(ge=0, le=100)

    process_count: int = Field(ge=0)
    battery: BatteryTelemetry | None = None
    network: list[NetworkInterfaceTelemetry] = []
    gpus: list[GpuTelemetry] = []
    motherboard_temperatures_c: dict[str, float] = {}
    motion: dict[str, float] | None = None

class MachineTelemetry(BaseModel):
    schema_version: str = "1.0"
    telemetry_type: Literal["machine"] = "machine"
    timestamp: datetime = Field(default_factory=utc_now)
    machine_id: str
    machine_name: str
    simulated: bool = True

    rpm: float = Field(ge=0)
    temperature_c: float
    vibration_mm_s: float = Field(ge=0)
    current_a: float = Field(ge=0)
    voltage_v: float = Field(ge=0)
    load_percent: float = Field(ge=0, le=100)
    pressure_bar: float = Field(ge=0)

    health_score: float = Field(ge=0, le=100)
    risk_percent: float = Field(ge=0, le=100)
    state: Literal["healthy", "warning", "critical"]
    affected_component: str | None = None
