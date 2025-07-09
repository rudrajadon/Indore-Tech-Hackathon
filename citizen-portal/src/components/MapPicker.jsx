import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import RoomIcon from "@mui/icons-material/Room";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect } from "react";

// Fix default marker icon import bug in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function LocationMarker({ onPick }) {
  const [position, setPosition] = useState(null);

  useMapEvents({
    click(e) {
      setPosition(e.latlng);
      onPick(e.latlng, `Lat: ${e.latlng.lat.toFixed(5)}, Lng: ${e.latlng.lng.toFixed(5)}`);
    },
  });

  return position === null ? null : (
    <Marker position={position}></Marker>
  );
}

function FixMapSize() {
  const map = useMap();
  useEffect(() => {
    setTimeout(() => {
      map.invalidateSize();
    }, 100);
  }, [map]);
  return null;
}

export default function MapPicker({ onPick }) {
  return (
    <Paper
      elevation={2}
      sx={{
        mt: 1,
        mb: 1,
        p: 1,
        borderRadius: 2,
        bgcolor: "background.paper",
      }}
    >
      <Typography variant="subtitle2" color="primary" sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
        <RoomIcon fontSize="small" sx={{ mr: 1 }} /> Pick Location on Map
      </Typography>
      <MapContainer
        center={[22.7196, 75.8577]}
        zoom={12}
        style={{ height: 220, borderRadius: 8, marginTop: 4, width: "100%" }}
        scrollWheelZoom={true}
      >
        <FixMapSize />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker onPick={onPick} />
      </MapContainer>
    </Paper>
  );
}