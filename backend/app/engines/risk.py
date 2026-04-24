
def calculate_risk(resource_score: float, grid_distance_km: float, legal_risk: float, climate_risk: float, irr_pct: float):
    grid_score = max(0, min(100, 100 - grid_distance_km * 2.5))
    legal_score = max(0, min(100, 100 - legal_risk))
    climate_score = max(0, min(100, 100 - climate_risk))
    finance_score = max(0, min(100, (irr_pct - 4) * 8))
    total = resource_score * 0.30 + grid_score * 0.20 + legal_score * 0.15 + climate_score * 0.10 + finance_score * 0.25
    level = "bajo" if total >= 70 else "medio" if total >= 45 else "alto"
    return {
        "resource_score": resource_score,
        "grid_score": grid_score,
        "legal_score": legal_score,
        "climate_score": climate_score,
        "finance_score": finance_score,
        "total_score": total,
        "risk_level": level,
    }
