'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { FaMapMarkerAlt, FaDirections } from 'react-icons/fa';

// Dealership location coordinates (Pembroke, NC)
// Exact coordinates from Google Maps
const position = [34.69174148309925, -79.21049419330456]; // Updated coordinates from Google Maps
const dealershipName = "Scuffletown 2.0 Motorsports";
const dealershipAddress = "220 Nova Rd, Pembroke, NC 28372";

// Define the custom marker icon outside the component
const createCustomMarkerIcon = () => {
  return new L.Icon({
    iconUrl: '/images/marker-icon.png',
    iconRetinaUrl: '/images/marker-icon-2x.png',
    shadowUrl: '/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
};

const MapComponent = () => {
  // Fix the default icon issue in Leaflet with Next.js
  useEffect(() => {
    delete L.Icon.Default.prototype._getIconUrl;
    
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    });
  }, []);

  // Custom marker icon - create it inside the component, after useEffect fixes the icon issues
  const customMarkerIcon = createCustomMarkerIcon();

  const getDirectionsUrl = () => {
    return `https://www.openstreetmap.org/directions?engine=graphhopper_car&route=;${position[0]}%2C${position[1]}`;
  };

  return (
    <>
      {/* Add Leaflet CSS to head using a style tag */}
      <style jsx global>{`
        .leaflet-container {
          height: 100%;
          width: 100%;
        }
        .custom-popup .leaflet-popup-content-wrapper {
          background: rgba(255, 255, 255, 0.9);
          color: #333;
          border-radius: 8px;
          padding: 5px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .custom-popup .leaflet-popup-tip {
          background: rgba(255, 255, 255, 0.9);
        }
        .dark-mode .custom-popup .leaflet-popup-content-wrapper {
          background: rgba(31, 41, 55, 0.9);
          color: #e5e7eb;
        }
        .dark-mode .custom-popup .leaflet-popup-tip {
          background: rgba(31, 41, 55, 0.9);
        }
      `}</style>

      <MapContainer 
        center={position} 
        zoom={15} 
        scrollWheelZoom={false}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position}>
          <Popup className="custom-popup">
            <div className="text-center">
              <h3 className="font-bold text-base mb-1">{dealershipName}</h3>
              <p className="text-sm mb-2">{dealershipAddress}</p>
              <a 
                href={getDirectionsUrl()} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-3 py-1 bg-primary text-white text-xs rounded-md hover:bg-primary-dark transition-colors duration-200"
              >
                <FaDirections className="mr-1" /> Get Directions
              </a>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </>
  );
};

export default MapComponent; 