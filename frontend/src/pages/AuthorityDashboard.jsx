import { useState, useEffect, useRef, useCallback } from 'react';
import {
  BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine, Legend
} from 'recharts';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '../utils/leafletFix';
import { useSocket } from '../context/SocketContext';
import {
  Shield, AlertTriangle, Users, TrendingUp, Activity,
  Zap, RefreshCw, MapPin, Clock, CheckCircle,
  ChevronDown, Bell, Eye, EyeOff, Navigation, BarChart2, X, Ticket, Download, FileText, ShieldAlert
} from 'lucide-react';
import { CITY_COORDINATES, ALL_MONUMENT_COORDS } from '../data/cityData';

const CITY_CENTRES = CITY_COORDINATES;
const MONUMENT_COORDS = ALL_MONUMENT_COORDS;

const CROWD_POINTS = [
  {
    id: "INC-901",
    name: "Amber Fort",
    lat: 26.9855,
    lng: 75.8513,
    rushLevel: "HIGH",
    percentage: 92,
    status: "ACTIVE",
    action: "Reroute Broadcast Dispatched → Jaigarh Fort"
  },
  {
    id: "INC-902",
    name: "Taj Mahal",
    lat: 27.1751,
    lng: 78.0421,
    rushLevel: "MODERATE",
    percentage: 68,
    status: "RESOLVED",
    action: "Incentive Pass Activated → Mehtab Bagh"
  },
  {
    id: "INC-903",
    name: "Dashashwamedh Ghat",
    lat: 25.3076,
    lng: 83.0104,
    rushLevel: "HIGH",
    percentage: 88,
    status: "RESOLVED",
    action: "Boat Corridor Diverted → Assi Ghat"
  },
  {
    id: "INC-904",
    name: "India Gate",
    lat: 28.6129,
    lng: 77.2295,
    rushLevel: "HIGH",
    percentage: 90,
    status: "RESOLVED",
    action: "Shuttle Diverted → Humayun Tomb"
  }
];

const getMarkerColor = (pct) => (pct >= 80 ? '#ef4444' : pct >= 50 ? '#eab308' : '#22c55e');

const createCrowdIcon = (point) => {
  const color = getMarkerColor(point.percentage);
  return L.divIcon({
    className: 'custom-crowd-pin',
    html: `
      <div style="background-color: ${color}; color: white; padding: 4px 8px; border-radius: 9999px; font-weight: bold; font-size: 11px; display: flex; align-items: center; gap: 4px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.3); border: 2px solid white; white-space: nowrap;">
        <span style="width: 8px; height: 8px; border-radius: 50%; background: white; display: inline-block;"></span>
        <span>${point.name}: ${point.percentage}%</span>
      </div>
    `,
    iconSize: [120, 30],
    iconAnchor: [60, 15]
  });
};

function MapBoundsFitter({ points }) {
  const map = useMap();
  useEffect(() => {
    if (map && points && points.length > 0) {
      try {
        const bounds = points.map(p => [p.lat, p.lng]);
        map.fitBounds(bounds, { padding: [40, 40] });
      } catch (err) {
        console.warn("map.fitBounds error prevented:", err);
      }
    }
  }, [map, points]);
  return null;
}

function makeMarkerIcon(status, load) {
  const colors = { GREEN: '#047857', YELLOW: '#d97706', RED: '#b91c1c' };
  const color  = colors[status] || '#047857';

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="38" viewBox="0 0 32 38">
      <path d="M16 1C8.82 1 3 6.82 3 14c0 9.33 13 23 13 23S29 23.33 29 14C29 6.82 23.18 1 16 1z"
        fill="${color}" stroke="white" stroke-width="1.5"/>
      <text x="16" y="18" text-anchor="middle" fill="white" font-size="10" font-weight="bold"
        font-family="Inter,sans-serif">${load}%</text>
    </svg>`;

  return L.divIcon({
    html: svg,
    iconSize:   [32, 38],
    iconAnchor: [16, 38],
    popupAnchor:[0, -38],
    className:  '',
  });
}

function MapRecenterer({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center && Array.isArray(center) && center.length === 2 && typeof center[0] === 'number' && typeof center[1] === 'number' && !isNaN(center[0]) && !isNaN(center[1])) {
      try {
        map.setView(center, zoom || 12, { animate: true });
      } catch (err) {
        console.warn("Leaflet map.setView error prevented:", err);
      }
    }
  }, [center, zoom, map]);
  return null;
}

function buildHourlyData() {
  const base = [120, 180, 340, 560, 820, 950, 1100, 980, 860, 720, 540, 420];
  return ['08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19'].map((h, i) => ({
    hour: `${h}:00`,
    footfall: base[i],
    capacity: 1000,
    diverted: Math.round(base[i] * 0.15),
  }));
}

const SEED_INCIDENTS = [
  { id: 'INC-901', time: '16:42:10', spot: 'Amber Fort', level: 'HIGH (92%)', action: 'Reroute Broadcast Dispatched -> Jaigarh Fort', status: 'ACTIVE' },
  { id: 'INC-902', time: '16:20:05', spot: 'Taj Mahal', level: 'MODERATE (68%)', action: 'Incentive Pass Activated -> Mehtab Bagh', status: 'RESOLVED' },
  { id: 'INC-903', time: '15:50:33', spot: 'Dashashwamedh Ghat', level: 'HIGH (88%)', action: 'Boat Corridor Diverted -> Assi Ghat', status: 'RESOLVED' },
  { id: 'INC-904', time: '15:15:22', spot: 'India Gate', level: 'HIGH (90%)', action: 'Shuttle Diverted -> Humayun Tomb', status: 'RESOLVED' },
];

function MapFlyController({ selectedSpot }) {
  const map = useMap();
  useEffect(() => {
    if (selectedSpot && map && typeof selectedSpot.lat === 'number' && typeof selectedSpot.lng === 'number') {
      try {
        map.flyTo([selectedSpot.lat, selectedSpot.lng], 15, {
          duration: 1.2,
          easeLinearity: 0.25
        });
      } catch (err) {
        console.warn("map.flyTo error prevented:", err);
      }
    }
  }, [selectedSpot, map]);
  return null;
}

export default function AuthorityDashboard() {
  const { monuments, activeAlert, isConnected, selectedCity, switchCity } = useSocket();

  const [incidents, setIncidents] = useState(SEED_INCIDENTS);
  const [selectedSpot, setSelectedSpot] = useState(null);
  const markerRefs = useRef({});
  const hourlyData = buildHourlyData();

  const handleSelectDestination = (spotName) => {
    const spot = CROWD_POINTS.find(
      p => p.name.toLowerCase() === spotName?.toLowerCase() || p.id === spotName
    );
    if (!spot) return;

    setSelectedSpot(spot);

    if (markerRefs.current[spot.id]) {
      markerRefs.current[spot.id].openPopup();
    }
  };

  useEffect(() => {
    if (activeAlert?.crowdedSpot) {
      const newInc = {
        id: `INC-${Math.floor(1000 + Math.random() * 9000)}`,
        time: new Date().toLocaleTimeString().split(' ')[0],
        spot: activeAlert.crowdedSpot.name,
        level: `HIGH (${activeAlert.crowdedSpot.loadPercent}%)`,
        action: `Auto Reroute Dispatched -> ${activeAlert.alternativeSpot?.name || 'Alternate'}`,
        status: 'ACTIVE'
      };
      setIncidents(prev => [newInc, ...prev.slice(0, 8)]);
    }
  }, [activeAlert]);

  const handleBroadcast = (e) => {
    e.preventDefault();
    if (!broadcastTitle || !broadcastMsg) return;
    setSending(true);

    sendBroadcast({
      title: broadcastTitle,
      message: broadcastMsg,
      targetCity,
      severity,
    });

    setTimeout(() => {
      setSending(false);
      setSentSuccess(true);
      setBroadcastTitle('');
      setBroadcastMsg('');
      setTimeout(() => setSentSuccess(false), 3000);
    }, 400);
  };

  const handleExportCSV = () => {
    const headers = ['Incident ID,Timestamp,Spot,Crowd Level,Action Taken,Status\n'];
    const rows = incidents.map(i => `${i.id},${i.time},"${i.spot}",${i.level},"${i.action}",${i.status}`).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Incident_Report_${selectedCity}_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const cityMonuments = monuments.filter(m =>
    m.city?.toLowerCase() === selectedCity?.toLowerCase()
  );

  const displayMonuments = cityMonuments.length > 0 ? cityMonuments : monuments;
  const mapCenter = CITY_CENTRES[selectedCity] || CITY_CENTRES['Jaipur'];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16">
      <div className="max-w-7xl mx-auto px-4 pt-4 space-y-6">

        {/* ── Operational KPI Cards ──────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-1 shadow-sm">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">Current Rush Level</div>
            <div className="text-2xl font-black text-slate-900">74.2%</div>
            <div className="text-[10px] text-emerald-800 font-bold">Optimal Operating Band</div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-1 shadow-sm">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">Dispatched Reroute Notices</div>
            <div className="text-2xl font-black text-slate-900 font-mono">1,482</div>
            <div className="text-[10px] text-slate-500 font-semibold">Today's Total Advisory Passes</div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-1 shadow-sm">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">Tourists Redirected</div>
            <div className="text-2xl font-black text-emerald-800 font-mono">3,840</div>
            <div className="text-[10px] text-slate-500 font-semibold">Visitors Diverted to Alternates</div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-1 shadow-sm">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">Alert Success Rate</div>
            <div className="text-2xl font-black text-slate-900">99.4%</div>
            <div className="text-[10px] text-emerald-800 font-bold">Automated Reroute &lt; 2 mins</div>
          </div>
        </div>

        {/* Monitored Zones CCTV Preview Grid */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 font-mono">
              <Eye size={15} className="text-emerald-700" /> Monitored Perimeter Edge AI Cameras
            </h3>
            <span className="text-xs font-mono font-bold text-slate-500">2 Active CCTV Feed References</span>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs p-3 space-y-2 flex gap-3 items-center">
              <div className="relative h-20 w-32 rounded-lg overflow-hidden bg-slate-900 shrink-0">
                <img
                  src="https://i.pinimg.com/736x/22/60/94/226094843784221825.jpg"
                  alt="Amber Fort North Gate"
                  className="w-full h-full object-cover"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src = "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=600&q=80";
                  }}
                />
                <span className="absolute top-1 left-1 bg-red-700 text-white text-[8px] font-bold px-1 rounded font-mono">LIVE</span>
              </div>
              <div className="min-w-0 space-y-1">
                <div className="font-bold text-xs text-slate-900 truncate">North Gate Main Perimeter</div>
                <div className="text-[11px] text-slate-500 font-mono">Amber Fort · 92% Rush Level</div>
                <span className="inline-block bg-red-50 text-red-800 border border-red-200 px-2 py-0.5 rounded text-[10px] font-bold">Reroute Active</span>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs p-3 space-y-2 flex gap-3 items-center">
              <div className="relative h-20 w-32 rounded-lg overflow-hidden bg-slate-900 shrink-0">
                <img
                  src="https://i.pinimg.com/736x/29/45/63/294563631905101960.jpg"
                  alt="Jaigarh Fort Central Courtyard"
                  className="w-full h-full object-cover"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src = "https://images.unsplash.com/photo-1609137144822-472a1e64177d?auto=format&fit=crop&w=600&q=80";
                  }}
                />
                <span className="absolute top-1 left-1 bg-emerald-700 text-white text-[8px] font-bold px-1 rounded font-mono">LIVE</span>
              </div>
              <div className="min-w-0 space-y-1">
                <div className="font-bold text-xs text-slate-900 truncate">Central Courtyard Cam</div>
                <div className="text-[11px] text-slate-500 font-mono">Jaigarh Fort · 35% Rush Level</div>
                <span className="inline-block bg-emerald-50 text-emerald-900 border border-emerald-200 px-2 py-0.5 rounded text-[10px] font-bold">Normal Load</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Interactive GIS Map Panel ──────────────── */}
        <div className="w-full space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between">
              <div className="font-bold text-xs text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <MapPin size={14} className="text-emerald-700" /> City Crowd Map — {selectedCity}
              </div>
              <div className="flex gap-2 text-[10px] font-bold">
                <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded">Green: &lt;50% Normal</span>
                <span className="bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded">Yellow: 50-79% Moderate</span>
                <span className="bg-red-50 text-red-800 border border-red-200 px-2 py-0.5 rounded">Red: &ge;80% High</span>
              </div>
            </div>

            <div className="h-[420px] relative">
              <MapContainer center={mapCenter} zoom={12} style={{ height: '100%', width: '100%' }}>
                <MapRecenterer center={mapCenter} zoom={12} />
                <MapFlyController selectedSpot={selectedSpot} />
                <MapBoundsFitter points={CROWD_POINTS} />
                <TileLayer
                  url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                  attribution='&copy; <a href="https://carto.com/">CARTO</a>'
                />
                {CROWD_POINTS.map((point) => (
                  <Marker
                    key={point.id}
                    ref={(el) => { if (el) markerRefs.current[point.id] = el; }}
                    position={[point.lat, point.lng]}
                    icon={createCrowdIcon(point)}
                  >
                    <Popup>
                      <div className="p-2 min-w-[200px] font-sans">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <h4 className="font-bold text-sm text-slate-900">{point.name}</h4>
                          <span
                            style={{ backgroundColor: getMarkerColor(point.percentage) }}
                            className="text-white text-xs px-2 py-0.5 rounded-full font-bold shadow-xs"
                          >
                            {point.percentage}%
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mb-1"><strong>Rush Level:</strong> {point.rushLevel}</p>
                        <p className="text-xs text-slate-600 mb-1"><strong>Action:</strong> {point.action}</p>
                        <span className={`text-[10px] font-mono uppercase px-1.5 py-0.5 rounded font-bold ${point.status === 'ACTIVE' ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-800'}`}>
                          {point.status}
                        </span>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          </div>
        </div>

        {/* ── Incident Log Table ────────────────────────────────────── */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm space-y-0">
          <div className="px-5 py-3 border-b border-slate-200 flex items-center justify-between bg-slate-50">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 font-mono">
              <FileText size={15} className="text-emerald-700" /> Recent Crowd Alert Log
            </h3>
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono font-bold text-slate-500">{incidents.length} Recorded Entries</span>
              <button
                onClick={handleExportCSV}
                className="bg-emerald-700 hover:bg-emerald-800 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg shadow-xs transition-all flex items-center gap-1.5"
              >
                <Download size={13} /> Export CSV
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 border-b border-slate-200 text-slate-600 font-mono font-bold text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Incident ID</th>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Place Spot</th>
                  <th className="py-3 px-4">Rush Level</th>
                  <th className="py-3 px-4">Action Dispatched</th>
                  <th className="py-3 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {incidents.map((inc) => (
                  <tr key={inc.id} className="hover:bg-slate-50/80 transition-colors even:bg-slate-50/40">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">
                      <button
                        type="button"
                        onClick={() => handleSelectDestination(inc.spot)}
                        className="font-mono font-bold text-slate-900 hover:text-emerald-700 hover:underline cursor-pointer transition text-left focus:outline-none"
                      >
                        {inc.id}
                      </button>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-600">{inc.time}</td>
                    <td className="py-3 px-4 font-bold text-slate-900">
                      <button
                        type="button"
                        onClick={() => handleSelectDestination(inc.spot)}
                        className="font-bold text-slate-800 hover:text-emerald-700 hover:underline cursor-pointer transition text-left flex items-center gap-1.5 focus:outline-none"
                      >
                        <MapPin size={12} className="text-emerald-700 shrink-0" />
                        {inc.spot}
                      </button>
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-800">{inc.level}</td>
                    <td className="py-3 px-4 text-slate-700">{inc.action}</td>
                    <td className="py-3 px-4 text-right font-mono font-bold">
                      <span className={`px-2 py-0.5 rounded text-[10px] ${
                        inc.status === 'ACTIVE'
                          ? 'bg-red-50 text-red-800 border border-red-200'
                          : 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                      }`}>
                        {inc.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
