"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, Building2, DollarSign, Download, FileText, Globe2, Landmark, Scale, Sun, Users, Wind, Zap } from "lucide-react";

type Zone = {
  region: string;
  macro: string;
  ghi: number;
  wind: number;
  grid: number;
  legal: number;
  climate: number;
  note: string;
};

type Result = {
  capacityMW: number;
  factorPlant: number;
  annualMWh: number;
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
};

const zones: Zone[] = [
  { region: "Amazonas", macro: "Nororiente", ghi: 4.7, wind: 4.1, grid: 38, legal: 42, climate: 48, note: "Zona con recurso solar medio y alta sensibilidad ambiental." },
  { region: "Áncash", macro: "Costa/Sierra centro", ghi: 5.5, wind: 5.8, grid: 22, legal: 38, climate: 34, note: "Potencial solar medio-alto y oportunidades cerca de corredores eléctricos." },
  { region: "Apurímac", macro: "Sierra sur", ghi: 5.7, wind: 5.1, grid: 34, legal: 45, climate: 36, note: "Recurso solar alto, revisar acceso y restricciones territoriales." },
  { region: "Arequipa", macro: "Sur", ghi: 6.2, wind: 6.8, grid: 18, legal: 35, climate: 28, note: "Alto recurso solar y buen potencial para proyectos utility-scale." },
  { region: "Ayacucho", macro: "Sierra sur", ghi: 5.8, wind: 5.4, grid: 36, legal: 44, climate: 38, note: "Buen recurso solar, requiere revisión de accesibilidad y red." },
  { region: "Cajamarca", macro: "Norte", ghi: 5.0, wind: 4.8, grid: 30, legal: 48, climate: 42, note: "Recurso medio, revisar interacción con concesiones y áreas sensibles." },
  { region: "Callao", macro: "Costa centro", ghi: 5.1, wind: 5.2, grid: 8, legal: 55, climate: 30, note: "Alta cercanía a red, limitada disponibilidad de suelo." },
  { region: "Cusco", macro: "Sierra sur", ghi: 5.4, wind: 4.9, grid: 32, legal: 50, climate: 40, note: "Recurso solar medio-alto, revisar patrimonio, uso de suelo y permisos." },
  { region: "Huancavelica", macro: "Sierra centro", ghi: 5.6, wind: 5.7, grid: 29, legal: 43, climate: 37, note: "Buen potencial solar/eólico preliminar en zonas altoandinas." },
  { region: "Huánuco", macro: "Centro", ghi: 5.0, wind: 4.3, grid: 33, legal: 42, climate: 45, note: "Recurso medio, revisar topografía y accesibilidad." },
  { region: "Ica", macro: "Costa sur", ghi: 6.0, wind: 5.7, grid: 12, legal: 25, climate: 22, note: "Alta irradiación y buena accesibilidad para proyectos solares." },
  { region: "Junín", macro: "Centro", ghi: 5.1, wind: 4.8, grid: 24, legal: 42, climate: 40, note: "Recurso medio y cercanía relativa a centros de demanda." },
  { region: "La Libertad", macro: "Norte", ghi: 5.6, wind: 6.2, grid: 20, legal: 35, climate: 32, note: "Potencial solar y eólico competitivo en costa norte." },
  { region: "Lambayeque", macro: "Norte", ghi: 5.7, wind: 6.5, grid: 18, legal: 33, climate: 38, note: "Buen recurso eólico y solar, revisar riesgos climáticos." },
  { region: "Lima", macro: "Costa centro", ghi: 5.3, wind: 5.4, grid: 10, legal: 45, climate: 28, note: "Muy buena cercanía a red y demanda, suelo más competitivo." },
  { region: "Loreto", macro: "Amazonía", ghi: 4.5, wind: 3.8, grid: 55, legal: 55, climate: 55, note: "Más adecuado para soluciones aisladas o híbridas que utility-scale." },
  { region: "Madre de Dios", macro: "Amazonía", ghi: 4.8, wind: 3.9, grid: 50, legal: 58, climate: 52, note: "Requiere alta revisión ambiental y legal." },
  { region: "Moquegua", macro: "Sur", ghi: 6.4, wind: 6.1, grid: 20, legal: 38, climate: 25, note: "Muy alto recurso solar y buen potencial para grandes proyectos." },
  { region: "Pasco", macro: "Centro", ghi: 5.0, wind: 5.0, grid: 31, legal: 50, climate: 42, note: "Revisar topografía, clima, concesiones y acceso." },
  { region: "Piura", macro: "Norte", ghi: 5.8, wind: 7.4, grid: 25, legal: 30, climate: 45, note: "Potencial eólico y solar, atención a El Niño." },
  { region: "Puno", macro: "Altiplano", ghi: 6.0, wind: 5.9, grid: 30, legal: 40, climate: 42, note: "Alto recurso solar, revisar altura, accesibilidad y conexión." },
  { region: "San Martín", macro: "Nororiente", ghi: 4.9, wind: 4.2, grid: 36, legal: 44, climate: 48, note: "Recurso medio y sensibilidad ambiental relevante." },
  { region: "Tacna", macro: "Sur", ghi: 6.5, wind: 6.3, grid: 19, legal: 34, climate: 24, note: "Excelente recurso solar y potencial competitivo." },
  { region: "Tumbes", macro: "Norte", ghi: 5.7, wind: 6.9, grid: 26, legal: 36, climate: 48, note: "Potencial eólico/solar, revisar riesgos climáticos." },
  { region: "Ucayali", macro: "Amazonía", ghi: 4.8, wind: 4.0, grid: 45, legal: 50, climate: 52, note: "Potencial más favorable para soluciones híbridas y aisladas." },
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

function calculate(zone: Zone, technology: string, areaHa: number, price: number): Result {
  const isSolar = technology === "solar";
  const mwPerHa = isSolar ? 0.75 : 0.18;
  const capexUnit = isSolar ? 820000 : 1450000;
  const opexPct = isSolar ? 0.02 : 0.03;
  const connectionCostPerKm = 90000;
  const lifeYears = 25;
  const discountRate = 0.1;
  const capacityMW = areaHa * mwPerHa;
  const factorPlant = isSolar
    ? Math.min(0.31, Math.max(0.17, zone.ghi / 24))
    : Math.min(0.46, Math.max(0.18, (zone.wind - 3) / 10));
  const annualMWh = capacityMW * factorPlant * 8760;
  const connectionCost = zone.grid * connectionCostPerKm;
  const capexTotal = capacityMW * capexUnit + connectionCost;
  const opexAnnual = capexTotal * opexPct;
  const revenueAnnual = annualMWh * price;
  const ebitda = revenueAnnual - opexAnnual;
  const cashflows = [-capexTotal];
  for (let y = 1; y <= lifeYears; y++) {
    const degradation = isSolar ? Math.pow(0.995, y - 1) : 1;
    cashflows.push(annualMWh * degradation * price - opexAnnual);
  }
  const lcoe = (capexTotal * 0.085 + opexAnnual) / Math.max(1, annualMWh);
  const projectNpv = npv(discountRate, cashflows);
  const irr = estimateIrr(cashflows);
  const payback = capexTotal / Math.max(1, ebitda);
  const resourceScore = isSolar ? Math.min(100, zone.ghi * 15) : Math.min(100, zone.wind * 12);
  const financeScore = Math.max(0, Math.min(100, (irr - 4) * 8));
  const gridScore = Math.max(0, 100 - zone.grid * 2.2);
  const legalScore = Math.max(0, 100 - zone.legal);
  const climateScore = Math.max(0, 100 - zone.climate);
  const riskScore = Math.max(0, Math.min(100, resourceScore * 0.25 + financeScore * 0.3 + gridScore * 0.2 + legalScore * 0.15 + climateScore * 0.1));
  const riskLevel = riskScore >= 70 ? "bajo" : riskScore >= 45 ? "medio" : "alto";
  return { capacityMW, factorPlant, annualMWh, capexTotal, opexAnnual, revenueAnnual, ebitda, lcoe, npv: projectNpv, irr, payback, riskScore, riskLevel, connectionCost };
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
  const [zone, setZone] = useState<Zone>(zones.find((z) => z.region === "Arequipa") || zones[0]);
  const [result, setResult] = useState<Result | null>(null);
  const [message, setMessage] = useState("Selecciona una región y ejecuta el análisis.");

  const liveEstimate = useMemo(() => calculate(zone, technology, areaHa, price), [zone, technology, areaHa, price]);

  function analyze() {
    const calculated = calculate(zone, technology, areaHa, price);
    setResult(calculated);
    setMessage(`Análisis generado para ${zone.region}. Desplázate hacia abajo para ver resultados.`);
    setTimeout(() => document.getElementById("resultados")?.scrollIntoView({ behavior: "smooth" }), 100);
  }

  function printReport() {
    if (!result) analyze();
    setTimeout(() => window.print(), 150);
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b bg-white print:hidden">
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

      <section className="mx-auto max-w-7xl px-6 py-8 grid lg:grid-cols-[1.05fr_0.95fr] gap-6 print:hidden">
        <div className="rounded-3xl bg-gradient-to-br from-emerald-100 via-sky-100 to-slate-200 min-h-[470px] p-5 relative overflow-hidden border border-slate-200">
          <div className="absolute inset-0 opacity-70" style={{ backgroundImage: "radial-gradient(circle at 25% 30%, rgba(16,185,129,.32), transparent 25%), radial-gradient(circle at 65% 60%, rgba(14,165,233,.3), transparent 30%)" }} />
          <div className="relative z-10 flex items-center gap-3">
            <Globe2 className="text-emerald-700" />
            <select
              className="rounded-2xl bg-white/90 px-4 py-3 shadow-sm flex-1 outline-none"
              value={zone.region}
              onChange={(e) => setZone(zones.find((z) => z.region === e.target.value) || zones[0])}
            >
              {zones.map((z) => <option key={z.region} value={z.region}>{z.region} · {z.macro}</option>)}
            </select>
          </div>
          <div className="relative z-10 mt-12 mx-auto h-48 w-72 rotate-[-8deg] rounded-[2rem] border-4 border-emerald-600 bg-emerald-500/20 shadow-xl" />
          <p className="relative z-10 mt-8 text-sm text-slate-700 bg-white/70 rounded-2xl p-4">{zone.note}</p>
          <div className="relative z-10 mt-4 grid grid-cols-3 gap-3">
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
              <div className="rounded-2xl bg-slate-50 border p-4 text-sm">
                Estimación previa: <strong>{num(liveEstimate.capacityMW)} MW</strong> · <strong>{num(liveEstimate.annualMWh, 0)} MWh/año</strong> · CAPEX <strong>{usd(liveEstimate.capexTotal)}</strong>
              </div>
              <button onClick={analyze} className="w-full rounded-2xl bg-slate-900 text-white py-3 font-semibold">
                Ejecutar análisis
              </button>
              <p className="text-sm text-slate-500">{message}</p>
            </div>
          </div>
        </div>
      </section>

      {result && (
        <section id="resultados" className="mx-auto max-w-7xl px-6 pb-10 space-y-6 print:px-8 print:py-8">
          <div className="hidden print:block mb-8">
            <h1 className="text-3xl font-bold">Memoria de cálculo preliminar</h1>
            <p>Energycom Nexus AI · {zone.region}, Perú · Proyecto {technology === "solar" ? "Solar FV" : "Eólico"}</p>
          </div>

          <div className="flex items-start justify-between gap-4 print:block">
            <div>
              <h2 className="text-2xl font-bold">Resultados de prefactibilidad</h2>
              <p className="text-slate-600">{zone.region} · {areaHa} ha · Tecnología {technology === "solar" ? "Solar FV" : "Eólica"}</p>
            </div>
            <button onClick={printReport} className="print:hidden rounded-2xl bg-emerald-600 text-white px-4 py-3 font-semibold flex items-center gap-2"><Download className="h-4" /> Descargar / imprimir PDF</button>
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
            <Card icon={Scale} title="Legal" value={`${100 - zone.legal}/100`} subtitle="score preliminar" />
            <Card icon={Users} title="PPA" value="Match básico" subtitle={`precio ${price} USD/MWh`} />
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
            <h3 className="text-xl font-bold">Conclusión preliminar</h3>
            <p className="mt-3 text-slate-700">
              El terreno evaluado presenta una viabilidad preliminar de <strong>{result.riskLevel}</strong> riesgo para un proyecto {technology === "solar" ? "solar fotovoltaico" : "eólico"}. El resultado debe validarse con estudio de recurso, revisión legal de propiedad, concesiones, servidumbres, evaluación ambiental e interconexión real.
            </p>
          </div>

          <div className="rounded-3xl bg-amber-50 p-5 border border-amber-200 text-sm text-amber-900">
            <strong>Disclaimer:</strong> Esta memoria es preliminar y usa valores referenciales para demostración MVP. No reemplaza estudios de ingeniería, campañas de medición, due diligence legal, permisos, evaluación ambiental ni estudios de conexión aprobados por las entidades competentes.
          </div>
        </section>
      )}
    </main>
  );
}
