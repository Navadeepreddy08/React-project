import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useComplaints } from '../context/ComplaintContext';
import { COMPLAINT_CATEGORIES, STATUS_TYPES } from '../utils/dummyData';

// Fix for default marker icon in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom colored icons based on urgency
const createCustomIcon = (color) => {
  return L.divIcon({
    className: 'custom-icon',
    html: `
      <div style="
        background-color: ${color};
        width: 24px;
        height: 24px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 2px solid white;
        box-shadow: 0 2px 5px rgba(0,0,0,0.3);
      "></div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 24],
    popupAnchor: [0, -24]
  });
};

const urgencyColors = {
  low: '#10b981',    // green
  medium: '#eab308', // yellow
  high: '#ef4444'    // red
};

const resolvedColor = '#3b82f6'; // blue for resolved to distinguish

const MapUpdater = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 14);
  }, [center, map]);
  return null;
};

const MapViewPage = () => {
  const { complaints } = useComplaints();
  
  // Default to a central village location (dummy)
  const defaultCenter = { lat: 28.6139, lng: 77.2090 };
  
  // Find valid coordinates
  const validComplaints = complaints.filter(c => c.location && c.location.lat && c.location.lng);
  
  const mapCenter = validComplaints.length > 0 ? validComplaints[0].location : defaultCenter;

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col relative z-0">
      <div className="p-4 bg-white shadow-sm z-10 relative">
        <h2 className="font-bold text-slate-800">Issue Map</h2>
        <div className="flex gap-4 mt-2 text-xs">
          <div className="flex items-center gap-1"><div className="w-3 h-3 bg-red-500 rounded-full" /> High Priority</div>
          <div className="flex items-center gap-1"><div className="w-3 h-3 bg-yellow-500 rounded-full" /> Medium</div>
          <div className="flex items-center gap-1"><div className="w-3 h-3 bg-blue-500 rounded-full" /> Resolved</div>
        </div>
      </div>
      
      <div className="flex-1 w-full relative z-0">
        <MapContainer center={[mapCenter.lat, mapCenter.lng]} zoom={14} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapUpdater center={[mapCenter.lat, mapCenter.lng]} />
          
          {validComplaints.map(complaint => {
            const catInfo = COMPLAINT_CATEGORIES.find(c => c.id === complaint.category) || COMPLAINT_CATEGORIES[4];
            const statusInfo = STATUS_TYPES[complaint.status] || STATUS_TYPES.pending;
            
            const color = complaint.status === 'resolved' 
              ? resolvedColor 
              : urgencyColors[complaint.urgency] || urgencyColors.medium;
              
            return (
              <Marker 
                key={complaint.id} 
                position={[complaint.location.lat, complaint.location.lng]}
                icon={createCustomIcon(color)}
              >
                <Popup>
                  <div className="p-1 min-w-[150px]">
                    <div className="flex items-center gap-2 border-b border-slate-100 pb-2 mb-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase ${statusInfo.color}`}>
                        {statusInfo.label}
                      </span>
                    </div>
                    <p className="font-bold text-slate-800 text-sm mb-1">{catInfo.label}</p>
                    {complaint.description && (
                      <p className="text-slate-600 text-xs line-clamp-2 mb-2">{complaint.description}</p>
                    )}
                    {complaint.imageBefore && (
                      <img src={complaint.imageBefore} alt="Issue preview" className="w-full h-20 object-cover rounded mt-2" />
                    )}
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
};

export default MapViewPage;
