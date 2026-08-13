from fastapi import APIRouter, Depends, Query
from .auth import require_api_key
from .models import SystemTelemetry

def router_for(state):
    router = APIRouter(prefix="/api/v1")

    @router.get("/health")
    async def health():
        return {"status": "ok", "service": "forge-twin-ai-backend"}

    @router.get("/devices")
    async def devices():
        return await state.device_summaries()

    @router.get("/system/latest/{agent_id}")
    async def latest(agent_id: str):
        item = state.latest_devices.get(agent_id)
        return {"agent_id": agent_id, "telemetry": item.model_dump(mode="json") if item else None}

    @router.get("/system/history/{agent_id}")
    async def history(agent_id: str, limit: int = Query(100, ge=1, le=300)):
        items = list(state.device_history.get(agent_id, []))[-limit:]
        return {"agent_id": agent_id, "items": [x.model_dump(mode="json") for x in items]}

    @router.get("/machines")
    async def machines():
        return [x.model_dump(mode="json") for x in state.latest_machines.values()]

    @router.get("/machines/{machine_id}")
    async def machine(machine_id: str):
        item = state.latest_machines.get(machine_id)
        return {"machine_id": machine_id, "telemetry": item.model_dump(mode="json") if item else None}

    @router.post("/agent/telemetry", dependencies=[Depends(require_api_key)])
    async def ingest(data: SystemTelemetry):
        await state.add_device(data)
        await state.broadcast({"event": "device_telemetry", "data": data.model_dump(mode="json")})
        return {"accepted": True, "agent_id": data.agent_id}

    return router
