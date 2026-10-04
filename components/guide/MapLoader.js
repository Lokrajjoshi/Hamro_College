"use client";
import dynamic from "next/dynamic";

// Leaflet touches `window`, so it must only render in the browser.
const MapView = dynamic(() => import("./MapView"), {
  ssr: false,
  loading: () => <div className="h-[420px] animate-pulse rounded-2xl bg-slate-200" />,
});

export default function MapLoader(props) {
  return <MapView {...props} />;
}
