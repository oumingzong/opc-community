"use client";

import { useEffect, useRef } from "react";

import type * as Leaflet from "leaflet";

type CarrierMapPoint = {
  id: string;
  name: string;
  district: string;
  address: string;
  longitude: number;
  latitude: number;
};

type OpcLeafletMapProps = {
  carriers: CarrierMapPoint[];
};

const GUANGZHOU_CENTER: [number, number] = [23.1291, 113.3245];

function getInitialCenter(carriers: CarrierMapPoint[]): [number, number] {
  if (carriers.length === 0) {
    return GUANGZHOU_CENTER;
  }

  const total = carriers.reduce(
    (accumulator, carrier) => {
      accumulator.latitude += carrier.latitude;
      accumulator.longitude += carrier.longitude;
      return accumulator;
    },
    { latitude: 0, longitude: 0 }
  );

  return [total.latitude / carriers.length, total.longitude / carriers.length];
}

export default function OpcLeafletMap({ carriers }: OpcLeafletMapProps) {
  const mapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!mapRef.current) {
      return;
    }

    let disposed = false;
    let cleanup: (() => void) | undefined;

    void (async () => {
      const L = (await import("leaflet")) as typeof Leaflet;

      if (!mapRef.current || disposed) {
        return;
      }

      const map = L.map(mapRef.current, {
        zoomControl: false,
        attributionControl: false,
      }).setView(getInitialCenter(carriers), carriers.length > 0 ? 12 : 11);

      L.tileLayer("https://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}", {
        attribution: '地图数据 &copy; 高德地图',
        subdomains: "1234",
        maxZoom: 19,
        minZoom: 10,
      }).addTo(map);

      const markerGroup = L.layerGroup().addTo(map);
      const markerBounds: Leaflet.LatLngTuple[] = [];

      carriers.forEach((carrier) => {
        const latLng: Leaflet.LatLngTuple = [carrier.latitude, carrier.longitude];
        markerBounds.push(latLng);

        L.circleMarker(latLng, {
          radius: 8,
          color: "#ffffff",
          weight: 2,
          fillColor: "#f43f5e",
          fillOpacity: 0.95,
        })
          .bindTooltip(carrier.name, {
            permanent: true,
            direction: "top",
            offset: [0, -10],
            className: "opc-map-label",
          })
          .bindPopup(
            `
              <div style="min-width: 190px; color: #0f172a; font-family: 'Microsoft YaHei', 'PingFang SC', 'Noto Sans SC', sans-serif;">
                <div style="font-weight: 700; margin-bottom: 4px;">${escapeHtml(carrier.name)}</div>
                <div style="font-size: 12px; color: #475569; margin-bottom: 6px;">${escapeHtml(carrier.district)}</div>
                <div style="font-size: 12px; line-height: 1.5; color: #334155;">${escapeHtml(carrier.address)}</div>
              </div>
            `
          )
          .addTo(markerGroup);
      });

      if (markerBounds.length === 1) {
        map.setView(markerBounds[0], 13);
      } else if (markerBounds.length > 1) {
        map.fitBounds(markerBounds, {
          padding: [48, 48],
          maxZoom: 12,
        });
      }

      const handleResize = () => {
        map.invalidateSize();
      };

      window.addEventListener("resize", handleResize);

      requestAnimationFrame(() => {
        map.invalidateSize();
      });

      cleanup = () => {
        window.removeEventListener("resize", handleResize);
        markerGroup.clearLayers();
        map.remove();
      };
    })();

    return () => {
      disposed = true;
      cleanup?.();
    };
  }, [carriers]);

  return <div ref={mapRef} className="h-full w-full" aria-label="广州地图 OPC 载体位置" />;
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>'"]/g, (character) => {
    switch (character) {
      case "&":
        return "&amp;";
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case "'":
        return "&#39;";
      case '"':
        return "&quot;";
      default:
        return character;
    }
  });
}
