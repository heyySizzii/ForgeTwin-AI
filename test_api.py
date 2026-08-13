from fastapi.testclient import TestClient
from app.main import app

def test_health():
    c = TestClient(app)
    r = c.get("/api/v1/health")
    assert r.status_code == 200
    assert r.json()["status"] == "ok"

def test_machine_endpoint():
    c = TestClient(app)
    r = c.get("/api/v1/machines/MTR-042")
    assert r.status_code == 200

def test_protected_ingestion():
    c = TestClient(app)
    r = c.post("/api/v1/agent/telemetry", json={})
    assert r.status_code == 401
