from collections import defaultdict, deque
from datetime import datetime, timedelta, timezone
import asyncio

class AppState:
    def __init__(self, history_limit: int = 300):
        self.latest_devices = {}
        self.device_history = defaultdict(lambda: deque(maxlen=history_limit))
        self.latest_machines = {}
        self.machine_history = defaultdict(lambda: deque(maxlen=history_limit))
        self.dashboard_clients = set()
        self.lock = asyncio.Lock()

    async def add_device(self, data):
        async with self.lock:
            self.latest_devices[data.agent_id] = data
            self.device_history[data.agent_id].append(data)

    async def add_machine(self, data):
        async with self.lock:
            self.latest_machines[data.machine_id] = data
            self.machine_history[data.machine_id].append(data)

    async def broadcast(self, payload):
        dead = []
        for ws in list(self.dashboard_clients):
            try:
                await ws.send_json(payload)
            except Exception:
                dead.append(ws)
        for ws in dead:
            self.dashboard_clients.discard(ws)

    async def device_summaries(self):
        now = datetime.now(timezone.utc)
        async with self.lock:
            return [
                {
                    "agent_id": x.agent_id,
                    "hostname": x.hostname,
                    "last_seen": x.timestamp,
                    "online": now - x.timestamp <= timedelta(seconds=5),
                }
                for x in self.latest_devices.values()
            ]
