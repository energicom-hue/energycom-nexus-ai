"use client";

import { useState } from "react";
import { AlertTriangle, DollarSign, Download, Globe2, Sun, Wind, Zap } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

type AnalysisResult = {
  resource: any;
  financial: any;
  risk: any;
  assumptions: any;
};

const zones = [
  { region: "Arequipa", ghi: 6.2, wind: 6.8, grid: 18, legal: 35, climate: 28 },
  { region: "Ica", ghi: 6.0, wind: 5.7, grid: 12, legal: 25, climate: 22 },
  { region: "Piura", ghi: 5.8, wind: 7.4, grid: 25, legal: 30, climate: 45 },
  { region: "Moquegua", ghi: 6.4, wind: 6.1, grid: 20, legal: 38, climate: 25 },
];

function usd(v: number) {
  if (!Number.isFinite(v)) return "$0";
  if (Math.abs(v) >= 1_000_000) return `$${(v / 1_000_000).toFixed(2)}M`;
  if (Math.abs(v) >= 1_000) return `$${(v / 1_000).toFixed(1)}k`;
  return `$${v.toFixed(0)}`;
}

function num(v: number, d = 1) {
  return Number(v || 0).toLocaleString("en-US", { maximumFractionDigits: d });
}

function Card({ title, value, subtitle, icon: Icon }: any) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm border border-slate-200">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500">{title}</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{value}</p>
          <p className="mt-1 text-xs text-slate-500">{subtitle}</p>
        </div>
        <div className="rounded-xl bg-emerald-50 p-2"><Icon className="h-5 w-5 text-emerald-700" /></div>
      </div>
    </div>
  );
}

export default function Home() {
  const [technology, setTechnology] = useState("solar");
  const [areaHa, setAreaHa] = useState(120);
  const [price, setPrice] = useState(42);
  const [zone, setZone] = useState(zones[0]);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);

  async function analyze() {
    setLoading(true);
    const response = await fetch(`${API_URL}/analysis/prefeasibility`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        country: "PE",
        region: zone.region,
        area_ha: areaHa,
        technology,
        ghi_kwh_m2_day: zone.ghi,
        wind_speed_ms: zone.wind,
        grid_distance_km: zone.grid,
        legal_risk: zone.legal,
        climate_risk: zone.climate,
        energy_price_usd_mwh: price,
      }),
    });
    const data = await response.json();
    setResult(data);
    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-2xl bg-emerald-600 flex items-center justify-center"><Zap className="text-white" /></div>
            <div>
              <h1 className="text-2xl font-bold">Energycom Nexus AI</h1>
              <p className="text-sm text-slate-500">From Land to Power · MVP Perú</p>
            </div>
          </div>
          <button className="rounded-2xl bg-slate-900 text-white px-4 py-2 text-sm">Solicitar demo</button>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-8 grid lg:grid-cols-[1.05fr_0.95fr] gap-6">
        <div className="rounded-3xl bg-gradient-to-br from-emerald-100 via-sky-100 to-slate-200 min-h-[440px] p-5 relative overflow-hidden border border-slate-200">
          <div className="absolute inset-0 opacity-70" style={{ backgroundImage: "radial-gradient(circle at 25% 30%, rgba(16,185,129,.32), transparent 25%), radial-gradient(circle at 65% 60%, rgba(14,165,233,.3), transparent 30%)" }} />
          <div className="relative z-10 flex items-center gap-3">
            <Globe2 className="text-emerald-700" />
            <select
              className="rounded-2xl bg-white/90 px-4 py-3 shadow-sm flex-1 outline-none"
              value={zone.region}
              onChange={(e) => setZone(zones.find((z) => z.region === e.target.value) || zones[0])}
            >
              {zones.map((z) => <option key={z.region}>{z.region}</option>)}
            </select>
          </div>
          <div className="relative z-10 mt-20 mx-auto h-48 w-72 rotate-[-8deg] rounded-[2rem] border-4 border-emerald-600 bg-emerald-500/20 shadow-xl" />
          <div className="relative z-10 mt-16 grid grid-cols-3 gap-3">
            <div className="rounded-2xl bg-white/90 p-4"><p className="text-xs text-slate-500">GHI</p><strong>{zone.ghi} kWh/m²/día</strong></div>
            <div className="rounded-2xl bg-white/90 p-4"><p className="text-xs text-slate-500">Viento</p><strong>{zone.wind} m/s</strong></div>
            <div className="rounded-2xl bg-white/90 p-4"><p className="text-xs text-slate-500">Red</p><strong>{zone.grid} km</strong></div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
            <h2 className="text-xl font-bold">Análisis de prefactibilidad</h2>
            <p className="text-sm text-slate-600 mt-2">Calcula potencial, CAPEX, LCOE, VAN, TIR, payback y riesgo preliminar.</p>
            <div className="mt-5 space-y-5">
              <div>
                <label className="font-medium">Área: {areaHa} ha</label>
                <input className="w-full mt-2" type="range" min="20" max="1000" value={areaHa} onChange={(e) => setAreaHa(Number(e.target.value))} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => setTechnology("solar")} className={`rounded-2xl px-4 py-3 border ${technology === "solar" ? "bg-emerald-600 text-white" : "bg-white"}`}><Sun className="inline h-4 mr-2" />Solar</button>
                <button onClick={() => setTechnology("wind")} className={`rounded-2xl px-4 py-3 border ${technology === "wind" ? "bg-emerald-600 text-white" : "bg-white"}`}><Wind className="inline h-4 mr-2" />Eólico</button>
              </div>
              <div>
                <label className="font-medium">Precio energía: ${price}/MWh</label>
                <input className="w-full mt-2" type="range" min="25" max="90" value={price} onChange={(e) => setPrice(Number(e.target.value))} />
              </div>
              <button onClick={analyze} disabled={loading} className="w-full rounded-2xl bg-slate-900 text-white py-3 font-semibold">
                {loading ? "Analizando..." : "Ejecutar análisis"}
              </button>
            </div>
          </div>
        </div>
      </section>

      {result && (
        <section className="mx-auto max-w-7xl px-6 pb-10 space-y-6">
          <div className="grid md:grid-cols-4 gap-4">
            <Card icon={Zap} title="Capacidad" value={`${num(result.resource.capacity_mw)} MW`} subtitle="estimada" />
            <Card icon={Sun} title="Producción" value={`${num(result.resource.annual_mwh, 0)} MWh/año`} subtitle={`FP ${(result.resource.factor_plant * 100).toFixed(1)}%`} />
            <Card icon={DollarSign} title="CAPEX" value={usd(result.financial.capex_total)} subtitle="incluye conexión" />
            <Card icon={AlertTriangle} title="Riesgo" value={`${result.risk.total_score.toFixed(0)}/100`} subtitle={`nivel ${result.risk.risk_level}`} />
          </div>
          <div className="grid md:grid-cols-4 gap-4">
            <Card icon={DollarSign} title="LCOE" value={`$${result.financial.lcoe.toFixed(1)}/MWh`} subtitle="estimado" />
            <Card icon={DollarSign} title="VAN" value={usd(result.financial.npv)} subtitle="preliminar" />
            <Card icon={Zap} title="TIR" value={`${result.financial.irr.toFixed(1)}%`} subtitle="preliminar" />
            <Card icon={Download} title="Payback" value={`${result.financial.payback_years.toFixed(1)} años`} subtitle="simple" />
          </div>
        </section>
      )}
    </main>
  );
}
