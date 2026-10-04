"use client";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";

const COLORS = { college: "#003893", mission: "#c8102e" };

// Uses CircleMarkers to avoid Leaflet's default icon image issues with bundlers.
export default function MapView({ points, center = [20, 80], zoom = 3, height = 420 }) {
  return (
    <div style={{ height }} className="overflow-hidden rounded-2xl border border-slate-200">
      <MapContainer center={center} zoom={zoom} scrollWheelZoom={false} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {points.map((p) => (
          <CircleMarker key={`${p.type}-${p.name}`} center={[p.lat, p.lng]} radius={8} pathOptions={{ color: "white", weight: 2, fillColor: COLORS[p.type] || "#334155", fillOpacity: 0.95 }}>
            <Popup>
              <strong>{p.name}</strong>
              <br />
              {p.subtitle || p.city}
              {p.href && (
                <>
                  <br />
                  <a href={p.href}>View college →</a>
                </>
              )}
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}
