from app.simulator import IndustrialSimulator
from app.state import AppState

def test_seed_is_reproducible():
    a = IndustrialSimulator(AppState(), seed=42)
    b = IndustrialSimulator(AppState(), seed=42)
    x, y = a.sample(), b.sample()
    assert x.rpm == y.rpm
    assert x.temperature_c == y.temperature_c
    assert x.simulated is True

def test_ranges():
    x = IndustrialSimulator(AppState()).sample()
    assert x.rpm >= 0
    assert 0 <= x.health_score <= 100
    assert 0 <= x.risk_percent <= 100
