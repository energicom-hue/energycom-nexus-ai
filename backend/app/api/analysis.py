from fastapi import APIRouter
from app.schemas.analysis import AnalysisRequest, AnalysisResponse
from app.engines.resource import calculate_solar, calculate_wind
from app.engines.financial import calculate_financials
from app.engines.risk import calculate_risk

router = APIRouter(prefix="/analysis", tags=["analysis"])

@router.post("/prefeasibility", response_model=AnalysisResponse)
def prefeasibility(payload: AnalysisRequest):
    if payload.technology == "solar":
        resource = calculate_solar(payload.area_ha, payload.ghi_kwh_m2_day)
        capex_unit = payload.capex_solar_usd_mw
        resource_score = min(100, payload.ghi_kwh_m2_day * 15)
        degradation = 0.5
    else:
        resource = calculate_wind(payload.area_ha, payload.wind_speed_ms)
        capex_unit = payload.capex_wind_usd_mw
        resource_score = min(100, payload.wind_speed_ms * 12)
        degradation = 0.0

    connection_cost = payload.grid_distance_km * payload.connection_cost_usd_km
    financial = calculate_financials(
        capacity_mw=resource["capacity_mw"],
        annual_mwh=resource["annual_mwh"],
        capex_usd_per_mw=capex_unit,
        opex_pct=payload.opex_pct,
        energy_price_usd_mwh=payload.energy_price_usd_mwh,
        life_years=payload.life_years,
        discount_rate_pct=payload.discount_rate_pct,
        connection_cost_usd=connection_cost,
        degradation_pct=degradation,
    )
    risk = calculate_risk(
        resource_score=resource_score,
        grid_distance_km=payload.grid_distance_km,
        legal_risk=payload.legal_risk,
        climate_risk=payload.climate_risk,
        irr_pct=financial["irr"],
    )
    return {
        "resource": resource,
        "financial": financial,
        "risk": risk,
        "assumptions": payload.model_dump(),
    }
