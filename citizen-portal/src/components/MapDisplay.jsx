import React from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

export default function MapDisplay({ lat, lng }) {
  if (!lat || !lng) return null;
  return (
    <div style={{ margin: '10px 0' }}>
      <div style={{ height: 180, width: '100%' }}>
        <MapContainer center={[lat, lng]} zoom={16} style={{ height: '100%', width: '100%' }} scrollWheelZoom={true}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Marker position={[lat, lng]} />
        </MapContainer>
      </div>
      <a
        href={`https://www.google.com/maps?q=${lat},${lng}`}
        target="_blank"
        rel="noopener noreferrer"
        style={{ display: 'inline-block', marginTop: 8 }}
      >
        Open in Google Maps
      </a>
    </div>
  );
}