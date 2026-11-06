import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Navigation, Award, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

// Fix for default Leaflet marker icon paths in Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom colored pin creator
function createCustomPin(color = '#15803d', score = 85) {
  return L.divIcon({
    className: 'custom-mandi-pin',
    html: `
      <div style="background-color: ${color}; color: white; border-radius: 9999px; width: 34px; height: 34px; display: flex; flex-direction: column; align-items: center; justify-content: center; font-weight: bold; font-size: 11px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3); border: 2px solid white;">
        ${score}
      </div>
    `,
    iconSize: [34, 34],
    iconAnchor: [17, 17],
    popupAnchor: [0, -18]
  });
}

// Controller to auto-center map when selected centre changes
function ChangeView({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, zoom);
    }
  }, [center, zoom, map]);
  return null;
}

export default function CentresMap({ centres = [], selectedCentre, onSelectCentre }) {
  // Center of Malwa / Bhopal Region, Madhya Pradesh
  const defaultCenter = [23.05, 76.25];
  const [activeCenter, setActiveCenter] = useState(defaultCenter);

  useEffect(() => {
    if (selectedCentre && selectedCentre.latitude && selectedCentre.longitude) {
      setActiveCenter([Number(selectedCentre.latitude), Number(selectedCentre.longitude)]);
    }
  }, [selectedCentre]);

  return (
    <div className="w-full h-[450px] rounded-2xl overflow-hidden border border-slate-300 shadow-md relative">
      <MapContainer
        center={defaultCenter}
        zoom={8}
        scrollWheelZoom={false}
        className="w-full h-full"
      >
        <ChangeView center={activeCenter} zoom={selectedCentre ? 11 : 8} />

        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {centres.map((centre) => {
          const lat = Number(centre.latitude);
          const lon = Number(centre.longitude);
          if (isNaN(lat) || isNaN(lon)) return null;

          const isSelected = selectedCentre?.id === centre.id;
          const pinColor = isSelected
            ? '#2563eb'
            : centre.smartScore >= 80
            ? '#059669'
            : centre.smartScore >= 60
            ? '#d97706'
            : '#e11d48';

          const pinIcon = createCustomPin(pinColor, centre.smartScore || 75);

          return (
            <Marker
              key={centre.id}
              position={[lat, lon]}
              icon={pinIcon}
              eventHandlers={{
                click: () => onSelectCentre && onSelectCentre(centre)
              }}
            >
              <Popup className="custom-popup">
                <div className="p-1 max-w-[260px] text-xs space-y-2">
                  <div className="border-b pb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                      {centre.district} • DEMO CENTRE
                    </span>
                    <h4 className="font-bold text-sm text-slate-900 leading-tight">
                      {centre.name}
                    </h4>
                    <p className="text-[11px] text-slate-500">{centre.address}</p>
                  </div>

                  {/* AI Score Badge */}
                  <div className="flex items-center justify-between bg-emerald-50 p-1.5 rounded-lg border border-emerald-200">
                    <div className="flex items-center gap-1.5 font-bold text-emerald-900">
                      <Award className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Smart AI Score:</span>
                    </div>
                    <span className="font-extrabold text-sm text-emerald-800">
                      {centre.smartScore}/100
                    </span>
                  </div>

                  {/* Metrics */}
                  <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                    <div className="bg-slate-50 p-1.5 rounded border border-slate-200">
                      <span className="text-slate-500 block">Available Quota:</span>
                      <strong className="text-slate-900">{centre.available_quota} Qtl</strong>
                    </div>
                    <div className="bg-slate-50 p-1.5 rounded border border-slate-200">
                      <span className="text-slate-500 block">Current Queue:</span>
                      <strong className="text-slate-900">{centre.current_queue} Vehicles</strong>
                    </div>
                  </div>

                  {onSelectCentre && (
                    <button
                      onClick={() => onSelectCentre(centre)}
                      className="w-full mt-1 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold py-1 px-2 rounded-md text-xs transition-colors shadow-sm"
                    >
                      {isSelected ? '✓ Selected' : 'Choose This Centre'}
                    </button>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Floating Legend */}
      <div className="absolute bottom-3 right-3 z-[400] bg-white/95 backdrop-blur-md px-3 py-2 rounded-xl border border-slate-300 shadow-md text-[11px] space-y-1">
        <span className="font-bold text-slate-800 block text-[10px] uppercase">AI Smart Score</span>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-emerald-600 inline-block"></span>
          <span>80+ Highly Recommended</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-amber-600 inline-block"></span>
          <span>60-79 Moderate</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-rose-600 inline-block"></span>
          <span>&lt;60 Congested / Weather Risk</span>
        </div>
      </div>
    </div>
  );
}
