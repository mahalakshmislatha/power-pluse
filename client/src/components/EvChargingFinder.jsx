import React, { useState } from 'react';
import { BatteryCharging, MapPin, Zap, ExternalLink, Filter, CheckCircle2 } from 'lucide-react';

const EV_STATIONS_DATA = [
  {
    id: 'ev-1',
    name: 'TANGEDCO Fast EV Charging Station',
    district: 'Chennai',
    location: 'Guindy Industrial Estate, Chennai',
    operator: 'TANGEDCO',
    types: ['CCS2 Fast DC (60kW)', 'Type-2 AC (22kW)'],
    tariff: '₹18 / kWh',
    status: 'Available',
    connectors: 4,
    available: 3
  },
  {
    id: 'ev-2',
    name: 'Tata Power EZ Charge - Anna Nagar',
    district: 'Chennai',
    location: 'VR Mall, Anna Nagar, Chennai',
    operator: 'Tata Power',
    types: ['CCS2 Fast DC (50kW)'],
    tariff: '₹21 / kWh',
    status: 'Available',
    connectors: 2,
    available: 1
  },
  {
    id: 'ev-3',
    name: 'Zeon Fast DC Charging Hub',
    district: 'Coimbatore',
    location: 'Avinashi Road, Peelamedu, Coimbatore',
    operator: 'Zeon Charge',
    types: ['CCS2 Fast DC (120kW Dual Gun)'],
    tariff: '₹22 / kWh',
    status: 'Available',
    connectors: 4,
    available: 2
  },
  {
    id: 'ev-4',
    name: 'TANGEDCO EV Station - KK Nagar',
    district: 'Madurai',
    location: 'Mattuthavani Bus Stand Area, Madurai',
    operator: 'TANGEDCO',
    types: ['CCS2 Fast DC (30kW)', 'Type-2 AC'],
    tariff: '₹18 / kWh',
    status: 'Available',
    connectors: 2,
    available: 2
  },
  {
    id: 'ev-5',
    name: 'Relux Electric Fast Charging',
    district: 'Tiruchirappalli',
    location: 'Central Bus Stand, Trichy',
    operator: 'Relux Electric',
    types: ['CCS2 Fast DC (60kW)'],
    tariff: '₹20 / kWh',
    status: 'Busy',
    connectors: 2,
    available: 0
  },
  {
    id: 'ev-6',
    name: 'Ather Grid Fast Charger - Salem Junction',
    district: 'Salem',
    location: 'Five Roads Junction, Salem',
    operator: 'Ather Energy',
    types: ['Ather Grid Fast DC', '15A Socket'],
    tariff: '₹15 / kWh',
    status: 'Available',
    connectors: 3,
    available: 3
  }
];

export default function EvChargingFinder({ isDarkMode }) {
  const [selectedDistrict, setSelectedDistrict] = useState('All');

  const districts = ['All', 'Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem'];

  const filteredStations = selectedDistrict === 'All'
    ? EV_STATIONS_DATA
    : EV_STATIONS_DATA.filter(s => s.district.toLowerCase() === selectedDistrict.toLowerCase());

  return (
    <div className={`p-5 sm:p-6 rounded-2xl border transition-all space-y-5 ${
      isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
    }`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <BatteryCharging className="w-6 h-6 text-emerald-500" />
          <div>
            <h3 className="text-lg font-bold">
              Tamil Nadu EV Fast Charging Station Locator
            </h3>
            <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Locate TANGEDCO & private EV fast chargers (CCS2, Type-2) across TN highways and cities
            </p>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-1.5 items-center">
          <span className="text-xs font-semibold mr-1">District:</span>
          {districts.map(d => (
            <button
              key={d}
              onClick={() => setSelectedDistrict(d)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                selectedDistrict === d
                  ? 'bg-emerald-500 text-slate-950 shadow-sm'
                  : isDarkMode ? 'bg-slate-950 border border-slate-800 text-slate-400' : 'bg-slate-100 border border-slate-300 text-slate-700'
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Stations List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
        {filteredStations.map((station) => (
          <div
            key={station.id}
            className={`border rounded-xl p-4 transition-all flex flex-col justify-between ${
              isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/30">
                    {station.operator}
                  </span>
                  <h4 className="font-bold text-sm mt-1.5">{station.name}</h4>
                  <p className={`text-xs flex items-center gap-1 mt-0.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    <MapPin className="w-3 h-3 text-rose-500 shrink-0" />
                    {station.location}
                  </p>
                </div>

                <span className={`text-[10px] font-bold px-2 py-1 rounded-lg border ${
                  station.available > 0 
                    ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30' 
                    : 'bg-rose-500/10 text-rose-500 border-rose-500/30'
                }`}>
                  {station.available > 0 ? `${station.available}/${station.connectors} Free` : 'Occupied'}
                </span>
              </div>

              {/* Plug Types */}
              <div className="mt-3 flex flex-wrap gap-1.5">
                {station.types.map((type, idx) => (
                  <span
                    key={idx}
                    className={`text-[10px] px-2 py-0.5 rounded border font-medium ${
                      isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-300' : 'bg-white border-slate-300 text-slate-800'
                    }`}
                  >
                    ⚡ {type}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <span className="font-bold text-amber-500 text-xs">Tariff: {station.tariff}</span>
              
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(station.location)}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                Directions <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
