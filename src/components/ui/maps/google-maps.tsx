/// <reference types="google.maps" />
'use client'

import { importLibrary, setOptions } from "@googlemaps/js-api-loader";
import { useEffect, useRef } from 'react';

const BUSINESS_LOCATION = { lat: 40.40025075221877, lng: -3.6992860428748027 };

const MAP_STYLES: google.maps.MapTypeStyle[] = [
  // Ocultar POI de negocios (restaurantes, tiendas, etc.)
  {
    featureType: "poi.business",
    stylers: [{ visibility: "off" }],
  },
  // Ocultar POI de atracciones
  {
    featureType: "poi.attraction",
    stylers: [{ visibility: "off" }],
  },
  // Ocultar POI de gobierno
  {
    featureType: "poi.government",
    stylers: [{ visibility: "off" }],
  },
  // Ocultar POI de lugares de culto
  {
    featureType: "poi.place_of_worship",
    stylers: [{ visibility: "off" }],
  },
  // Ocultar POI escolares
  {
    featureType: "poi.school",
    stylers: [{ visibility: "off" }],
  },
  // Ocultar POI deportivos
  {
    featureType: "poi.sports_complex",
    stylers: [{ visibility: "off" }],
  },
  // Ocultar POI médicos
  {
    featureType: "poi.medical",
    stylers: [{ visibility: "off" }],
  },
  // Conservar transporte público visible
  {
    featureType: "transit",
    stylers: [{ visibility: "on" }],
  },
];

function GoogleMaps() {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setOptions({
      key: process.env.NEXT_PUBLIC_MAPS_API_KEY as string,
      language: "es",
      v: "weekly",
    });

    const initMap = async () => {
      const { Map } = await importLibrary("maps") as google.maps.MapsLibrary;

      if (!mapRef.current) return;

      const map = new Map(mapRef.current, {
        center: window.innerWidth < 1024
          ? { lat: 40.40134966059278, lng: -3.6992619029894174 }
          : { lat: 40.40026300780124, lng: -3.6992779962475733 },
        zoom: window.innerWidth < 1024 ? 16 : 17,
        styles: MAP_STYLES,
        clickableIcons: false,
      });

      new google.maps.Marker({
        position: BUSINESS_LOCATION,
        map,
        title: "Panadería La Sorianita",
      });
    };

    initMap();
  }, []);

  return (
    <div ref={mapRef} className="w-full h-100 lg:h-150 rounded-2xl drop-shadow-xl" />
  );
}

export default GoogleMaps