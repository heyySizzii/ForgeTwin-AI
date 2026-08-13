# ForgeTwin AI — Backend + Local Hardware Telemetry Agent

This repository provides the backend layer for ForgeTwin AI.

## Critical architecture fact

A deployed cloud backend **cannot directly read the CPU/RAM/GPU/battery of a user's laptop**. The `agent/` program must run locally on the device whose hardware you want to inspect, then stream telemetry to the deployed FastAPI server.

```text
Your PC
  │
  ├─ Python hardware agent
  │    └─ psutil / optional NVIDIA NVML
  │
  │ WebSocket + API key
  ▼
FastAPI backend
  ├─ REST API
  ├─ dashboard WebSocket
  └─ industrial simulator
        │
        ▼
     React frontend
```

All industrial machine values are clearly marked as `simulated: true`.

## Local run

```bash
python -m venv .venv
# Windows: .venv\Scripts\activate
# Linux/macOS: source .venv/bin/activate

pip install -r requirements.txt
cp .env.example .env

uvicorn app.main:app --reload
```

API:
- `http://localhost:8000/`
- `http://localhost:8000/docs`
- `http://localhost:8000/api/v1/health`

Run the hardware agent in another terminal:

```bash
python -m agent.main --server ws://localhost:8000 --api-key change-me --interval 1
```

## Hosted deployment

Deploy the backend with Docker or a WebSocket-compatible Python host.

Set these environment variables:

```env
ENVIRONMENT=production
API_KEY=<long-random-secret>
CORS_ORIGINS=https://your-frontend-domain.example
```

Then run the local agent against the hosted backend:

```bash
python -m agent.main \
  --server wss://your-backend.example \
  --api-key <same-secret> \
  --interval 1
```

**Do not put the agent API key in frontend JavaScript.**

## Main API

`GET /api/v1/health`

`GET /api/v1/devices`

`GET /api/v1/system/latest/{agent_id}`

`GET /api/v1/system/history/{agent_id}?limit=100`

`GET /api/v1/machines`

`GET /api/v1/machines/{machine_id}`

`POST /api/v1/agent/telemetry` with `X-API-Key`

WebSockets:

`WS /ws/dashboard`

`WS /ws/telemetry/{agent_id}` with `X-API-Key`

## Hardware collection

The agent reports values the OS exposes:

- CPU usage/count/frequency/load
- RAM and swap
- disk
- process count
- network interfaces, counters and calculated bandwidth
- battery when available
- NVIDIA GPU telemetry when `pynvml` works
- temperature sensors when the OS exposes them
- OS/host/Python details

Unavailable hardware is represented as `null` or an empty list. The agent never invents readings.

Motion sensors are intentionally `null` unless a real platform-specific sensor adapter is added.

## Tests

```bash
pytest -q
```

## Docker

```bash
docker compose up --build
```

The Docker container is the cloud/server component. Do not expect it to expose the host laptop's hardware unless you intentionally run the agent on that same host.
