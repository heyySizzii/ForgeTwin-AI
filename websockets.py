from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from .config import get_settings
from .models import SystemTelemetry

def router_for(state):
    router = APIRouter()

    @router.websocket("/ws/dashboard")
    async def dashboard(ws: WebSocket):
        await ws.accept()
        state.dashboard_clients.add(ws)
        try:
            await ws.send_json({
                "event": "hello",
                "data": {
                    "devices": [x.model_dump(mode="json") for x in state.latest_devices.values()],
                    "machines": [x.model_dump(mode="json") for x in state.latest_machines.values()],
                },
            })
            while True:
                await ws.receive_text()
        except WebSocketDisconnect:
            state.dashboard_clients.discard(ws)
        except Exception:
            state.dashboard_clients.discard(ws)

    @router.websocket("/ws/telemetry/{agent_id}")
    async def agent(ws: WebSocket, agent_id: str):
        if ws.headers.get("x-api-key") != get_settings().api_key:
            await ws.close(code=1008, reason="Invalid API key")
            return

        await ws.accept()

        try:
            while True:
                raw = await ws.receive_json()
                data = SystemTelemetry.model_validate(raw)

                if data.agent_id != agent_id:
                    await ws.send_json({"event": "error", "detail": "agent_id mismatch"})
                    continue

                await state.add_device(data)
                await state.broadcast({
                    "event": "device_telemetry",
                    "data": data.model_dump(mode="json"),
                })
                await ws.send_json({"event": "ack", "agent_id": agent_id})
        except WebSocketDisconnect:
            pass

    return router
