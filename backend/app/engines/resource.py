
def calculate_solar(area_ha: float, ghi_kwh_m2_day: float, mw_per_ha: float = 0.75):
    capacity_mw = area_ha * mw_per_ha
    factor_plant = min(0.31, max(0.17, ghi_kwh_m2_day / 24))
    annual_mwh = capacity_mw * factor_plant * 8760
    return {
        "technology": "solar",
        "capacity_mw": capacity_mw,
        "factor_plant": factor_plant,
        "annual_mwh": annual_mwh,
        "resource_value": ghi_kwh_m2_day,
        "resource_unit": "kWh/m2/day",
    }


def calculate_wind(area_ha: float, wind_speed_ms: float, mw_per_ha: float = 0.18):
    capacity_mw = area_ha * mw_per_ha
    factor_plant = min(0.46, max(0.18, (wind_speed_ms - 3) / 10))
    annual_mwh = capacity_mw * factor_plant * 8760
    return {
        "technology": "wind",
        "capacity_mw": capacity_mw,
        "factor_plant": factor_plant,
        "annual_mwh": annual_mwh,
        "resource_value": wind_speed_ms,
        "resource_unit": "m/s",
    }
