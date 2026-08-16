import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { LocateFixed } from 'lucide-react';
import { TRANSLATIONS } from '../data/translations.js';

export default function LiveMap({ reports, onConfirmReport, isDarkMode, lang }) {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const tileLayerRef = useRef(null);
  const markersRef = useRef({});

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapRef.current) {
      // Initialize map centered over Tamil Nadu
      const map = L.map(mapContainerRef.current, {
        zoomControl: false,
        attributionControl: false,
        fadeAnimation: true,
        markerZoomAnimation: true
      }).setView([10.8280, 78.6867], 7);

      L.control.zoom({ position: 'topright' }).addTo(map);

      mapRef.current = map;
    }

    const map = mapRef.current;

    // Trigger multiple invalidateSize cycles to ensure tiles fill 100% container width with 0 grid boxes
    const timer1 = setTimeout(() => { if (map) map.invalidateSize(); }, 50);
    const timer2 = setTimeout(() => { if (map) map.invalidateSize(); }, 200);

    // Remove existing tile layer if any
    if (tileLayerRef.current) {
      tileLayerRef.current.remove();
    }

    // High reliability tile server URLs with zero subdomains issues
    const tileUrl = isDarkMode
      ? 'https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png'
      : 'https://a.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png';

    const fallbackTileUrl = isDarkMode
      ? 'https://b.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png'
      : 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';

    const tileLayer = L.tileLayer(tileUrl, {
      maxZoom: 19,
      minZoom: 4,
      crossOrigin: true,
      errorTileUrl: fallbackTileUrl
    });

    tileLayer.addTo(map);
    tileLayerRef.current = tileLayer;

    // Clear previous markers
    Object.values(markersRef.current).forEach(marker => marker.remove());
    markersRef.current = {};

    // Render reports as custom color-coded pins
    reports.forEach(report => {
      let pinColor = '#EF4444'; // Red for cut
      let label = lang === 'ta' ? 'மின் தடை' : 'Power Cut';
      
      if (report.type === 'restored' || report.status === 'resolved') {
        pinColor = '#10B981'; // Green
        label = lang === 'ta' ? 'மின்சாரம் வந்தது' : 'Power Restored';
      } else if (report.confirmations < 3) {
        pinColor = '#F59E0B'; // Yellow for unverified
        label = lang === 'ta' ? 'உறுதி செய்யப்படாத மின் தடை' : 'Unverified Cut';
      }

      const customIcon = L.divIcon({
        className: 'custom-div-icon',
        html: `
          <div style="
            background-color: ${pinColor};
            width: 28px;
            height: 28px;
            border-radius: 50%;
            border: 2px solid #ffffff;
            box-shadow: 0 3px 10px ${pinColor}aa;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 12px;
            font-weight: bold;
          ">
            ⚡
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14]
      });

      const timeAgo = formatTimeAgo(report.timestamp, lang);

      const popupContent = document.createElement('div');
      popupContent.className = 'p-2 font-sans min-w-[200px] text-slate-900';
      popupContent.innerHTML = `
        <div style="font-weight: 700; font-size: 14px; margin-bottom: 4px; color: #0f172a;">
          ${report.area}
        </div>
        <div style="font-size: 11px; font-weight: 600; color: #64748b; margin-bottom: 6px;">
          ${report.district} District
        </div>
        <div style="display: inline-block; padding: 3px 9px; border-radius: 12px; font-size: 11px; font-weight: 700; background: ${pinColor}22; color: ${pinColor}; border: 1px solid ${pinColor}44; margin-bottom: 8px;">
          ${label}
        </div>
        <div style="font-size: 11px; color: #475569; margin-bottom: 8px;">
          ${lang === 'ta' ? 'பதிவான நேரம்' : 'Reported'}: <strong>${timeAgo}</strong><br/>
          ${lang === 'ta' ? 'உறுதிப்படுத்தல்கள்' : 'Confirmations'}: <strong>${report.confirmations}</strong>
        </div>
      `;

      if (report.type === 'cut' && report.status !== 'resolved') {
        const btn = document.createElement('button');
        btn.innerText = lang === 'ta' ? '👍 எனக்கும் கரண்ட் இல்லை' : '👍 Confirm Power Cut Here';
        btn.style.cssText = 'width: 100%; background: #f59e0b; color: #0f172a; border: none; padding: 7px 10px; border-radius: 8px; font-size: 11px; cursor: pointer; font-weight: 700;';
        btn.onclick = () => {
          onConfirmReport(report.id);
          map.closePopup();
        };
        popupContent.appendChild(btn);
      }

      const marker = L.marker([report.lat, report.lng], { icon: customIcon })
        .addTo(map)
        .bindPopup(popupContent);

      markersRef.current[report.id] = marker;
    });

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [reports, onConfirmReport, isDarkMode, lang]);

  const handleRecenter = () => {
    if (mapRef.current) {
      mapRef.current.setView([10.8280, 78.6867], 7);
      mapRef.current.invalidateSize();
    }
  };

  return (
    <div className={`relative w-full h-full min-h-[400px] flex-1 overflow-hidden ${isDarkMode ? 'bg-slate-950' : 'bg-slate-100'}`}>
      <div ref={mapContainerRef} className="w-full h-full" />
      
      {/* Map Legend */}
      <div className={`absolute top-4 left-4 z-[400] backdrop-blur border p-3 rounded-2xl shadow-lg text-xs space-y-1.5 transition-colors ${
        isDarkMode 
          ? 'bg-slate-950/90 border-slate-800 text-slate-100' 
          : 'bg-white/95 border-slate-200 text-slate-900 shadow-md'
      }`}>
        <div className="font-bold mb-1 flex items-center justify-between gap-3">
          <span>{t.tabMap}</span>
          <span className="text-[10px] bg-amber-500/20 text-amber-600 dark:text-amber-400 px-1.5 py-0.5 rounded font-mono font-bold">
            TN 38
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-3 h-3 rounded-full bg-rose-500 border border-white inline-block"></span>
          <span className={isDarkMode ? 'text-slate-300' : 'text-slate-700'}>
            {lang === 'ta' ? 'உறுதி செய்யப்பட்ட மின் தடை' : 'Verified Cut (3+ reports)'}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-3 h-3 rounded-full bg-amber-500 border border-white inline-block"></span>
          <span className={isDarkMode ? 'text-slate-300' : 'text-slate-700'}>
            {lang === 'ta' ? 'உறுதி செய்யப்படாத மின் தடை' : 'Unverified Cut'}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-3 h-3 rounded-full bg-emerald-500 border border-white inline-block"></span>
          <span className={isDarkMode ? 'text-slate-300' : 'text-slate-700'}>
            {lang === 'ta' ? 'மின்சாரம் வந்தது' : 'Power Restored'}
          </span>
        </div>
      </div>

      {/* Recenter Control Button */}
      <button
        onClick={handleRecenter}
        title="Recenter Map to Tamil Nadu"
        className={`absolute bottom-4 right-4 z-[400] p-3 rounded-2xl border shadow-xl transition-all flex items-center gap-1.5 font-bold text-xs ${
          isDarkMode
            ? 'bg-slate-900/90 border-slate-800 text-amber-400 hover:bg-slate-800'
            : 'bg-white/95 border-slate-300 text-slate-800 hover:bg-slate-100 shadow-md'
        }`}
      >
        <LocateFixed className="w-4 h-4 text-amber-500" />
        <span className="hidden sm:inline">{lang === 'ta' ? 'தமிழ்நாடு வரைபடம்' : 'Recenter TN'}</span>
      </button>
    </div>
  );
}

function formatTimeAgo(isoString, lang) {
  if (!isoString) return lang === 'ta' ? 'சமீபத்தில்' : 'recently';
  const diffMinutes = Math.floor((new Date() - new Date(isoString)) / 60000);
  if (diffMinutes < 1) return lang === 'ta' ? 'இப்பொழுது' : 'just now';
  if (diffMinutes < 60) return `${diffMinutes} ${lang === 'ta' ? 'நிமிடம் முன்' : 'mins ago'}`;
  const hours = Math.floor(diffMinutes / 60);
  return `${hours} ${lang === 'ta' ? 'மணி நேரம் முன்' : 'hrs ago'}`;
}
