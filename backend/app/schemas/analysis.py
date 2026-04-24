from pydantic import BaseModel, Field
from typing import Literal

class AnalysisRequest(BaseModel):
    country: str = "PE"
    region: str = "Arequipa"
    area_ha: float = Field(gt=0)
    technology: Literal["solar", "wind"] = "solar"
    ghi_kwh_m2_day: float = 6.2
    wind_speed_ms: float = 6.8
    grid_distance_km: float = 18
    legal_risk: float = 35
    climate_risk: float = 28
    capex_solar_usd_mw: float = 820000
    capex_wind_usd_mw: float = 1450000
    opex_pct: float = 2.0
    energy_price_usd_mwh: float = 42
    life_years: int = 25
    discount_rate_pct: float = 10
    connection_cost_usd_km: float = 90000

class AnalysisResponse(BaseModel):
    resource: dict
    financial: dict
    risk: dict
    assumptions: dict
