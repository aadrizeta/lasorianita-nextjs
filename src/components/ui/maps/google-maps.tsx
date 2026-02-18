/// <reference types="google.maps" />
'use client'

import { importLibrary, setOptions } from "@googlemaps/js-api-loader";
import { useEffect, useRef } from 'react';

const BUSINESS_LOCATION = { lat: 40.40025075221877, lng: -3.6992860428748027 };
const GOOGLE_MAPS_URL = 'https://maps.app.goo.gl/VzFZMw4iKrsyDTx17';

const INFO_WINDOW_CONTENT = `
  <div style="font-family: sans-serif; padding: 4px;">
    <div style="display: flex; align-items: center; gap: 10px;">
      <img src="/favicon.ico" alt="" style="width: 32px; height: 32px;" />
      <div>
        <h3 style="margin: 0 0 4px 0; font-size: 16px; font-family: math;">Panadería La Sorianita</h3>
        <p style="margin: 0 0 8px 0; font-size: 13px; color: #666;">C. de Antonio López, 41, Arganzuela, 28019 Madrid</p>
    <a href="${GOOGLE_MAPS_URL}" target="_blank" rel="noopener noreferrer"
      style="font-size: 12px; color: #1a73e8; text-decoration: none;">
      Abrir en Google Maps
    </a>
  </div>
`;

function GoogleMaps() {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setOptions({
      key: process.env.NEXT_PUBLIC_MAPS_API_KEY as string,
      language: "es",
      v: "weekly",
    });

    const initMap = async () => {
      const { Map, InfoWindow } = await importLibrary("maps") as google.maps.MapsLibrary;
      const { AdvancedMarkerElement } = await importLibrary("marker") as google.maps.MarkerLibrary;

      if (!mapRef.current) return;

      const map = new Map(mapRef.current, {
        center: window.innerWidth < 1024
          ? { lat: 40.40134966059278, lng: -3.6992619029894174 }
          : { lat: 40.40026300780124, lng: -3.6992779962475733 },
        zoom: window.innerWidth < 1024 ? 16 : 17,
        mapId: process.env.NEXT_PUBLIC_MAP_ID as string,
        clickableIcons: false,
        gestureHandling: "greedy",
      });

      const marker = new AdvancedMarkerElement({
        position: BUSINESS_LOCATION,
        map,
        title: "Panadería La Sorianita",
      });

      const infoWindow = new InfoWindow({
        content: INFO_WINDOW_CONTENT,
      });

      marker.addListener("gmp-click", () => {
        infoWindow.open({ anchor: marker, map });
      });
    };

    initMap();
  }, []);

  return (
    <div ref={mapRef} className="w-full h-100 lg:h-150 rounded-2xl drop-shadow-xl" />
  );
}

export default GoogleMaps