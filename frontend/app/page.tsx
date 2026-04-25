"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, Building2, DollarSign, Download, FileText, Globe2, Landmark, MapPin, Scale, Sun, Users, Wind, Zap } from "lucide-react";

type Zone = {
  region: string;
  macro: string;
  ghi: number;
  wind: number;
  grid: number;
  legal: number;
  climate: number;
  lat: number;
  lon: number;
  note: string;
};

type Result = {
  capacityMW: number;
  factorPlant: number;
  annualMWh: number;
  capexEquipment: number;
  capexTotal: number;
  opexAnnual: number;
  revenueAnnual: number;
  ebitda: number;
  lcoe: number;
  npv: number;
  irr: number;
  payback: number;
  riskScore: number;
  riskLevel: string;
  connectionCost: number;
  adjustedGhi: number;
  adjustedWind: number;
  crf: number;
  resourceScore: number;
  financeScore: number;
  gridScore: number;
  legalScore: number;
  climateScore: number;
  cashflows: number[];
};

const zones: Zone[] = [
  { region: "Amazonas", macro: "Nororiente", ghi: 4.7, wind: 4.1, grid: 38, legal: 42, climate: 48, lat: -6.23, lon: -77.87, note: "Zona con recurso solar medio y alta sensibilidad ambiental." },
  { region: "Áncash", macro: "Costa/Sierra centro", ghi: 5.5, wind: 5.8, grid: 22, legal: 38, climate: 34, lat: -9.53, lon: -77.53, note: "Potencial solar medio-alto y oportunidades cerca de corredores eléctricos." },
  { region: "Apurímac", macro: "Sierra sur", ghi: 5.7, wind: 5.1, grid: 34, legal: 45, climate: 36, lat: -13.63, lon: -72.88, note: "Recurso solar alto, revisar acceso y restricciones territoriales." },
  { region: "Arequipa", macro: "Sur", ghi: 6.2, wind: 6.8, grid: 18, legal: 35, climate: 28, lat: -16.41, lon: -71.54, note: "Alto recurso solar y buen potencial para proyectos utility-scale." },
  { region: "Ayacucho", macro: "Sierra sur", ghi: 5.8, wind: 5.4, grid: 36, legal: 44, climate: 38, lat: -13.16, lon: -74.22, note: "Buen recurso solar, requiere revisión de accesibilidad y red." },
  { region: "Cajamarca", macro: "Norte", ghi: 5.0, wind: 4.8, grid: 30, legal: 48, climate: 42, lat: -7.16, lon: -78.51, note: "Recurso medio, revisar interacción con concesiones y áreas sensibles." },
  { region: "Callao", macro: "Costa centro", ghi: 5.1, wind: 5.2, grid: 8, legal: 55, climate: 30, lat: -12.06, lon: -77.12, note: "Alta cercanía a red, limitada disponibilidad de suelo." },
  { region: "Cusco", macro: "Sierra sur", ghi: 5.4, wind: 4.9, grid: 32, legal: 50, climate: 40, lat: -13.52, lon: -71.97, note: "Recurso solar medio-alto, revisar patrimonio, uso de suelo y permisos." },
  { region: "Huancavelica", macro: "Sierra centro", ghi: 5.6, wind: 5.7, grid: 29, legal: 43, climate: 37, lat: -12.79, lon: -74.97, note: "Buen potencial solar/eólico preliminar en zonas altoandinas." },
  { region: "Huánuco", macro: "Centro", ghi: 5.0, wind: 4.3, grid: 33, legal: 42, climate: 45, lat: -9.93, lon: -76.24, note: "Recurso medio, revisar topografía y accesibilidad." },
  { region: "Ica", macro: "Costa sur", ghi: 6.0, wind: 5.7, grid: 12, legal: 25, climate: 22, lat: -14.07, lon: -75.73, note: "Alta irradiación y buena accesibilidad para proyectos solares." },
  { region: "Junín", macro: "Centro", ghi: 5.1, wind: 4.8, grid: 24, legal: 42, climate: 40, lat: -12.07, lon: -75.21, note: "Recurso medio y cercanía relativa a centros de demanda." },
  { region: "La Libertad", macro: "Norte", ghi: 5.6, wind: 6.2, grid: 20, legal: 35, climate: 32, lat: -8.11, lon: -79.03, note: "Potencial solar y eólico competitivo en costa norte." },
  { region: "Lambayeque", macro: "Norte", ghi: 5.7, wind: 6.5, grid: 18, legal: 33, climate: 38, lat: -6.77, lon: -79.84, note: "Buen recurso eólico y solar, revisar riesgos climáticos." },
  { region: "Lima", macro: "Costa centro", ghi: 5.3, wind: 5.4, grid: 10, legal: 45, climate: 28, lat: -12.05, lon: -77.04, note: "Muy buena cercanía a red y demanda, suelo más competitivo." },
  { region: "Loreto", macro: "Amazonía", ghi: 4.5, wind: 3.8, grid: 55, legal: 55, climate: 55, lat: -3.75, lon: -73.25, note: "Más adecuado para soluciones aisladas o híbridas que utility-scale." },
  { region: "Madre de Dios", macro: "Amazonía", ghi: 4.8, wind: 3.9, grid: 50, legal: 58, climate: 52, lat: -12.59, lon: -69.19, note: "Requiere alta revisión ambiental y legal." },
  { region: "Moquegua", macro: "Sur", ghi: 6.4, wind: 6.1, grid: 20, legal: 38, climate: 25, lat: -17.19, lon: -70.94, note: "Muy alto recurso solar y buen potencial para grandes proyectos." },
  { region: "Pasco", macro: "Centro", ghi: 5.0, wind: 5.0, grid: 31, legal: 50, climate: 42, lat: -10.68, lon: -76.26, note: "Revisar topografía, clima, concesiones y acceso." },
  { region: "Piura", macro: "Norte", ghi: 5.8, wind: 7.4, grid: 25, legal: 30, climate: 45, lat: -5.19, lon: -80.63, note: "Potencial eólico y solar, atención a El Niño." },
  { region: "Puno", macro: "Altiplano", ghi: 6.0, wind: 5.9, grid: 30, legal: 40, climate: 42, lat: -15.84, lon: -70.02, note: "Alto recurso solar, revisar altura, accesibilidad y conexión." },
  { region: "San Martín", macro: "Nororiente", ghi: 4.9, wind: 4.2, grid: 36, legal: 44, climate: 48, lat: -6.49, lon: -76.36, note: "Recurso medio y sensibilidad ambiental relevante." },
  { region: "Tacna", macro: "Sur", ghi: 6.5, wind: 6.3, grid: 19, legal: 34, climate: 24, lat: -18.01, lon: -70.25, note: "Excelente recurso solar y potencial competitivo." },
  { region: "Tumbes", macro: "Norte", ghi: 5.7, wind: 6.9, grid: 26, legal: 36, climate: 48, lat: -3.57, lon: -80.45, note: "Potencial eólico/solar, revisar riesgos climáticos." },
  { region: "Ucayali", macro: "Amazonía", ghi: 4.8, wind: 4.0, grid: 45, legal: 50, climate: 52, lat: -8.38, lon: -74.55, note: "Potencial más favorable para soluciones híbridas y aisladas." },
];

const assumptions = {
  solarMwHa: 0.75,
  windMwHa: 0.18,
  solarCapex: 820000,
  windCapex: 1450000,
  solarOpex: 0.02,
  windOpex: 0.03,
  connectionUsdKm: 90000,
  lifeYears: 25,
  discountRate: 0.1,
  solarDegradation: 0.005,
  capitalRecoveryFactor: 0.085,
};

function usd(v: number) {
  if (!Number.isFinite(v)) return "$0";
  if (Math.abs(v) >= 1_000_000) return `$${(v / 1_000_000).toFixed(2)}M`;
  if (Math.abs(v) >= 1_000) return `$${(v / 1_000).toFixed(1)}k`;
  return `$${v.toFixed(0)}`;
}

function usdFull(v: number) {
  return `$${Number(v || 0).toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
}

function num(v: number, d = 1) {
  return Number(v || 0).toLocaleString("en-US", { maximumFractionDigits: d });
}

function npv(rate: number, cashflows: number[]) {
  return cashflows.reduce((acc, cf, t) => acc + cf / Math.pow(1 + rate, t), 0);
}

function estimateIrr(cashflows: number[]) {
  let bestRate = -0.9;
  let bestAbs = Infinity;
  for (let r = -0.2; r <= 0.5; r += 0.001) {
    const value = Math.abs(npv(r, cashflows));
    if (value < bestAbs) {
      bestAbs = value;
      bestRate = r;
    }
  }
  return bestRate * 100;
}

function bounded(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function getAdjustedResource(zone: Zone, lat: number, lon: number) {
  const latDelta = Math.abs(lat) - Math.abs(zone.lat);
  const lonDelta = Math.abs(lon) - Math.abs(zone.lon);
  const adjustedGhi = bounded(zone.ghi * (1 + latDelta * 0.004), zone.ghi * 0.94, zone.ghi * 1.06);
  const adjustedWind = bounded(zone.wind * (1 + lonDelta * 0.003), zone.wind * 0.9, zone.wind * 1.1);
  return { adjustedGhi, adjustedWind };
}

function calculate(zone: Zone, technology: string, areaHa: number, price: number, lat: number, lon: number): Result {
  const isSolar = technology === "solar";
  const { adjustedGhi, adjustedWind } = getAdjustedResource(zone, lat, lon);
  const mwPerHa = isSolar ? assumptions.solarMwHa : assumptions.windMwHa;
  const capexUnit = isSolar ? assumptions.solarCapex : assumptions.windCapex;
  const opexPct = isSolar ? assumptions.solarOpex : assumptions.windOpex;
  const capacityMW = areaHa * mwPerHa;
  const factorPlant = isSolar
    ? Math.min(0.31, Math.max(0.17, adjustedGhi / 24))
    : Math.min(0.46, Math.max(0.18, (adjustedWind - 3) / 10));
  const annualMWh = capacityMW * factorPlant * 8760;
  const connectionCost = zone.grid * assumptions.connectionUsdKm;
  const capexEquipment = capacityMW * capexUnit;
  const capexTotal = capexEquipment + connectionCost;
  const opexAnnual = capexTotal * opexPct;
  const revenueAnnual = annualMWh * price;
  const ebitda = revenueAnnual - opexAnnual;
  const cashflows = [-capexTotal];
  for (let y = 1; y <= assumptions.lifeYears; y++) {
    const degradation = isSolar ? Math.pow(1 - assumptions.solarDegradation, y - 1) : 1;
    cashflows.push(annualMWh * degradation * price - opexAnnual);
  }
  const r = assumptions.discountRate;
  const n = assumptions.lifeYears;
  const crf = (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  const lcoe = (capexTotal * crf + opexAnnual) / Math.max(1, annualMWh);
  const projectNpv = npv(r, cashflows);
  const irr = estimateIrr(cashflows);
  const payback = capexTotal / Math.max(1, ebitda);
  const resourceScore = isSolar ? Math.min(100, adjustedGhi * 15) : Math.min(100, adjustedWind * 12);
  const financeScore = Math.max(0, Math.min(100, (irr - 4) * 8));
  const gridScore = Math.max(0, 100 - zone.grid * 2.2);
  const legalScore = Math.max(0, 100 - zone.legal);
  const climateScore = Math.max(0, 100 - zone.climate);
  const riskScore = Math.max(0, Math.min(100, resourceScore * 0.25 + financeScore * 0.3 + gridScore * 0.2 + legalScore * 0.15 + climateScore * 0.1));
  const riskLevel = riskScore >= 70 ? "bajo" : riskScore >= 45 ? "medio" : "alto";
  return { capacityMW, factorPlant, annualMWh, capexEquipment, capexTotal, opexAnnual, revenueAnnual, ebitda, lcoe, npv: projectNpv, irr, payback, riskScore, riskLevel, connectionCost, adjustedGhi, adjustedWind, crf, resourceScore, financeScore, gridScore, legalScore, climateScore, cashflows };
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

function DetailRow({ label, formula, calculation, result }: { label: string; formula: string; calculation: string; result: string }) {
  return (
    <tr className="border-b align-top">
      <td className="p-3 font-medium">{label}</td>
      <td className="p-3 font-mono text-xs">{formula}</td>
      <td className="p-3 font-mono text-xs">{calculation}</td>
      <td className="p-3 font-semibold">{result}</td>
    </tr>
  );
}

export default function Home() {
  const [technology, setTechnology] = useState("solar");
  const [areaHa, setAreaHa] = useState(120);
  const [price, setPrice] = useState(42);
  const [zone, setZone] = useState<Zone>(zones.find((z) => z.region === "Arequipa") || zones[0]);
  const [lat, setLat] = useState(-16.41);
  const [lon, setLon] = useState(-71.54);
  const [result, setResult] = useState<Result | null>(null);
  const [message, setMessage] = useState("Selecciona una región, coordenadas y ejecuta el análisis.");

  const liveEstimate = useMemo(() => calculate(zone, technology, areaHa, price, lat, lon), [zone, technology, areaHa, price, lat, lon]);

  function selectZone(region: string) {
    const selected = zones.find((z) => z.region === region) || zones[0];
    setZone(selected);
    setLat(selected.lat);
    setLon(selected.lon);
    setResult(null);
  }

  function selectFromConceptMap(event: React.MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    const selectedLon = -82 + x * 14;
    const selectedLat = 0.5 - y * 19;
    setLat(Number(selectedLat.toFixed(5)));
    setLon(Number(selectedLon.toFixed(5)));
    setMessage("Coordenadas seleccionadas visualmente en el mapa conceptual. Ejecuta el análisis para actualizar resultados.");
    setResult(null);
  }

  function analyze() {
    const calculated = calculate(zone, technology, areaHa, price, lat, lon);
    setResult(calculated);
    setMessage(`Análisis generado para ${zone.region} (${lat.toFixed(5)}, ${lon.toFixed(5)}).`);
    setTimeout(() => document.getElementById("resultados")?.scrollIntoView({ behavior: "smooth" }), 100);
  }

  function printReport() {
    if (!result) analyze();
    setTimeout(() => window.print(), 200);
  }

  const techName = technology === "solar" ? "Solar FV" : "Eólico";
  const capexUnit = technology === "solar" ? assumptions.solarCapex : assumptions.windCapex;
  const opexPct = technology === "solar" ? assumptions.solarOpex : assumptions.windOpex;
  const mwHa = technology === "solar" ? assumptions.solarMwHa : assumptions.windMwHa;
  const resourceValue = technology === "solar" ? liveEstimate.adjustedGhi : liveEstimate.adjustedWind;
  const resourceLabel = technology === "solar" ? "GHI ajustado" : "Viento ajustado";
  const resourceUnit = technology === "solar" ? "kWh/m²/día" : "m/s";

  function scenario(priceMult: number, capexMult: number, fpMult: number) {
    const base = calculate(zone, technology, areaHa, price * priceMult, lat, lon);
    const adjustedCapex = base.capexEquipment * capexMult + base.connectionCost;
    const adjustedMWh = base.annualMWh * fpMult;
    const adjustedOpex = adjustedCapex * opexPct;
    const cashflows = [-adjustedCapex];
    for (let y = 1; y <= assumptions.lifeYears; y++) {
      const degradation = technology === "solar" ? Math.pow(1 - assumptions.solarDegradation, y - 1) : 1;
      cashflows.push(adjustedMWh * degradation * price * priceMult - adjustedOpex);
    }
    const irr = estimateIrr(cashflows);
    const npvValue = npv(assumptions.discountRate, cashflows);
    const lcoe = (adjustedCapex * liveEstimate.crf + adjustedOpex) / Math.max(1, adjustedMWh);
    return { irr, npvValue, lcoe };
  }

  const pessimistic = scenario(0.8, 1.15, 0.9);
  const baseScenario = scenario(1, 1, 1);
  const optimistic = scenario(1.2, 0.9, 1.1);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b bg-white print:hidden">
        <div className="mx-auto max-w-7xl px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-2xl bg-emerald-600 flex items-center justify-center"><Zap className="text-white" /></div>
            <div>
              <h1 className="text-2xl font-bold">Energycom Nexus AI</h1>
              <p className="text-sm text-slate-500">From Land to Power · MVP Perú · Coordenadas + memoria de cálculo</p>
            </div>
          </div>
          <button className="rounded-2xl bg-slate-900 text-white px-4 py-2 text-sm">Solicitar demo</button>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-8 grid lg:grid-cols-[1.05fr_0.95fr] gap-6 print:hidden">
        <div className="rounded-3xl bg-gradient-to-br from-emerald-100 via-sky-100 to-slate-200 min-h-[560px] p-5 relative overflow-hidden border border-slate-200">
          <div className="absolute inset-0 opacity-70" style={{ backgroundImage: "radial-gradient(circle at 25% 30%, rgba(16,185,129,.32), transparent 25%), radial-gradient(circle at 65% 60%, rgba(14,165,233,.3), transparent 30%)" }} />
          <div className="relative z-10 flex items-center gap-3">
            <Globe2 className="text-emerald-700" />
            <select className="rounded-2xl bg-white/90 px-4 py-3 shadow-sm flex-1 outline-none" value={zone.region} onChange={(e) => selectZone(e.target.value)}>
              {zones.map((z) => <option key={z.region} value={z.region}>{z.region} · {z.macro}</option>)}
            </select>
          </div>

          <div onClick={selectFromConceptMap} className="relative z-10 mt-8 mx-auto h-72 max-w-md rounded-[2rem] bg-white/55 border border-white shadow-inner cursor-crosshair overflow-hidden">
            <div className="absolute left-[42%] top-[8%] h-[82%] w-[34%] rounded-[50%_45%_55%_60%] bg-emerald-500/30 border-4 border-emerald-700 rotate-[8deg]" />
            <div className="absolute text-xs text-slate-600 left-4 top-4">Mapa conceptual Perú<br/>Haz clic para seleccionar coordenadas</div>
            <MapPin className="absolute h-8 w-8 text-red-600 drop-shadow" style={{ left: `${((lon + 82) / 14) * 100}%`, top: `${((0.5 - lat) / 19) * 100}%`, transform: "translate(-50%, -100%)" }} />
            <div className="absolute bottom-3 left-3 right-3 rounded-2xl bg-white/90 p-3 text-xs">
              Coordenadas seleccionadas: <strong>{lat.toFixed(5)}, {lon.toFixed(5)}</strong>
            </div>
          </div>

          <p className="relative z-10 mt-5 text-sm text-slate-700 bg-white/70 rounded-2xl p-4">{zone.note}</p>
          <div className="relative z-10 mt-4 grid grid-cols-3 gap-3">
            <div className="rounded-2xl bg-white/90 p-4"><p className="text-xs text-slate-500">GHI base</p><strong>{zone.ghi} kWh/m²/día</strong></div>
            <div className="rounded-2xl bg-white/90 p-4"><p className="text-xs text-slate-500">Viento base</p><strong>{zone.wind} m/s</strong></div>
            <div className="rounded-2xl bg-white/90 p-4"><p className="text-xs text-slate-500">Red</p><strong>{zone.grid} km</strong></div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
            <h2 className="text-xl font-bold">Análisis de prefactibilidad</h2>
            <p className="text-sm text-slate-600 mt-2">Incluye coordenadas, potencial, CAPEX, LCOE, VAN, TIR, payback, riesgo y memoria de cálculo.</p>
            <div className="mt-5 space-y-5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium">Latitud</label>
                  <input className="mt-1 w-full rounded-2xl border p-3" type="number" step="0.00001" value={lat} onChange={(e) => { setLat(Number(e.target.value)); setResult(null); }} />
                </div>
                <div>
                  <label className="text-sm font-medium">Longitud</label>
                  <input className="mt-1 w-full rounded-2xl border p-3" type="number" step="0.00001" value={lon} onChange={(e) => { setLon(Number(e.target.value)); setResult(null); }} />
                </div>
              </div>
              <div>
                <label className="font-medium">Área: {areaHa} ha</label>
                <input className="w-full mt-2" type="range" min="20" max="1000" value={areaHa} onChange={(e) => { setAreaHa(Number(e.target.value)); setResult(null); }} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => { setTechnology("solar"); setResult(null); }} className={`rounded-2xl px-4 py-3 border ${technology === "solar" ? "bg-emerald-600 text-white" : "bg-white"}`}><Sun className="inline h-4 mr-2" />Solar</button>
                <button onClick={() => { setTechnology("wind"); setResult(null); }} className={`rounded-2xl px-4 py-3 border ${technology === "wind" ? "bg-emerald-600 text-white" : "bg-white"}`}><Wind className="inline h-4 mr-2" />Eólico</button>
              </div>
              <div>
                <label className="font-medium">Precio energía: ${price}/MWh</label>
                <input className="w-full mt-2" type="range" min="25" max="90" value={price} onChange={(e) => { setPrice(Number(e.target.value)); setResult(null); }} />
              </div>
              <div className="rounded-2xl bg-slate-50 border p-4 text-sm">
                Estimación previa: <strong>{num(liveEstimate.capacityMW)} MW</strong> · <strong>{num(liveEstimate.annualMWh, 0)} MWh/año</strong> · CAPEX <strong>{usd(liveEstimate.capexTotal)}</strong><br />
                {resourceLabel}: <strong>{resourceValue.toFixed(2)} {resourceUnit}</strong>
              </div>
              <button onClick={analyze} className="w-full rounded-2xl bg-slate-900 text-white py-3 font-semibold">Ejecutar análisis</button>
              <p className="text-sm text-slate-500">{message}</p>
            </div>
          </div>
        </div>
      </section>

      {result && (
        <section id="resultados" className="mx-auto max-w-7xl px-6 pb-10 space-y-6 print:px-8 print:py-8">
          <div className="hidden print:block mb-8 border-b pb-5">
            <h1 className="text-3xl font-bold">Memoria de cálculo preliminar</h1>
            <p>Energycom Nexus AI · {zone.region}, Perú · Proyecto {techName}</p>
            <p>Coordenadas: {lat.toFixed(5)}, {lon.toFixed(5)} · Área: {areaHa} ha</p>
          </div>

          <div className="flex items-start justify-between gap-4 print:block">
            <div>
              <h2 className="text-2xl font-bold">Resultados de prefactibilidad</h2>
              <p className="text-slate-600">{zone.region} · Coordenadas {lat.toFixed(5)}, {lon.toFixed(5)} · {areaHa} ha · Tecnología {techName}</p>
            </div>
            <button onClick={printReport} className="print:hidden rounded-2xl bg-emerald-600 text-white px-4 py-3 font-semibold flex items-center gap-2"><Download className="h-4" /> Generar memoria PDF</button>
          </div>

          <div className="grid md:grid-cols-4 gap-4">
            <Card icon={Zap} title="Capacidad" value={`${num(result.capacityMW)} MW`} subtitle="estimada" />
            <Card icon={Sun} title="Producción" value={`${num(result.annualMWh, 0)} MWh/año`} subtitle={`FP ${(result.factorPlant * 100).toFixed(1)}%`} />
            <Card icon={DollarSign} title="CAPEX" value={usd(result.capexTotal)} subtitle={`conexión ${usd(result.connectionCost)}`} />
            <Card icon={AlertTriangle} title="Riesgo" value={`${result.riskScore.toFixed(0)}/100`} subtitle={`nivel ${result.riskLevel}`} />
          </div>
          <div className="grid md:grid-cols-4 gap-4">
            <Card icon={DollarSign} title="Ingresos" value={usd(result.revenueAnnual)} subtitle="anual estimado" />
            <Card icon={Building2} title="OPEX" value={usd(result.opexAnnual)} subtitle="anual estimado" />
            <Card icon={FileText} title="LCOE" value={`$${result.lcoe.toFixed(1)}/MWh`} subtitle="estimado" />
            <Card icon={Landmark} title="VAN" value={usd(result.npv)} subtitle="10% descuento" />
          </div>
          <div className="grid md:grid-cols-4 gap-4">
            <Card icon={Zap} title="TIR" value={`${result.irr.toFixed(1)}%`} subtitle="preliminar" />
            <Card icon={Download} title="Payback" value={`${result.payback.toFixed(1)} años`} subtitle="simple" />
            <Card icon={Scale} title="Legal" value={`${result.legalScore.toFixed(0)}/100`} subtitle="score preliminar" />
            <Card icon={Users} title="PPA" value="Match básico" subtitle={`precio ${price} USD/MWh`} />
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
            <h3 className="text-xl font-bold mb-4">Memoria de cálculo detallada</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead className="bg-slate-100">
                  <tr><th className="p-3 text-left">Proceso</th><th className="p-3 text-left">Fórmula</th><th className="p-3 text-left">Cálculo aplicado</th><th className="p-3 text-left">Resultado</th></tr>
                </thead>
                <tbody>
                  <DetailRow label="Recurso ajustado" formula={technology === "solar" ? "GHI_adj = GHI_base × f(lat,lon)" : "V_adj = V_base × f(lat,lon)"} calculation={technology === "solar" ? `${zone.ghi} × ajuste coordenadas` : `${zone.wind} × ajuste coordenadas`} result={`${resourceValue.toFixed(2)} ${resourceUnit}`} />
                  <DetailRow label="Potencia instalable" formula="P_inst = Área × densidad MW/ha" calculation={`${areaHa} ha × ${mwHa} MW/ha`} result={`${num(result.capacityMW)} MW`} />
                  <DetailRow label="Factor de planta" formula={technology === "solar" ? "FP = GHI_adj / 24, acotado 17%–31%" : "FP = (V_adj - 3) / 10, acotado 18%–46%"} calculation={technology === "solar" ? `${result.adjustedGhi.toFixed(2)} / 24` : `(${result.adjustedWind.toFixed(2)} - 3) / 10`} result={`${(result.factorPlant * 100).toFixed(2)}%`} />
                  <DetailRow label="Producción anual" formula="E = P_inst × FP × 8,760" calculation={`${num(result.capacityMW)} × ${(result.factorPlant * 100).toFixed(2)}% × 8,760`} result={`${num(result.annualMWh, 0)} MWh/año`} />
                  <DetailRow label="CAPEX equipos/EPC" formula="CAPEX_EPC = P_inst × CAPEX_unitario" calculation={`${num(result.capacityMW)} MW × ${usdFull(capexUnit)}/MW`} result={usdFull(result.capexEquipment)} />
                  <DetailRow label="Costo de conexión" formula="C_conexión = distancia × USD/km" calculation={`${zone.grid} km × ${usdFull(assumptions.connectionUsdKm)}/km`} result={usdFull(result.connectionCost)} />
                  <DetailRow label="CAPEX total" formula="CAPEX_total = CAPEX_EPC + C_conexión" calculation={`${usdFull(result.capexEquipment)} + ${usdFull(result.connectionCost)}`} result={usdFull(result.capexTotal)} />
                  <DetailRow label="OPEX anual" formula="OPEX = CAPEX_total × %OPEX" calculation={`${usdFull(result.capexTotal)} × ${(opexPct * 100).toFixed(1)}%`} result={usdFull(result.opexAnnual)} />
                  <DetailRow label="Ingresos anuales" formula="Ingresos = E × Precio" calculation={`${num(result.annualMWh, 0)} MWh × $${price}/MWh`} result={usdFull(result.revenueAnnual)} />
                  <DetailRow label="EBITDA preliminar" formula="EBITDA = Ingresos - OPEX" calculation={`${usdFull(result.revenueAnnual)} - ${usdFull(result.opexAnnual)}`} result={usdFull(result.ebitda)} />
                  <DetailRow label="LCOE" formula="LCOE = (CAPEX×CRF + OPEX) / E" calculation={`(${usdFull(result.capexTotal)} × ${result.crf.toFixed(4)} + ${usdFull(result.opexAnnual)}) / ${num(result.annualMWh, 0)}`} result={`$${result.lcoe.toFixed(2)}/MWh`} />
                  <DetailRow label="VAN" formula="VAN = Σ FCt/(1+r)^t" calculation={`r = ${(assumptions.discountRate * 100).toFixed(1)}%, vida = ${assumptions.lifeYears} años`} result={usdFull(result.npv)} />
                  <DetailRow label="TIR" formula="TIR = tasa donde VAN = 0" calculation="Iteración sobre flujos de caja del proyecto" result={`${result.irr.toFixed(2)}%`} />
                  <DetailRow label="Payback simple" formula="Payback = CAPEX_total / EBITDA" calculation={`${usdFull(result.capexTotal)} / ${usdFull(result.ebitda)}`} result={`${result.payback.toFixed(2)} años`} />
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
              <h3 className="text-xl font-bold mb-3">Supuestos técnicos y financieros</h3>
              <ul className="text-sm space-y-2 list-disc pl-5">
                <li>Tecnología evaluada: {techName}.</li>
                <li>Densidad de instalación: {mwHa} MW/ha.</li>
                <li>CAPEX unitario: {usdFull(capexUnit)}/MW.</li>
                <li>OPEX anual: {(opexPct * 100).toFixed(1)}% del CAPEX total.</li>
                <li>Vida útil: {assumptions.lifeYears} años.</li>
                <li>Tasa de descuento: {(assumptions.discountRate * 100).toFixed(1)}%.</li>
                <li>Costo preliminar de conexión: {usdFull(assumptions.connectionUsdKm)}/km.</li>
                <li>Degradación solar anual: {(assumptions.solarDegradation * 100).toFixed(1)}%; eólico sin degradación en MVP.</li>
                <li>Coordenadas usadas: {lat.toFixed(5)}, {lon.toFixed(5)}.</li>
              </ul>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
              <h3 className="text-xl font-bold mb-3">Análisis de sensibilidad</h3>
              <table className="w-full text-sm">
                <thead className="bg-slate-100"><tr><th className="p-2 text-left">Escenario</th><th className="p-2 text-right">TIR</th><th className="p-2 text-right">VAN</th><th className="p-2 text-right">LCOE</th></tr></thead>
                <tbody>
                  <tr className="border-b"><td className="p-2">Pesimista: precio -20%, CAPEX +15%, FP -10%</td><td className="p-2 text-right">{pessimistic.irr.toFixed(1)}%</td><td className="p-2 text-right">{usd(pessimistic.npvValue)}</td><td className="p-2 text-right">${pessimistic.lcoe.toFixed(1)}</td></tr>
                  <tr className="border-b"><td className="p-2">Base</td><td className="p-2 text-right">{baseScenario.irr.toFixed(1)}%</td><td className="p-2 text-right">{usd(baseScenario.npvValue)}</td><td className="p-2 text-right">${baseScenario.lcoe.toFixed(1)}</td></tr>
                  <tr><td className="p-2">Optimista: precio +20%, CAPEX -10%, FP +10%</td><td className="p-2 text-right">{optimistic.irr.toFixed(1)}%</td><td className="p-2 text-right">{usd(optimistic.npvValue)}</td><td className="p-2 text-right">${optimistic.lcoe.toFixed(1)}</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
            <h3 className="text-xl font-bold">Análisis de riesgo preliminar</h3>
            <div className="mt-4 grid md:grid-cols-5 gap-3 text-sm">
              <div className="rounded-2xl bg-slate-50 p-4"><strong>Recurso</strong><br />{result.resourceScore.toFixed(0)}/100</div>
              <div className="rounded-2xl bg-slate-50 p-4"><strong>Financiero</strong><br />{result.financeScore.toFixed(0)}/100</div>
              <div className="rounded-2xl bg-slate-50 p-4"><strong>Red</strong><br />{result.gridScore.toFixed(0)}/100</div>
              <div className="rounded-2xl bg-slate-50 p-4"><strong>Legal</strong><br />{result.legalScore.toFixed(0)}/100</div>
              <div className="rounded-2xl bg-slate-50 p-4"><strong>Climático</strong><br />{result.climateScore.toFixed(0)}/100</div>
            </div>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
            <h3 className="text-xl font-bold">Conclusión preliminar</h3>
            <p className="mt-3 text-slate-700">
              El terreno evaluado presenta un nivel de riesgo preliminar <strong>{result.riskLevel}</strong> para un proyecto {techName}. La oportunidad debe continuar a validación con recurso horario, visita de campo, cotización EPC, análisis de conexión, revisión de propiedad, concesiones, servidumbres, permisos y evaluación ambiental.
            </p>
          </div>

          <div className="rounded-3xl bg-amber-50 p-5 border border-amber-200 text-sm text-amber-900">
            <strong>Disclaimer:</strong> Esta memoria es preliminar y usa valores referenciales para demostración MVP. No reemplaza estudios de ingeniería, campañas de medición, due diligence legal, permisos, evaluación ambiental, estudios de interconexión ni asesoría financiera o legal requerida para decisiones de inversión.
          </div>
        </section>
      )}
    </main>
  );
}
