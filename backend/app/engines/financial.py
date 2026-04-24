from math import isfinite


def npv(rate: float, cashflows: list[float]) -> float:
    return sum(cf / ((1 + rate) ** year) for year, cf in enumerate(cashflows))


def irr(cashflows: list[float], guess: float = 0.10) -> float:
    rate = guess
    for _ in range(80):
        value = 0.0
        derivative = 0.0
        for year, cf in enumerate(cashflows):
            value += cf / ((1 + rate) ** year)
            if year > 0:
                derivative -= year * cf / ((1 + rate) ** (year + 1))
        if abs(derivative) < 1e-9:
            break
        next_rate = rate - value / derivative
        if not isfinite(next_rate):
            break
        if abs(next_rate - rate) < 1e-7:
            return next_rate
        rate = max(-0.95, min(2.0, next_rate))
    return rate


def calculate_financials(
    capacity_mw: float,
    annual_mwh: float,
    capex_usd_per_mw: float,
    opex_pct: float,
    energy_price_usd_mwh: float,
    life_years: int,
    discount_rate_pct: float,
    connection_cost_usd: float = 0,
    degradation_pct: float = 0.5,
):
    capex_total = capacity_mw * capex_usd_per_mw + connection_cost_usd
    opex_annual = capex_total * (opex_pct / 100)
    year_1_revenue = annual_mwh * energy_price_usd_mwh
    ebitda = year_1_revenue - opex_annual

    cashflows = [-capex_total]
    energy = annual_mwh
    for year in range(1, life_years + 1):
        if year > 1:
            energy *= 1 - degradation_pct / 100
        cashflows.append(energy * energy_price_usd_mwh - opex_annual)

    discount_rate = discount_rate_pct / 100
    project_npv = npv(discount_rate, cashflows)
    project_irr = irr(cashflows) * 100
    payback = capex_total / ebitda if ebitda > 0 else None
    lcoe = ((capex_total * 0.085) + opex_annual) / annual_mwh if annual_mwh > 0 else None

    return {
        "capex_total": capex_total,
        "opex_annual": opex_annual,
        "revenue_annual": year_1_revenue,
        "ebitda_annual": ebitda,
        "lcoe": lcoe,
        "npv": project_npv,
        "irr": project_irr,
        "payback_years": payback,
        "cashflows": cashflows,
    }
