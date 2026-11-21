import React, { useState } from 'react';
import { Activity, Globe2, Layers } from 'lucide-react';
import { BRICS_COUNTRIES } from '../shared/bricsData';
import type { BricsCountryCode, CitizenGrievance } from '../shared/types';
import { CARD_SURFACE_CLASS, SUBTLE_PANEL_CLASS } from './ui/styles';

type GisLayer = 'all' | 'grievances' | 'investments';

interface LayerOption {
  id: GisLayer;
  label: string;
}

const LAYER_OPTIONS: readonly LayerOption[] = [
  { id: 'all', label: 'All Layers' },
  { id: 'grievances', label: 'Citizen Density' },
  { id: 'investments', label: 'Budget Outlay' },
];

interface CountryGeoHotspot {
  name: string;
  gap: number;
  grievances: number;
  budget: string;
}

interface CountryGeoProfile {
  lat: string;
  lng: string;
  hotspots: CountryGeoHotspot[];
}

const COUNTRY_GEO_DATA: Record<BricsCountryCode, CountryGeoProfile> = {
  IN: {
    lat: '20.5937° N',
    lng: '78.9629° E',
    hotspots: [
      {
        name: 'Tamil Nadu (Madurai / Melur)',
        gap: 78,
        grievances: 1420,
        budget: '$8.4B Jal Jeevan',
      },
      {
        name: 'Uttar Pradesh (Varanasi / Purvanchal)',
        gap: 64,
        grievances: 2100,
        budget: '$3.2B PMGSY',
      },
      {
        name: 'Maharashtra (Pune Rural / Marathwada)',
        gap: 58,
        grievances: 1840,
        budget: '$2.5B Water Grid',
      },
      {
        name: 'Assam (Guwahati / Brahmaputra Valley)',
        gap: 71,
        grievances: 980,
        budget: '$1.8B Health Mission',
      },
    ],
  },
  BR: {
    lat: '14.2350° S',
    lng: '51.9253° W',
    hotspots: [
      {
        name: 'Bahia (Feira de Santana / Sertão)',
        gap: 72,
        grievances: 840,
        budget: '$14.2B Novo PAC',
      },
      {
        name: 'São Paulo (Campinas / Interior)',
        gap: 42,
        grievances: 1120,
        budget: '$6.8B Rodovias',
      },
      {
        name: 'Amazonas (Manaus / Rio Negro)',
        gap: 85,
        grievances: 640,
        budget: '$4.1B Saúde Família',
      },
    ],
  },
  RU: {
    lat: '61.5240° N',
    lng: '105.3188° E',
    hotspots: [
      { name: 'Tatarstan (Kazan / Zelenodolsk)', gap: 54, grievances: 480, budget: '$11.6B Roads' },
      { name: 'Sverdlovsk (Yekaterinburg)', gap: 49, grievances: 620, budget: '$3.7B Clean Water' },
      { name: 'Novosibirsk (Siberia)', gap: 63, grievances: 510, budget: '$4.9B Healthcare' },
    ],
  },
  CN: {
    lat: '35.8617° N',
    lng: '104.1954° E',
    hotspots: [
      {
        name: 'Sichuan (Liangshan Rural Belt)',
        gap: 52,
        grievances: 1350,
        budget: '$38.5B Revitalization',
      },
      {
        name: 'Hebei (Shijiazhuang Region)',
        gap: 46,
        grievances: 980,
        budget: '$22.0B Water Grid',
      },
      {
        name: 'Guangdong (Foshan / Pearl River)',
        gap: 31,
        grievances: 1890,
        budget: '$12.4B Clinics',
      },
    ],
  },
  ZA: {
    lat: '30.5595° S',
    lng: '22.9375° E',
    hotspots: [
      {
        name: 'KwaZulu-Natal (eThekwini / Inanda)',
        gap: 88,
        grievances: 1240,
        budget: '$2.1B MIG Water',
      },
      { name: 'Eastern Cape (OR Tambo)', gap: 82, grievances: 940, budget: '$1.9B SANRAL Roads' },
      {
        name: 'Gauteng (Johannesburg South)',
        gap: 56,
        grievances: 1680,
        budget: '$980M NHI Clinics',
      },
    ],
  },
  EG: {
    lat: '26.8206° N',
    lng: '30.8025° E',
    hotspots: [
      {
        name: 'Asyut (Dairut / Upper Egypt)',
        gap: 76,
        grievances: 730,
        budget: '$12.0B Hayah Karima',
      },
      { name: 'Beheira (Nile Delta)', gap: 55, grievances: 640, budget: '$4.5B National Roads' },
      { name: 'Giza Rural Belt', gap: 61, grievances: 890, budget: '$1.4B Health Insurance' },
    ],
  },
  ET: {
    lat: '9.1450° N',
    lng: '40.4897° E',
    hotspots: [
      { name: 'Oromia (Adama / Jimma)', gap: 84, grievances: 610, budget: '$1.1B URRAP Roads' },
      { name: 'Amhara (Bahir Dar)', gap: 79, grievances: 530, budget: '$890M One WASH' },
      { name: 'Somali Region (Jijiga)', gap: 91, grievances: 420, budget: '$450M Health Ext' },
    ],
  },
  IR: {
    lat: '32.4279° N',
    lng: '53.6880° E',
    hotspots: [
      {
        name: 'Khuzestan (Ahvaz Water Basin)',
        gap: 81,
        grievances: 780,
        budget: '$3.4B Desalination',
      },
      {
        name: 'Sistan and Baluchestan (Zahedan)',
        gap: 86,
        grievances: 490,
        budget: '$2.8B Transit Corridor',
      },
      { name: 'Isfahan (Zayandeh Rood)', gap: 68, grievances: 820, budget: '$1.2B Behvarz Grid' },
    ],
  },
  SA: {
    lat: '23.8859° N',
    lng: '45.0792° E',
    hotspots: [
      {
        name: 'Asir (Abha Mountain Corridor)',
        gap: 38,
        grievances: 320,
        budget: '$9.5B Water Security',
      },
      { name: 'Makkah (Taif Water & Roads)', gap: 31, grievances: 480, budget: '$7.2B Transport' },
      {
        name: 'Eastern Province (Al-Ahsa)',
        gap: 28,
        grievances: 390,
        budget: '$4.8B Seha Clinics',
      },
    ],
  },
  AE: {
    lat: '23.4241° N',
    lng: '53.8478° E',
    hotspots: [
      {
        name: 'Ras Al Khaimah (Northern Grid)',
        gap: 22,
        grievances: 180,
        budget: '$4.2B Water 2036',
      },
      {
        name: 'Fujairah (Port Logistics Road)',
        gap: 25,
        grievances: 210,
        budget: '$6.5B Etihad Rail',
      },
      {
        name: 'Abu Dhabi (Al Ain Health Grid)',
        gap: 18,
        grievances: 240,
        budget: '$2.3B EHS Smart',
      },
    ],
  },
  ID: {
    lat: '0.7893° S',
    lng: '113.9213° E',
    hotspots: [
      {
        name: 'Kalimantan (IKN Nusantara Ring)',
        gap: 59,
        grievances: 480,
        budget: '$3.8B Jalan Daerah',
      },
      {
        name: 'East Java (Surabaya / Madura)',
        gap: 62,
        grievances: 890,
        budget: '$1.7B NUWSP Water',
      },
      { name: 'North Sumatra (Medan)', gap: 67, grievances: 740, budget: '$1.9B Puskesmas' },
    ],
  },
};

const HOTSPOT_POSITIONS = [
  { top: '25%', left: '20%' },
  { top: '30%', right: '25%' },
  { bottom: '25%', left: '35%' },
  { bottom: '20%', right: '30%' },
] as const;

interface GisHeatmapViewProps {
  selectedCountryCode: BricsCountryCode;
  onSelectCountry: (code: BricsCountryCode) => void;
  grievances: CitizenGrievance[];
}

/**
 * Interactive spatial telemetry overlay showing regional demand hotspots, gap severity
 * scores, and live ingested grievance counts per BRICS jurisdiction.
 */
export const GisHeatmapView: React.FC<GisHeatmapViewProps> = ({
  selectedCountryCode,
  onSelectCountry,
  grievances,
}) => {
  const [activeLayer, setActiveLayer] = useState<GisLayer>('all');
  const [focusedHotspotName, setFocusedHotspotName] = useState<string | null>(null);
  const country = BRICS_COUNTRIES[selectedCountryCode] ?? BRICS_COUNTRIES.IN;
  const currentGeo = COUNTRY_GEO_DATA[selectedCountryCode] ?? COUNTRY_GEO_DATA.IN;
  const activeCountryGrievancesCount = grievances.filter(
    (g) => g.countryCode === selectedCountryCode
  ).length;

  return (
    <div id="gis-heatmap-view" className="space-y-6">
      <div className={`${CARD_SURFACE_CLASS} p-6 relative overflow-hidden`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-1">
              <Globe2 className="w-3.5 h-3.5 text-emerald-600" aria-hidden="true" />
              <span>Multi-Jurisdictional GIS &amp; Telemetry Map</span>
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <span>{country.name} Spatial Intelligence</span>
              <span className="text-2xl" aria-hidden="true">
                {country.flag}
              </span>
            </h2>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl font-medium">
              Fuses spatial coordinates of citizen grievances ({activeCountryGrievancesCount}{' '}
              session records) against municipal infrastructure assets and capital allocations.
            </p>
          </div>

          <div
            className="flex items-center bg-slate-100 p-1.5 rounded-xl border border-slate-200 text-xs"
            role="group"
            aria-label="Map layer filter"
          >
            {LAYER_OPTIONS.map((layer) => {
              const isSelected = activeLayer === layer.id;
              return (
                <button
                  key={layer.id}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => setActiveLayer(layer.id)}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                    isSelected
                      ? 'bg-white text-emerald-800 shadow-xs border border-slate-200'
                      : 'text-slate-700 hover:text-slate-900'
                  }`}
                >
                  {layer.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className={`lg:col-span-2 ${CARD_SURFACE_CLASS} p-6 space-y-4`}>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center space-x-2">
              <Layers className="w-4 h-4 text-emerald-600" aria-hidden="true" />
              <span className="text-sm font-bold text-slate-900">Spatial Telemetry Heatmap</span>
            </div>
            <div className="font-mono text-xs text-slate-600 font-bold">
              Center:{' '}
              <span className="text-emerald-700">
                {currentGeo.lat}, {currentGeo.lng}
              </span>
            </div>
          </div>

          <div className="relative w-full h-80 bg-slate-50 rounded-xl border border-slate-200 overflow-hidden flex items-center justify-center p-4">
            <div
              className="absolute inset-0 opacity-40 pointer-events-none"
              aria-hidden="true"
              style={{
                backgroundImage: 'radial-gradient(circle, #059669 1px, transparent 1px)',
                backgroundSize: '24px 24px',
              }}
            />

            <div className="text-center z-10 space-y-2 pointer-events-none">
              <span className="text-6xl filter drop-shadow-md" aria-hidden="true">
                {country.flag}
              </span>
              <div className="font-mono text-xs text-slate-600 font-bold uppercase tracking-wider">
                {country.name} GIS Grid Overlay
              </div>
              <div className="text-xs text-emerald-800 font-bold">
                Open Data API: {country.openDataPortalName.split('(')[0]}
              </div>
            </div>

            {currentGeo.hotspots.map((spot, idx) => {
              const pos = HOTSPOT_POSITIONS[idx % HOTSPOT_POSITIONS.length];
              const showDetail = focusedHotspotName === spot.name;

              return (
                <div key={spot.name} className="absolute z-20" style={pos}>
                  <button
                    type="button"
                    onClick={() =>
                      setFocusedHotspotName((prev) => (prev === spot.name ? null : spot.name))
                    }
                    aria-expanded={showDetail}
                    aria-label={`${spot.name}: Gap ${spot.gap} out of 100, ${spot.grievances} grievances`}
                    className="group relative flex items-center justify-center transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 rounded-full"
                  >
                    <span
                      className="absolute w-8 h-8 rounded-full bg-emerald-500/20 animate-ping"
                      aria-hidden="true"
                    />
                    <span className="h-6 px-2.5 rounded-full bg-white border border-emerald-500/60 text-[11px] font-bold text-slate-900 flex items-center space-x-1.5 shadow-md">
                      <span className="w-2 h-2 rounded-full bg-amber-500" aria-hidden="true" />
                      <span>{spot.name.split('(')[0]}</span>
                    </span>
                  </button>

                  {showDetail && (
                    <div
                      role="region"
                      aria-label={spot.name}
                      className="absolute bottom-8 left-1/2 -translate-x-1/2 w-56 bg-white border border-slate-200 p-3 rounded-xl shadow-xl z-30 text-xs space-y-1.5 font-sans"
                    >
                      <div className="font-bold text-slate-900">{spot.name}</div>
                      <div className="text-slate-600 text-[11px] flex justify-between font-medium">
                        <span>Gap Severity:</span>
                        <strong className="text-amber-800 font-bold">{spot.gap}/100</strong>
                      </div>
                      {activeLayer !== 'investments' && (
                        <div className="text-slate-600 text-[11px] flex justify-between font-medium">
                          <span>Logged Grievances:</span>
                          <strong className="text-slate-900 font-bold">{spot.grievances}</strong>
                        </div>
                      )}
                      {activeLayer !== 'grievances' && (
                        <div className="text-slate-600 text-[11px] flex justify-between font-medium">
                          <span>Program Outlay:</span>
                          <strong className="text-emerald-700 font-bold">{spot.budget}</strong>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-600 pt-1 font-medium">
            <span>Projection: EPSG:4326 (WGS 84) Sovereign Geo-Federation</span>
            <button
              type="button"
              onClick={() => onSelectCountry(selectedCountryCode)}
              className="text-emerald-700 hover:underline font-bold"
            >
              Active Layer: {LAYER_OPTIONS.find((l) => l.id === activeLayer)?.label}
            </button>
          </div>
        </div>

        <div className={`${CARD_SURFACE_CLASS} p-5 space-y-4`}>
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Activity className="w-4 h-4 text-amber-600" aria-hidden="true" />
              <span>Regional Infrastructure Gap Priority</span>
            </h3>
          </div>

          <div className="space-y-3">
            {currentGeo.hotspots.map((spot) => (
              <div key={spot.name} className={`${SUBTLE_PANEL_CLASS} p-3 space-y-2`}>
                <div className="flex items-center justify-between gap-2">
                  <div className="font-bold text-xs text-slate-900">{spot.name}</div>
                  <span className="text-[11px] font-mono font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200 shrink-0">
                    Gap: {spot.gap}/100
                  </span>
                </div>

                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-amber-600 h-full rounded-full"
                    style={{ width: `${spot.gap}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-600 pt-0.5 font-medium">
                  <span>{spot.grievances} Ingested Reports</span>
                  <span className="text-emerald-700 font-bold">{spot.budget}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
