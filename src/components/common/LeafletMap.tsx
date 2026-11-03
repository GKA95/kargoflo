import React, { useEffect, useRef } from 'react';
import L from 'leaflet';

interface Coordinates {
  lat: number;
  lng: number;
}

interface LeafletMapProps {
  pickupCoords?: Coordinates;
  destinationCoords?: Coordinates;
  riderCoords?: Coordinates;
  center?: Coordinates;
  zoom?: number;
  height?: string;
  className?: string;
  pickupLabel?: string;
  destinationLabel?: string;
}

export const LeafletMap: React.FC<LeafletMapProps> = ({
  pickupCoords,
  destinationCoords,
  riderCoords,
  center = { lat: 5.6037, lng: -0.187 }, // Greater Accra, Ghana
  zoom = 13,
  height = '360px',
  className = '',
  pickupLabel = 'Pickup Location',
  destinationLabel = 'Delivery Destination',
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [center.lat, center.lng],
        zoom,
        zoomControl: true,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map);

      markersLayerRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;
    const markersLayer = markersLayerRef.current;

    if (markersLayer) {
      markersLayer.clearLayers();

      const bounds: L.LatLngExpression[] = [];

      // Pickup Marker
      if (pickupCoords) {
        const pickupIcon = L.divIcon({
          className: 'custom-map-marker',
          html: `<div style="background-color: #0d9488; color: white; border-radius: 50%; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: bold; border: 2px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);">P</div>`,
          iconSize: [28, 28],
          iconAnchor: [14, 14],
        });
        const marker = L.marker([pickupCoords.lat, pickupCoords.lng], { icon: pickupIcon })
          .bindPopup(`<b>${pickupLabel}</b>`)
          .addTo(markersLayer);
        bounds.push([pickupCoords.lat, pickupCoords.lng]);
      }

      // Destination Marker
      if (destinationCoords) {
        const destIcon = L.divIcon({
          className: 'custom-map-marker',
          html: `<div style="background-color: #0f172a; color: white; border-radius: 50%; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: bold; border: 2px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);">D</div>`,
          iconSize: [28, 28],
          iconAnchor: [14, 14],
        });
        const marker = L.marker([destinationCoords.lat, destinationCoords.lng], { icon: destIcon })
          .bindPopup(`<b>${destinationLabel}</b>`)
          .addTo(markersLayer);
        bounds.push([destinationCoords.lat, destinationCoords.lng]);
      }

      // Rider Live Position Marker
      if (riderCoords) {
        const riderIcon = L.divIcon({
          className: 'custom-map-marker',
          html: `<div style="background-color: #f59e0b; color: white; border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; font-size: 14px; border: 2px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.4);">🏍️</div>`,
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        });
        L.marker([riderCoords.lat, riderCoords.lng], { icon: riderIcon })
          .bindPopup('<b>Assigned Dispatch Courier</b>')
          .addTo(markersLayer);
        bounds.push([riderCoords.lat, riderCoords.lng]);
      }

      // Route Polyline
      if (pickupCoords && destinationCoords) {
        L.polyline(
          [
            [pickupCoords.lat, pickupCoords.lng],
            [destinationCoords.lat, destinationCoords.lng],
          ],
          {
            color: '#0d9488',
            weight: 4,
            opacity: 0.7,
            dashArray: '6, 8',
          }
        ).addTo(markersLayer);
      }

      if (bounds.length > 1) {
        map.fitBounds(L.latLngBounds(bounds), { padding: [40, 40] });
      } else if (bounds.length === 1) {
        map.setView(bounds[0] as L.LatLngExpression, zoom);
      }
    }

    return () => {
      // Keep map instance or cleanup if needed
    };
  }, [pickupCoords, destinationCoords, riderCoords, center, zoom, pickupLabel, destinationLabel]);

  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div className={`relative overflow-hidden rounded-xl border border-slate-200 ${className}`}>
      <div ref={mapContainerRef} style={{ height, width: '100%', minHeight: '240px' }} />
      <div className="absolute bottom-2 left-2 z-[400] bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded text-[11px] text-slate-600 border border-slate-200">
        Ghana Dispatch Zone: Accra Metro & Environs
      </div>
    </div>
  );
};
