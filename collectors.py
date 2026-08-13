import platform
import socket
import time
from datetime import datetime, timezone

import psutil

from app.models import (
    BatteryTelemetry,
    GpuTelemetry,
    NetworkInterfaceTelemetry,
    SystemTelemetry,
)

class HardwareCollector:
    def __init__(self, agent_id):
        self.agent_id = agent_id
        self.previous_net = psutil.net_io_counters(pernic=True)
        self.previous_time = time.monotonic()
        psutil.cpu_percent(interval=None)

    def gpus(self):
        try:
            import pynvml
            pynvml.nvmlInit()
            result = []
            for index in range(pynvml.nvmlDeviceGetCount()):
                handle = pynvml.nvmlDeviceGetHandleByIndex(index)
                name = pynvml.nvmlDeviceGetName(handle)
                if isinstance(name, bytes):
                    name = name.decode(errors="replace")
                util = pynvml.nvmlDeviceGetUtilizationRates(handle)
                mem = pynvml.nvmlDeviceGetMemoryInfo(handle)
                try:
                    temp = float(pynvml.nvmlDeviceGetTemperature(
                        handle, pynvml.NVML_TEMPERATURE_GPU
                    ))
                except Exception:
                    temp = None
                result.append(GpuTelemetry(
                    name=str(name),
                    utilization_percent=float(util.gpu),
                    memory_used_mb=mem.used / 1024**2,
                    memory_total_mb=mem.total / 1024**2,
                    temperature_c=temp,
                ))
            return result
        except Exception:
            return []

    def network(self):
        now = time.monotonic()
        elapsed = max(now - self.previous_time, 0.001)
        current = psutil.net_io_counters(pernic=True)
        stats = psutil.net_if_stats()
        result = []

        for name, counters in current.items():
            old = self.previous_net.get(name)
            rx = tx = 0.0
            if old:
                rx = max(0, counters.bytes_recv - old.bytes_recv) * 8 / elapsed / 1e6
                tx = max(0, counters.bytes_sent - old.bytes_sent) * 8 / elapsed / 1e6

            s = stats.get(name)
            result.append(NetworkInterfaceTelemetry(
                name=name,
                is_up=bool(s.isup) if s else False,
                speed_mbps=float(s.speed) if s and s.speed else None,
                rx_bytes=counters.bytes_recv,
                tx_bytes=counters.bytes_sent,
                rx_mbps=rx,
                tx_mbps=tx,
            ))

        self.previous_net = current
        self.previous_time = now
        return result

    def collect(self):
        ram = psutil.virtual_memory()
        swap = psutil.swap_memory()
        disk = psutil.disk_usage("/")

        freq = psutil.cpu_freq()
        battery_raw = psutil.sensors_battery()
        battery = None
        if battery_raw:
            battery = BatteryTelemetry(
                percent=float(battery_raw.percent),
                plugged=battery_raw.power_plugged,
                seconds_left=int(battery_raw.secsleft) if battery_raw.secsleft >= 0 else None,
            )

        try:
            load = float(psutil.getloadavg()[0])
        except (AttributeError, OSError):
            load = None

        temps = {}
        try:
            for group, readings in psutil.sensors_temperatures(fahrenheit=False).items():
                for reading in readings:
                    if reading.current is not None:
                        temps[f"{group}:{reading.label or 'sensor'}"] = float(reading.current)
        except (AttributeError, OSError):
            pass

        return SystemTelemetry(
            timestamp=datetime.now(timezone.utc),
            agent_id=self.agent_id,
            hostname=socket.gethostname(),
            platform=platform.system(),
            platform_release=platform.release(),
            architecture=platform.machine(),
            python_version=platform.python_version(),
            cpu_percent=float(psutil.cpu_percent(interval=None)),
            cpu_count_logical=psutil.cpu_count(True) or 1,
            cpu_count_physical=psutil.cpu_count(False),
            cpu_frequency_mhz=float(freq.current) if freq else None,
            load_1m=load,
            ram_total_mb=ram.total / 1024**2,
            ram_used_mb=ram.used / 1024**2,
            ram_percent=float(ram.percent),
            swap_percent=float(swap.percent),
            disk_total_gb=disk.total / 1024**3,
            disk_used_gb=disk.used / 1024**3,
            disk_percent=float(disk.percent),
            process_count=len(psutil.pids()),
            battery=battery,
            network=self.network(),
            gpus=self.gpus(),
            motherboard_temperatures_c=temps,
            motion=None,
        )
