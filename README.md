# Energycom Nexus AI — MVP Base Repository

Plataforma MVP para evaluar terrenos energéticos en Perú, escalable a América.

## Stack
- Frontend: Next.js + TypeScript + Tailwind
- Backend: FastAPI + SQLAlchemy + Pydantic
- Database: PostgreSQL + PostGIS
- GIS: Mapbox preparado para integración

## Funciones iniciales
- Healthcheck API
- Crear terreno con coordenadas/polígono simple
- Calcular potencial solar/eólico preliminar
- Calcular CAPEX, OPEX, LCOE, VAN, TIR y payback
- Evaluar riesgo preliminar

## Inicio rápido

```bash
cp .env.example .env
docker compose up --build
```

Frontend: http://localhost:3000  
Backend API: http://localhost:8000/docs

## Próximos pasos
1. Conectar Mapbox en frontend.
2. Guardar polígonos reales en PostGIS.
3. Integrar NASA POWER y Global Wind Atlas.
4. Implementar marketplace y PPA.
5. Generar reportes PDF.
