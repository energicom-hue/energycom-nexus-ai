"use client";

import { useMemo, useState } from "react";
import {
  AlertTriangle,
  Building2,
  DollarSign,
  Download,
  FileText,
  Landmark,
  MapPin,
  Scale,
  Sun,
  Users,
  Wind,
  Zap,
} from "lucide-react";

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
  lineCost: number;
  substationCost: number;
  electricalEquipmentCost: number;
  interconnectionCapex: number;
  technicalCapex: number;
  gridDistance: number;
  devexTotal: number;
  devexFactibility: number;
  devexEngineering: number;
  devexPermits: number;
  devexGridStudies: number;
  devexManagement: number;
  capexTotal: number;
  opexAnnual: number;
  revenueAnnual: number;
  ebitda: number;
  lcoe: number;
  npv: number;
  irr: number;
  payback: number;
  breakEvenPpa: number;
  riskScore: number;
  riskLevel: string;
  adjustedGhi: number;
  adjustedWind: number;
  crf: number;
  resourceScore: number;
  financeScore: number;
  gridScore: number;
  legalScore: number;
  climateScore: number;
  cashflows: number[];
  dataSource: string;
  nasaUsed: boolean;
};

type NASAResourceData = {
  ghi: number;
  source: string;
};

const zones: Zone[] = [
  { region: "Amazonas", macro: "Nororiente", ghi: 4.7, wind: 4.1, grid: 38, legal: 42, climate: 48, lat: -6.23, lon: -77.87, note: "Zona con recurso solar medio y alta sensibilidad ambiental." },
  { region: "Áncash", macro: "Costa/Sierra centro", ghi: 5.5, wind: 5.8, grid: 22, legal: 38, climate: 34, lat: -9.53, lon: -77.53, note: "Potencial solar medio-alto y oportunidades cerca de corredores eléctricos." },
  { region: "Apurímac", macro: "Sierra sur", ghi: 5.7, wind: 5.1, grid: 34, legal: 45, climate: 36, lat: -13.63, lon: -72.88, note: "Recurso solar alto; revisar acceso, topografía y restricciones territoriales." },
  { region: "Arequipa", macro: "Sur", ghi: 6.4, wind: 6.8, grid: 9, legal: 35, climate: 28, lat: -16.41, lon: -71.54, note: "Alto recurso solar. Zona prioritaria para proyectos utility-scale." },
  { region: "Ayacucho", macro: "Sierra sur", ghi: 5.8, wind: 5.4, grid: 36, legal: 44, climate: 38, lat: -13.16, lon: -74.22, note: "Buen recurso solar; requiere revisión de accesibilidad y red." },
  { region: "Cajamarca", macro: "Norte", ghi: 5.0, wind: 4.8, grid: 30, legal: 48, climate: 42, lat: -7.16, lon: -78.51, note: "Recurso medio; revisar interacción con concesiones y áreas sensibles." },
  { region: "Callao", macro: "Costa centro", ghi: 5.1, wind: 5.2, grid: 8, legal: 55, climate: 30, lat: -12.06, lon: -77.12, note: "Alta cercanía a red, limitada disponibilidad de suelo." },
  { region: "Cusco", macro: "Sierra sur", ghi: 5.4, wind: 4.9, grid: 32, legal: 50, climate: 40, lat: -13.52, lon: -71.97, note: "Recurso solar medio-alto; revisar patrimonio, uso de suelo y permisos." },
  { region: "Huancavelica", macro: "Sierra centro", ghi: 5.6, wind: 5.7, grid: 29, legal: 43, climate: 37, lat: -12.79, lon: -74.97, note: "Buen potencial solar/eólico preliminar en zonas altoandinas." },
  { region: "Huánuco", macro: "Centro", ghi: 5.0, wind: 4.3, grid: 33, legal: 42, climate: 45, lat: -9.93, lon: -76.24, note: "Recurso medio; revisar topografía y accesibilidad." },
  { region: "Ica", macro: "Costa sur", ghi: 6.0, wind: 5.7, grid: 12, legal: 25, climate: 22, lat: -14.07, lon: -75.73, note: "Alta irradiación y buena accesibilidad para proyectos solares." },
  { region: "Junín", macro: "Centro", ghi: 5.1, wind: 4.8, grid: 24, legal: 42, climate: 40, lat: -12.07, lon: -75.21, note: "Recurso medio y cercanía relativa a centros de demanda." },
  { region: "La Libertad", macro: "Norte", ghi: 5.6, wind: 6.2, grid: 20, legal: 35, climate: 32, lat: -8.11, lon: -79.03, note: "Potencial solar y eólico competitivo en costa norte." },
  { region: "Lambayeque", macro: "Norte", ghi: 5.7, wind: 6.5, grid: 18, legal: 33, climate: 38, lat: -6.77, lon: -79.84, note: "Buen recurso eólico y solar; revisar riesgos climáticos." },
  { region: "Lima", macro: "Costa centro", ghi: 5.3, wind: 5.4, grid: 10, legal: 45, climate: 28, lat: -12.05, lon: -77.04, note: "Muy buena cercanía a red y demanda; suelo más competitivo." },
  { region: "Loreto", macro: "Amazonía", ghi: 4.5, wind: 3.8, grid: 55, legal: 55, climate: 55, lat: -3.75, lon: -73.25, note: "Más adecuado para soluciones aisladas o híbridas que utility-scale." },
  { region: "Madre de Dios", macro: "Amazonía", ghi: 4.8, wind: 3.9, grid: 50, legal: 58, climate: 52, lat: -12.59, lon: -69.19, note: "Requiere alta revisión ambiental y legal." },
  { region: "Moquegua", macro: "Sur", ghi: 6.4, wind: 6.1, grid: 20, legal: 38, climate: 25, lat: -17.19, lon: -70.94, note: "Muy alto recurso solar y buen potencial para grandes proyectos." },
  { region: "Pasco", macro: "Centro", ghi: 5.0, wind: 5.0, grid: 31, legal: 50, climate: 42, lat: -10.68, lon: -76.26, note: "Revisar topografía, clima, concesiones y acceso." },
  { region: "Piura", macro: "Norte", ghi: 5.8, wind: 7.4, grid: 25, legal: 30, climate: 45, lat: -5.19, lon: -80.63, note: "Potencial eólico y solar; atención a eventos El Niño." },
  { region: "Puno", macro: "Altiplano", ghi: 6.0, wind: 5.9, grid: 30, legal: 40, climate: 42, lat: -15.84, lon: -70.02, note: "Alto recurso solar; revisar altura, accesibilidad y conexión." },
  { region: "San Martín", macro: "Nororiente", ghi: 4.9, wind: 4.2, grid: 36, legal: 44, climate: 48, lat: -6.49, lon: -76.36, note: "Recurso medio y sensibilidad ambiental relevante." },
  { region: "Tacna", macro: "Sur", ghi: 6.5, wind: 6.3, grid: 19, legal: 34, climate: 24, lat: -18.01, lon: -70.25, note: "Excelente recurso solar y potencial competitivo." },
  { region: "Tumbes", macro: "Norte", ghi: 5.7, wind: 6.9, grid: 26, legal: 36, climate: 48, lat: -3.57, lon: -80.45, note: "Potencial eólico/solar; revisar riesgos climáticos." },
  { region: "Ucayali", macro: "Amazonía", ghi: 4.8, wind: 4.0, grid: 45, legal: 50, climate: 52, lat: -8.38, lon: -74.55, note: "Potencial más favorable para soluciones híbridas y aisladas." },
];

const assumptions = {
  solarMwHa: 0.75,
  windMwHa: 0.18,
  solarCapex: 820000,
  windCapex: 1450000,
  solarOpex: 0.02,
  windOpex: 0.03,
  connectionUsdKm: 300000,
  electricalEquipmentPct: 0.15,
  discountRate: 0.1,
  solarDegradation: 0.005,
  devexDefaultPct: 6,
  devexBreakdown: {
    factibility: 0.22,
    engineering: 0.28,
    permits: 0.16,
    gridStudies: 0.14,
    management: 0.20,
  },
};

async function getNASAResourceData(lat: number, lon: number): Promise<NASAResourceData> {
  const url =
    `https://power.larc.nasa.gov/api/temporal/climatology/point` +
    `?parameters=ALLSKY_SFC_SW_DWN` +
    `&community=RE` +
    `&longitude=${lon}` +
    `&latitude=${lat}` +
    `&format=JSON`;

  const response = await fetch(url);
  if (!response.ok) throw new Error("No se pudo obtener información de NASA POWER");
  const data = await response.json();
  const ghi =
    data?.properties?.parameter?.ALLSKY_SFC_SW_DWN?.ANN ??
    data?.properties?.parameter?.ALLSKY_SFC_SW_DWN?.annual;
  if (!Number.isFinite(Number(ghi))) throw new Error("NASA POWER no devolvió un valor GHI válido");
  return { ghi: Number(ghi), source: "NASA POWER - ALLSKY_SFC_SW_DWN" };
}

function estimateWindSpeedPeru(lat: number) {
  if (lat > -7) return 7.4;
  if (lat > -12) return 6.3;
  if (lat > -16) return 6.0;
  return 6.4;
}

function getSolarCapacityFactor(ghi: number) {
  return Math.min(0.31, Math.max(0.18, ghi / 24));
}

function getWindCapacityFactor(windSpeed: number) {
  return Math.min(0.46, Math.max(0.18, (windSpeed - 3) / 10));
}

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
  for (let r = -0.2; r <= 0.6; r += 0.001) {
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

function estimateSubstationCost(capacityMW: number) {
  if (capacityMW < 20) return 2_000_000;
  if (capacityMW <= 100) return 5_000_000;
  if (capacityMW <= 300) return 10_000_000;
  return 15_000_000;
}

function getSubstationType(capacityMW: number) {
  if (capacityMW < 20) return "simple (<20 MW)";
  if (capacityMW <= 100) return "media (20–100 MW)";
  if (capacityMW <= 300) return "alta (100–300 MW)";
  return "gran escala (>300 MW)";
}

function getAdjustedResource(zone: Zone, lat: number, lon: number) {
  const latDelta = Math.abs(lat) - Math.abs(zone.lat);
  const lonDelta = Math.abs(lon) - Math.abs(zone.lon);
  const adjustedGhi = bounded(zone.ghi * (1 + latDelta * 0.004), zone.ghi * 0.94, zone.ghi * 1.06);
  const adjustedWind = bounded(zone.wind * (1 + lonDelta * 0.003), zone.wind * 0.9, zone.wind * 1.1);
  return { adjustedGhi, adjustedWind };
}

function projectToMap(lat: number, lon: number) {
  const minLon = -82;
  const maxLon = -68;
  const minLat = -18.7;
  const maxLat = 0.5;
  const x = bounded(((lon - minLon) / (maxLon - minLon)) * 100, 2, 98);
  const y = bounded(((maxLat - lat) / (maxLat - minLat)) * 100, 2, 98);
  return { x, y };
}

function calculateBreakEvenPpa(params: {
  technicalCapex: number;
  devexTotal: number;
  annualMWh: number;
  opexAnnual: number;
  lifeYears: number;
  discountRate: number;
  isSolar: boolean;
}) {
  let low = 0;
  let high = 200;
  for (let i = 0; i < 80; i++) {
    const mid = (low + high) / 2;
    const cfs = [-(params.technicalCapex + params.devexTotal)];
    for (let y = 1; y <= params.lifeYears; y++) {
      const degradation = params.isSolar ? Math.pow(1 - assumptions.solarDegradation, y - 1) : 1;
      cfs.push(params.annualMWh * degradation * mid - params.opexAnnual);
    }
    if (npv(params.discountRate, cfs) >= 0) high = mid;
    else low = mid;
  }
  return high;
}

function calculate(
  zone: Zone,
  technology: string,
  areaHa: number,
  price: number,
  lat: number,
  lon: number,
  devexPct: number,
  gridDistance: number,
  lifeYears: number,
  discountRatePct: number,
  ghiReal?: number,
  windSpeedReal?: number,
  solarCF?: number,
  windCF?: number,
  nasaUsed = false,
): Result {
  const isSolar = technology === "solar";
  const estimatedResource = getAdjustedResource(zone, lat, lon);
  const adjustedGhi = ghiReal ?? estimatedResource.adjustedGhi;
  const adjustedWind = windSpeedReal ?? estimatedResource.adjustedWind;
  const mwPerHa = isSolar ? assumptions.solarMwHa : assumptions.windMwHa;
  const capexUnit = isSolar ? assumptions.solarCapex : assumptions.windCapex;
  const opexPct = isSolar ? assumptions.solarOpex : assumptions.windOpex;

  const capacityMW = areaHa * mwPerHa;
  const factorPlant = isSolar
    ? (solarCF ?? getSolarCapacityFactor(adjustedGhi))
    : (windCF ?? getWindCapacityFactor(adjustedWind));

  const annualMWh = capacityMW * factorPlant * 8760;
  const lineCost = gridDistance * assumptions.connectionUsdKm;
  const substationCost = estimateSubstationCost(capacityMW);
  const electricalEquipmentCost = (lineCost + substationCost) * assumptions.electricalEquipmentPct;
  const interconnectionCapex = lineCost + substationCost + electricalEquipmentCost;
  const capexEquipment = capacityMW * capexUnit;
  const technicalCapex = capexEquipment + interconnectionCapex;

  const devexTotal = technicalCapex * (devexPct / 100);
  const devexFactibility = devexTotal * assumptions.devexBreakdown.factibility;
  const devexEngineering = devexTotal * assumptions.devexBreakdown.engineering;
  const devexPermits = devexTotal * assumptions.devexBreakdown.permits;
  const devexGridStudies = devexTotal * assumptions.devexBreakdown.gridStudies;
  const devexManagement = devexTotal * assumptions.devexBreakdown.management;

  const capexTotal = technicalCapex + devexTotal;
  const opexAnnual = technicalCapex * opexPct;
  const revenueAnnual = annualMWh * price;
  const ebitda = revenueAnnual - opexAnnual;

  const cashflows = [-capexTotal];
  for (let y = 1; y <= lifeYears; y++) {
    const degradation = isSolar ? Math.pow(1 - assumptions.solarDegradation, y - 1) : 1;
    cashflows.push(annualMWh * degradation * price - opexAnnual);
  }

  const r = discountRatePct / 100;
  const n = lifeYears;
  const crf = (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  const lcoe = (capexTotal * crf + opexAnnual) / Math.max(1, annualMWh);
  const projectNpv = npv(r, cashflows);
  const irr = estimateIrr(cashflows);
  const payback = capexTotal / Math.max(1, ebitda);
  const breakEvenPpa = calculateBreakEvenPpa({ technicalCapex, devexTotal, annualMWh, opexAnnual, lifeYears, discountRate: r, isSolar });

  const resourceScore = isSolar ? Math.min(100, adjustedGhi * 15) : Math.min(100, adjustedWind * 12);
  const financeScore = Math.max(0, Math.min(100, (irr - r * 100 + 4) * 10));
  const gridScore = Math.max(0, 100 - gridDistance * 2.2);
  const legalScore = Math.max(0, 100 - zone.legal);
  const climateScore = Math.max(0, 100 - zone.climate);
  const riskScore = Math.max(0, Math.min(100, resourceScore * 0.25 + financeScore * 0.3 + gridScore * 0.2 + legalScore * 0.15 + climateScore * 0.1));
  const riskLevel = riskScore >= 70 ? "bajo" : riskScore >= 45 ? "medio" : "alto";

  return {
    capacityMW,
    factorPlant,
    annualMWh,
    capexEquipment,
    lineCost,
    substationCost,
    electricalEquipmentCost,
    interconnectionCapex,
    technicalCapex,
    gridDistance,
    devexTotal,
    devexFactibility,
    devexEngineering,
    devexPermits,
    devexGridStudies,
    devexManagement,
    capexTotal,
    opexAnnual,
    revenueAnnual,
    ebitda,
    lcoe,
    npv: projectNpv,
    irr,
    payback,
    breakEvenPpa,
    riskScore,
    riskLevel,
    adjustedGhi,
    adjustedWind,
    crf,
    resourceScore,
    financeScore,
    gridScore,
    legalScore,
    climateScore,
    cashflows,
    dataSource: isSolar && nasaUsed ? "NASA POWER - ALLSKY_SFC_SW_DWN" : isSolar ? "Estimación regional MVP" : "Estimación regional MVP; reemplazar por Global Wind Atlas en backend GIS",
    nasaUsed,
  };
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

function PeruMap({ lat, lon, zone, onClick }: { lat: number; lon: number; zone: Zone; onClick?: (event: React.MouseEvent<HTMLDivElement>) => void }) {
  const marker = projectToMap(lat, lon);
  const zoneMarker = projectToMap(zone.lat, zone.lon);
  return (
    <div onClick={onClick} className="relative w-full overflow-hidden rounded-3xl border bg-sky-50 shadow-sm cursor-crosshair print:cursor-default">
      <svg viewBox="0 0 640 360" className="w-full h-auto block" role="img" aria-label="Mapa referencial del Perú">
        <rect width="640" height="360" fill="#e8f6ff" />
        <path d="M210 42 C250 30 292 40 318 68 C348 101 344 140 360 170 C376 201 422 216 432 251 C441 283 415 318 375 331 C330 347 287 335 258 302 C232 273 221 243 194 220 C166 196 143 178 148 145 C154 107 178 68 210 42 Z" fill="#bbf7d0" stroke="#047857" strokeWidth="5" />
        <path d="M210 42 C190 88 178 140 181 196 C184 248 204 292 235 324" stroke="#0f766e" strokeWidth="4" fill="none" opacity="0.55" />
        <path d="M235 324 C270 303 299 285 337 277 C374 270 406 262 432 251" stroke="#0f766e" strokeWidth="3" fill="none" opacity="0.35" />
        <path d="M200 75 C238 88 272 105 310 132 C342 155 374 184 422 208" stroke="#0f766e" strokeWidth="2" fill="none" opacity="0.25" />
        <text x="36" y="42" fontSize="20" fontWeight="700" fill="#0f172a">Mapa referencial Perú</text>
        <text x="36" y="66" fontSize="13" fill="#475569">Selecciona departamento y haz clic para afinar coordenadas</text>
        <circle cx={`${zoneMarker.x}%`} cy={`${zoneMarker.y}%`} r="7" fill="#0ea5e9" opacity="0.55" />
        <circle cx={`${marker.x}%`} cy={`${marker.y}%`} r="9" fill="#ef4444" stroke="white" strokeWidth="4" />
        <circle cx={`${marker.x}%`} cy={`${marker.y}%`} r="19" fill="none" stroke="#ef4444" strokeWidth="3" opacity="0.55" />
        <text x="36" y="320" fontSize="13" fill="#0f172a">Coordenadas: {lat.toFixed(5)}, {lon.toFixed(5)}</text>
        <text x="36" y="342" fontSize="13" fill="#0f172a">Departamento de referencia: {zone.region}</text>
      </svg>
    </div>
  );
}

export default function Home() {
  const [technology, setTechnology] = useState("solar");
  const [areaHa, setAreaHa] = useState(557);
  const [price, setPrice] = useState(55);
  const [lifeYears, setLifeYears] = useState(30);
  const [discountRatePct, setDiscountRatePct] = useState(10);
  const [devexPct, setDevexPct] = useState(6);
  const [zone, setZone] = useState<Zone>(zones.find((z) => z.region === "Arequipa") || zones[0]);
  const [lat, setLat] = useState(-16.41);
  const [lon, setLon] = useState(-71.54);
  const [gridDistance, setGridDistance] = useState(9);
  const [result, setResult] = useState<Result | null>(null);
  const [message, setMessage] = useState("Selecciona departamento, afina coordenadas, ajusta vida útil, PPA y distancia a red. Luego ejecuta el análisis.");
  const [loading, setLoading] = useState(false);

  const liveEstimate = useMemo(
    () => calculate(zone, technology, areaHa, price, lat, lon, devexPct, gridDistance, lifeYears, discountRatePct),
    [zone, technology, areaHa, price, lat, lon, devexPct, gridDistance, lifeYears, discountRatePct]
  );

  const locationLabel = `Coordenadas ${lat.toFixed(5)}, ${lon.toFixed(5)}`;
  const techName = technology === "solar" ? "Solar FV" : "Eólico";
  const capexUnit = technology === "solar" ? assumptions.solarCapex : assumptions.windCapex;
  const opexPct = technology === "solar" ? assumptions.solarOpex : assumptions.windOpex;
  const mwHa = technology === "solar" ? assumptions.solarMwHa : assumptions.windMwHa;
  const active = result || liveEstimate;
  const resourceValue = technology === "solar" ? active.adjustedGhi : active.adjustedWind;
  const resourceLabel = technology === "solar" ? "GHI" : "Viento";
  const resourceUnit = technology === "solar" ? "kWh/m²/día" : "m/s";
  const isFinanciallyAttractive = active.npv >= 0 && active.irr >= discountRatePct;

  function selectZone(region: string) {
    const selected = zones.find((z) => z.region === region) || zones[0];
    setZone(selected);
    setLat(selected.lat);
    setLon(selected.lon);
    setGridDistance(selected.grid);
    setResult(null);
    setMessage(`Departamento seleccionado: ${selected.region}. El mapa se centró en el departamento; haz clic para afinar la ubicación.`);
  }

  function selectFromMap(event: React.MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    const selectedLon = -82 + x * 14;
    const selectedLat = 0.5 - y * 19.2;
    setLat(Number(selectedLat.toFixed(5)));
    setLon(Number(selectedLon.toFixed(5)));
    setResult(null);
    setMessage("Coordenadas afinadas visualmente. Ejecuta el análisis para actualizar resultados.");
  }

  async function analyze() {
    setLoading(true);
    try {
      let ghiReal: number | undefined;
      let nasaUsed = false;
      let solarCF: number | undefined;

      if (technology === "solar") {
        try {
          const nasaData = await getNASAResourceData(lat, lon);
          ghiReal = nasaData.ghi;
          solarCF = getSolarCapacityFactor(ghiReal);
          nasaUsed = true;
        } catch (error) {
          console.warn(error);
        }
      }

      const windSpeedReal = estimateWindSpeedPeru(lat);
      const windCF = getWindCapacityFactor(windSpeedReal);
      const calculated = calculate(
        zone,
        technology,
        areaHa,
        price,
        lat,
        lon,
        devexPct,
        gridDistance,
        lifeYears,
        discountRatePct,
        ghiReal,
        windSpeedReal,
        solarCF,
        windCF,
        nasaUsed,
      );

      setResult(calculated);
      setMessage(
        nasaUsed
          ? `Análisis generado con NASA POWER para ${locationLabel}. PPA usado: ${price} USD/MWh. Vida útil: ${lifeYears} años.`
          : `Análisis generado con estimación MVP para ${locationLabel}. PPA usado: ${price} USD/MWh. Vida útil: ${lifeYears} años.`
      );
      setTimeout(() => document.getElementById("resultados")?.scrollIntoView({ behavior: "smooth" }), 100);
    } finally {
      setLoading(false);
    }
  }

  async function printReport() {
    if (!result) await analyze();
    setTimeout(() => window.print(), 300);
  }

  function scenario(priceMult: number, capexMult: number, fpMult: number) {
    const base = result || liveEstimate;
    const adjustedTechnicalCapex = (base.capexEquipment + base.interconnectionCapex) * capexMult;
    const adjustedDevex = adjustedTechnicalCapex * (devexPct / 100);
    const adjustedCapex = adjustedTechnicalCapex + adjustedDevex;
    const adjustedMWh = base.annualMWh * fpMult;
    const adjustedOpex = adjustedTechnicalCapex * opexPct;
    const cashflows = [-adjustedCapex];
    for (let y = 1; y <= lifeYears; y++) {
      const degradation = technology === "solar" ? Math.pow(1 - assumptions.solarDegradation, y - 1) : 1;
      cashflows.push(adjustedMWh * degradation * price * priceMult - adjustedOpex);
    }
    const irr = estimateIrr(cashflows);
    const npvValue = npv(discountRatePct / 100, cashflows);
    const r = discountRatePct / 100;
    const crf = (r * Math.pow(1 + r, lifeYears)) / (Math.pow(1 + r, lifeYears) - 1);
    const lcoe = (adjustedCapex * crf + adjustedOpex) / Math.max(1, adjustedMWh);
    return { irr, npvValue, lcoe };
  }

  const pessimistic = scenario(0.8, 1.15, 0.9);
  const baseScenario = scenario(1, 1, 1);
  const optimistic = scenario(1.2, 0.9, 1.1);

  const vanExplanation = active.npv >= 0
    ? `El VAN es positivo porque los flujos de caja descontados a ${discountRatePct}% cubren la inversión inicial y generan valor adicional.`
    : `El VAN es negativo porque, con un PPA de ${price} USD/MWh, los flujos descontados no cubren la inversión inicial. El precio mínimo estimado para VAN = 0 es ${active.breakEvenPpa.toFixed(1)} USD/MWh.`;

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b bg-white print:hidden">
        <div className="mx-auto max-w-7xl px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-2xl bg-emerald-600 flex items-center justify-center"><Zap className="text-white" /></div>
            <div>
              <h1 className="text-2xl font-bold">Energycom Nexus AI</h1>
              <p className="text-sm text-slate-500">From Land to Power · MVP Perú · NASA, PPA editable, VAN explicado y mapa visible</p>
            </div>
          </div>
          <button className="rounded-2xl bg-slate-900 text-white px-4 py-2 text-sm">Solicitar demo</button>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-8 grid lg:grid-cols-[1.05fr_0.95fr] gap-6 print:hidden">
        <div className="rounded-3xl bg-gradient-to-br from-emerald-100 via-sky-100 to-slate-200 min-h-[640px] p-5 relative overflow-hidden border border-slate-200">
          <div className="flex items-center gap-3 mb-4">
            <MapPin className="text-emerald-700" />
            <select className="w-full rounded-2xl border bg-white px-4 py-3 text-lg" value={zone.region} onChange={(e) => selectZone(e.target.value)}>
              {zones.map((z) => <option key={z.region} value={z.region}>{z.region} · {z.macro}</option>)}
            </select>
          </div>

          <PeruMap lat={lat} lon={lon} zone={zone} onClick={selectFromMap} />

          <p className="relative z-10 mt-5 text-sm text-slate-700 bg-white/70 rounded-2xl p-4">{zone.note}</p>
          <div className="relative z-10 mt-4 grid grid-cols-3 gap-3">
            <div className="rounded-2xl bg-white/90 p-4"><p className="text-xs text-slate-500">GHI base</p><strong>{zone.ghi} kWh/m²/día</strong></div>
            <div className="rounded-2xl bg-white/90 p-4"><p className="text-xs text-slate-500">Viento base</p><strong>{zone.wind} m/s</strong></div>
            <div className="rounded-2xl bg-white/90 p-4"><p className="text-xs text-slate-500">Red editable</p><strong>{gridDistance} km</strong></div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
            <h2 className="text-xl font-bold">Análisis de prefactibilidad</h2>
            <p className="text-sm text-slate-600 mt-2">Incluye coordenadas, potencial, EPC, interconexión, gastos de desarrollo, VAN, TIR, LCOE, precio PPA, precio de equilibrio y conclusión automática.</p>
            <div className="mt-5 space-y-5">
              <div className="grid grid-cols-2 gap-3">
                <label className="text-sm font-medium">Latitud<input type="number" step="0.00001" value={lat} onChange={(e) => { setLat(Number(e.target.value)); setResult(null); }} className="mt-1 w-full rounded-xl border p-3" /></label>
                <label className="text-sm font-medium">Longitud<input type="number" step="0.00001" value={lon} onChange={(e) => { setLon(Number(e.target.value)); setResult(null); }} className="mt-1 w-full rounded-xl border p-3" /></label>
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
                <label className="font-medium">Precio PPA / energía usado: ${price}/MWh</label>
                <input className="w-full mt-2" type="range" min="25" max="90" value={price} onChange={(e) => { setPrice(Number(e.target.value)); setResult(null); }} />
                <input className="mt-2 w-full rounded-xl border p-3" type="number" min="0" value={price} onChange={(e) => { setPrice(Number(e.target.value)); setResult(null); }} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <label className="font-medium">Vida útil: {lifeYears} años<input className="w-full mt-2" type="range" min="20" max="35" value={lifeYears} onChange={(e) => { setLifeYears(Number(e.target.value)); setResult(null); }} /></label>
                <label className="font-medium">Tasa descuento: {discountRatePct}%<input className="w-full mt-2" type="range" min="6" max="14" value={discountRatePct} onChange={(e) => { setDiscountRatePct(Number(e.target.value)); setResult(null); }} /></label>
              </div>
              <div>
                <label className="font-medium">Distancia a red ingresada: {gridDistance} km</label>
                <input className="w-full mt-2" type="range" min="1" max="120" value={gridDistance} onChange={(e) => { setGridDistance(Number(e.target.value)); setResult(null); }} />
                <input className="mt-2 w-full rounded-xl border p-3" type="number" min="0" value={gridDistance} onChange={(e) => { setGridDistance(Number(e.target.value)); setResult(null); }} />
              </div>
              <div>
                <label className="font-medium">Gastos de desarrollo y permisos: {devexPct}% del CAPEX técnico</label>
                <input className="w-full mt-2" type="range" min="3" max="15" value={devexPct} onChange={(e) => { setDevexPct(Number(e.target.value)); setResult(null); }} />
              </div>
              <div className="rounded-2xl bg-slate-50 border p-4 text-sm">
                Estimación previa: <strong>{num(liveEstimate.capacityMW)} MW</strong> · <strong>{num(liveEstimate.annualMWh, 0)} MWh/año</strong> · inversión <strong>{usd(liveEstimate.capexTotal)}</strong><br />
                LCOE <strong>${liveEstimate.lcoe.toFixed(1)}/MWh</strong> vs PPA <strong>${price}/MWh</strong> · Precio equilibrio VAN=0: <strong>${liveEstimate.breakEvenPpa.toFixed(1)}/MWh</strong>
              </div>
              <button onClick={analyze} disabled={loading} className="w-full rounded-2xl bg-slate-900 text-white py-3 font-semibold disabled:opacity-60">{loading ? "Consultando NASA POWER..." : "Ejecutar análisis"}</button>
              <p className="text-sm text-slate-500">{message}</p>
            </div>
          </div>
        </div>
      </section>

      {result && (
        <section id="resultados" className="mx-auto max-w-7xl px-6 pb-10 space-y-6 print:px-8 print:py-8">
          <div className="hidden print:block mb-8 border-b pb-5">
            <h1 className="text-3xl font-bold">Memoria de cálculo preliminar</h1>
            <p>Energycom Nexus AI · {locationLabel}, Perú · Proyecto {techName}</p>
            <p>Coordenadas: {lat.toFixed(5)}, {lon.toFixed(5)} · Área: {areaHa} ha · Distancia a red: {result.gridDistance} km · Vida útil: {lifeYears} años · PPA: ${price}/MWh</p>
          </div>

          <div className="flex items-start justify-between gap-4 print:block">
            <div>
              <h2 className="text-2xl font-bold">Resultados de prefactibilidad</h2>
              <p className="text-slate-600">{locationLabel} · {areaHa} ha · {techName} · red {result.gridDistance} km · vida útil {lifeYears} años</p>
            </div>
            <button onClick={printReport} className="print:hidden rounded-2xl bg-emerald-600 text-white px-4 py-3 font-semibold flex items-center gap-2"><Download className="h-4" /> Generar memoria PDF</button>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200 break-inside-avoid">
            <h3 className="text-xl font-bold mb-3">Mapa e imagen de ubicación</h3>
            <PeruMap lat={lat} lon={lon} zone={zone} />
            <p className="mt-2 text-sm text-slate-600">Mapa referencial SVG generado dentro de la app. No depende de imágenes externas, por lo que debe visualizarse en pantalla y en PDF.</p>
          </div>

          <div className="grid md:grid-cols-4 gap-4">
            <Card icon={Zap} title="Capacidad" value={`${num(result.capacityMW)} MW`} subtitle="estimada" />
            <Card icon={Sun} title="Producción" value={`${num(result.annualMWh, 0)} MWh/año`} subtitle={`FP ${(result.factorPlant * 100).toFixed(1)}%`} />
            <Card icon={DollarSign} title="Inversión inicial total" value={usd(result.capexTotal)} subtitle={`CAPEX técnico ${usd(result.technicalCapex)} + gastos ${usd(result.devexTotal)}`} />
            <Card icon={AlertTriangle} title="Riesgo" value={`${result.riskScore.toFixed(0)}/100`} subtitle={`nivel ${result.riskLevel}`} />
            <Card icon={DollarSign} title="Ingresos" value={usd(result.revenueAnnual)} subtitle={`PPA ${price} USD/MWh`} />
            <Card icon={Building2} title="OPEX" value={usd(result.opexAnnual)} subtitle="anual estimado" />
            <Card icon={FileText} title="LCOE vs PPA" value={`$${result.lcoe.toFixed(1)} vs $${price}`} subtitle="USD/MWh" />
            <Card icon={Landmark} title="Precio equilibrio" value={`$${result.breakEvenPpa.toFixed(1)}/MWh`} subtitle="para VAN = 0" />
            <Card icon={Landmark} title="VAN" value={usd(result.npv)} subtitle={`${discountRatePct}% descuento`} />
            <Card icon={Zap} title="TIR" value={`${result.irr.toFixed(1)}%`} subtitle="preliminar" />
            <Card icon={Download} title="Payback" value={`${result.payback.toFixed(1)} años`} subtitle="simple" />
            <Card icon={Users} title="PPA" value={isFinanciallyAttractive ? "Viable" : "Revisar"} subtitle={`usado ${price} USD/MWh`} />
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200 break-inside-avoid">
            <h3 className="text-xl font-bold mb-4">Diagnóstico financiero automático</h3>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="rounded-2xl bg-slate-50 p-4"><strong>PPA usado</strong><br />${price.toFixed(1)}/MWh</div>
              <div className="rounded-2xl bg-slate-50 p-4"><strong>LCOE estimado</strong><br />${result.lcoe.toFixed(1)}/MWh</div>
              <div className="rounded-2xl bg-slate-50 p-4"><strong>Precio mínimo VAN=0</strong><br />${result.breakEvenPpa.toFixed(1)}/MWh</div>
            </div>
            <p className="mt-4 text-slate-700"><strong>Interpretación:</strong> {vanExplanation}</p>
            <p className="mt-2 text-slate-700">
              {result.npv >= 0
                ? "La oportunidad es financieramente atractiva bajo estos supuestos preliminares. Aun así, debe validarse con cotización EPC, estudios de interconexión, permisos y estructuración contractual."
                : "La oportunidad puede tener excelente recurso solar, pero financieramente requiere optimizar el precio PPA, CAPEX, distancia de interconexión, tasa de descuento o estructura de financiamiento."}
            </p>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200 break-inside-avoid">
            <h3 className="text-xl font-bold mb-4">Fuente de datos de recurso</h3>
            <ul className="text-sm space-y-2 list-disc pl-5">
              <li><strong>Recurso solar:</strong> {result.dataSource.includes("NASA") ? "NASA POWER, parámetro ALLSKY_SFC_SW_DWN, promedio climatológico de largo plazo." : "Estimación regional MVP."}</li>
              <li><strong>Recurso eólico:</strong> estimación regional MVP Perú. En fase backend debe reemplazarse por Global Wind Atlas / GIS raster o campaña de medición.</li>
              <li><strong>Advertencia:</strong> los datos son preliminares y deben validarse con recurso horario, medición, ingeniería e interconexión.</li>
            </ul>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
            <h3 className="text-xl font-bold mb-4">Memoria de cálculo detallada</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-100"><tr><th className="p-3 text-left">Proceso</th><th className="p-3 text-left">Fórmula</th><th className="p-3 text-left">Cálculo aplicado</th><th className="p-3 text-left">Resultado</th></tr></thead>
                <tbody>
                  <DetailRow label="Recurso" formula="GHI = NASA POWER ALLSKY_SFC_SW_DWN" calculation={`${result.adjustedGhi.toFixed(2)} kWh/m²/día`} result={`${result.adjustedGhi.toFixed(2)} kWh/m²/día`} />
                  <DetailRow label="Potencia instalable" formula="P_inst = Área × densidad MW/ha" calculation={`${areaHa} ha × ${mwHa} MW/ha`} result={`${num(result.capacityMW)} MW`} />
                  <DetailRow label="Factor de planta" formula="FP = GHI / 24, acotado 18%–31%" calculation={`${result.adjustedGhi.toFixed(2)} / 24`} result={`${(result.factorPlant * 100).toFixed(2)}%`} />
                  <DetailRow label="Producción anual" formula="E = P_inst × FP × 8,760" calculation={`${num(result.capacityMW)} × ${(result.factorPlant * 100).toFixed(2)}% × 8,760`} result={`${num(result.annualMWh, 0)} MWh/año`} />
                  <DetailRow label="CAPEX equipos/EPC" formula="CAPEX_EPC = P_inst × CAPEX_unitario" calculation={`${num(result.capacityMW)} MW × ${usdFull(capexUnit)}/MW`} result={usdFull(result.capexEquipment)} />
                  <DetailRow label="Costo de línea" formula="C_línea = distancia ingresada × USD/km" calculation={`${result.gridDistance} km × ${usdFull(assumptions.connectionUsdKm)}/km`} result={usdFull(result.lineCost)} />
                  <DetailRow label="Subestación" formula="C_subestación = f(MW, nivel de tensión)" calculation={`Tipo ${getSubstationType(result.capacityMW)}`} result={usdFull(result.substationCost)} />
                  <DetailRow label="Equipos eléctricos" formula="C_equipos = 15% × (línea + subestación)" calculation={`15% × (${usdFull(result.lineCost)} + ${usdFull(result.substationCost)})`} result={usdFull(result.electricalEquipmentCost)} />
                  <DetailRow label="CAPEX interconexión" formula="CAPEX_interconexión = línea + subestación + equipos" calculation={`${usdFull(result.lineCost)} + ${usdFull(result.substationCost)} + ${usdFull(result.electricalEquipmentCost)}`} result={usdFull(result.interconnectionCapex)} />
                  <DetailRow label="CAPEX técnico" formula="CAPEX_técnico = CAPEX_EPC + CAPEX_interconexión" calculation={`${usdFull(result.capexEquipment)} + ${usdFull(result.interconnectionCapex)}`} result={usdFull(result.technicalCapex)} />
                  <DetailRow label="Gastos desarrollo" formula="Gastos_desarrollo = CAPEX_técnico × %" calculation={`${usdFull(result.technicalCapex)} × ${devexPct}%`} result={usdFull(result.devexTotal)} />
                  <DetailRow label="Inversión inicial" formula="Inversión = CAPEX_técnico + gastos_desarrollo" calculation={`${usdFull(result.technicalCapex)} + ${usdFull(result.devexTotal)}`} result={usdFull(result.capexTotal)} />
                  <DetailRow label="OPEX anual" formula="OPEX = CAPEX_técnico × %OPEX" calculation={`${usdFull(result.technicalCapex)} × ${(opexPct * 100).toFixed(1)}%`} result={usdFull(result.opexAnnual)} />
                  <DetailRow label="Ingresos anuales" formula="Ingresos = E × precio PPA" calculation={`${num(result.annualMWh, 0)} MWh × $${price}/MWh`} result={usdFull(result.revenueAnnual)} />
                  <DetailRow label="LCOE" formula="LCOE = (Inversión×CRF + OPEX) / E" calculation={`(${usdFull(result.capexTotal)} × ${result.crf.toFixed(4)} + ${usdFull(result.opexAnnual)}) / ${num(result.annualMWh, 0)}`} result={`$${result.lcoe.toFixed(2)}/MWh`} />
                  <DetailRow label="VAN" formula="VAN = Σ FCt/(1+r)^t" calculation={`r = ${discountRatePct}%, vida = ${lifeYears} años`} result={usdFull(result.npv)} />
                  <DetailRow label="TIR" formula="TIR = tasa donde VAN = 0" calculation="Iteración sobre flujos de caja" result={`${result.irr.toFixed(2)}%`} />
                  <DetailRow label="Precio equilibrio" formula="PPA* donde VAN = 0" calculation="Búsqueda binaria sobre precio PPA" result={`$${result.breakEvenPpa.toFixed(2)}/MWh`} />
                  <DetailRow label="Payback simple" formula="Payback = Inversión / EBITDA" calculation={`${usdFull(result.capexTotal)} / ${usdFull(result.ebitda)}`} result={`${result.payback.toFixed(2)} años`} />
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200 break-inside-avoid">
            <h3 className="text-xl font-bold mb-4">Interconexión eléctrica: línea, subestación y equipos</h3>
            <p className="text-sm text-slate-600 mb-4">La interconexión se considera dentro del CAPEX técnico. La distancia a red es un input ingresado por el usuario.</p>
            <table className="w-full text-sm">
              <tbody>
                <tr className="border-b"><td className="p-3 font-medium">Línea de conexión</td><td className="p-3">{result.gridDistance} km × {usdFull(assumptions.connectionUsdKm)}/km</td><td className="p-3 text-right">{usdFull(result.lineCost)}</td></tr>
                <tr className="border-b"><td className="p-3 font-medium">Subestación</td><td className="p-3">Tipo {getSubstationType(result.capacityMW)}</td><td className="p-3 text-right">{usdFull(result.substationCost)}</td></tr>
                <tr className="border-b"><td className="p-3 font-medium">Equipos eléctricos</td><td className="p-3">15% de línea + subestación</td><td className="p-3 text-right">{usdFull(result.electricalEquipmentCost)}</td></tr>
                <tr className="bg-slate-50 font-bold"><td className="p-3">Total CAPEX interconexión</td><td className="p-3">Línea + subestación + equipos</td><td className="p-3 text-right">{usdFull(result.interconnectionCapex)}</td></tr>
              </tbody>
            </table>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200 break-inside-avoid">
            <h3 className="text-xl font-bold mb-4">Gastos de desarrollo y permisos del proyecto</h3>
            <table className="w-full text-sm">
              <tbody>
                <tr className="border-b"><td className="p-3 font-medium">Factibilidad</td><td className="p-3">Prefactibilidad, factibilidad, recurso, visitas, topografía/geotecnia preliminar</td><td className="p-3 text-right">{usdFull(result.devexFactibility)}</td><td className="p-3 text-right">22%</td></tr>
                <tr className="border-b"><td className="p-3 font-medium">Ingeniería</td><td className="p-3">Ingeniería conceptual, básica/FEED y soporte para ingeniería de detalle</td><td className="p-3 text-right">{usdFull(result.devexEngineering)}</td><td className="p-3 text-right">28%</td></tr>
                <tr className="border-b"><td className="p-3 font-medium">Permisos y legal</td><td className="p-3">Permisos sectoriales, saneamiento, contratos, servidumbres y soporte regulatorio</td><td className="p-3 text-right">{usdFull(result.devexPermits)}</td><td className="p-3 text-right">16%</td></tr>
                <tr className="border-b"><td className="p-3 font-medium">Interconexión - estudios</td><td className="p-3">Estudios de conexión, impacto al sistema y gestión ante operador de red</td><td className="p-3 text-right">{usdFull(result.devexGridStudies)}</td><td className="p-3 text-right">14%</td></tr>
                <tr className="border-b"><td className="p-3 font-medium">Gestión/desarrollo</td><td className="p-3">Project management, desarrollo comercial, negociación PPA y estructuración financiera</td><td className="p-3 text-right">{usdFull(result.devexManagement)}</td><td className="p-3 text-right">20%</td></tr>
                <tr className="bg-slate-50 font-bold"><td className="p-3">Total</td><td className="p-3">{devexPct}% sobre CAPEX técnico</td><td className="p-3 text-right">{usdFull(result.devexTotal)}</td><td className="p-3 text-right">100%</td></tr>
              </tbody>
            </table>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200 break-inside-avoid">
              <h3 className="text-xl font-bold mb-3">Supuestos técnicos y financieros</h3>
              <ul className="text-sm space-y-2 list-disc pl-5">
                <li>Tecnología evaluada: {techName}.</li>
                <li>Densidad de instalación: {mwHa} MW/ha.</li>
                <li>CAPEX unitario: {usdFull(capexUnit)}/MW.</li>
                <li>OPEX anual: {(opexPct * 100).toFixed(1)}% del CAPEX técnico.</li>
                <li>Vida útil editable usada: {lifeYears} años.</li>
                <li>Precio PPA usado: {price} USD/MWh.</li>
                <li>Tasa de descuento: {discountRatePct}%.</li>
                <li>Distancia a red ingresada: {result.gridDistance} km.</li>
                <li>Costo preliminar de línea de conexión: {usdFull(assumptions.connectionUsdKm)}/km.</li>
                <li>Subestación estimada: {getSubstationType(result.capacityMW)} = {usdFull(result.substationCost)}.</li>
                <li>Equipos eléctricos: 15% de línea + subestación.</li>
                <li>Gastos de desarrollo y permisos: {devexPct}% del CAPEX técnico, separados del CAPEX.</li>
                <li>Degradación solar anual: 0.5%.</li>
                <li>Coordenadas usadas: {lat.toFixed(5)}, {lon.toFixed(5)}.</li>
              </ul>
            </div>
            <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200 break-inside-avoid">
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

          <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200 break-inside-avoid">
            <h3 className="text-xl font-bold">Análisis de riesgo preliminar</h3>
            <div className="mt-4 grid md:grid-cols-5 gap-3 text-sm">
              <div className="rounded-2xl bg-slate-50 p-4"><strong>Recurso</strong><br />{result.resourceScore.toFixed(0)}/100</div>
              <div className="rounded-2xl bg-slate-50 p-4"><strong>Financiero</strong><br />{result.financeScore.toFixed(0)}/100</div>
              <div className="rounded-2xl bg-slate-50 p-4"><strong>Red</strong><br />{result.gridScore.toFixed(0)}/100</div>
              <div className="rounded-2xl bg-slate-50 p-4"><strong>Legal</strong><br />{result.legalScore.toFixed(0)}/100</div>
              <div className="rounded-2xl bg-slate-50 p-4"><strong>Climático</strong><br />{result.climateScore.toFixed(0)}/100</div>
            </div>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200 break-inside-avoid">
            <h3 className="text-xl font-bold">Conclusión automática</h3>
            <p className="mt-3 text-slate-700">
              {isFinanciallyAttractive
                ? `El proyecto presenta resultado preliminar favorable: VAN positivo y TIR superior a la tasa de descuento del ${discountRatePct}%. El recurso es atractivo; se recomienda avanzar a validación técnica, interconexión, permisos y cotización EPC.`
                : `El proyecto presenta rentabilidad limitada bajo los supuestos actuales: ${result.npv < 0 ? "VAN negativo" : "VAN positivo"} y TIR de ${result.irr.toFixed(1)}% frente a una tasa de descuento de ${discountRatePct}%. Se recomienda revisar precio PPA, CAPEX técnico, distancia de conexión, tasa de descuento y gastos de desarrollo.`}
            </p>
          </div>

          <div className="rounded-3xl bg-amber-50 p-5 border border-amber-200 text-sm text-amber-900 break-inside-avoid">
            <strong>Disclaimer:</strong> Esta memoria es preliminar y usa valores referenciales para demostración MVP. No reemplaza estudios de ingeniería, campañas de medición, due diligence legal, permisos, evaluación ambiental, estudios de interconexión ni asesoría financiera o legal requerida para decisiones de inversión.
          </div>
        </section>
      )}
    </main>
  );
}
