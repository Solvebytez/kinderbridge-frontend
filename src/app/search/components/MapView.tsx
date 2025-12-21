"use client";

import { useEffect, useRef, useState } from "react";
import { Daycare } from "./SearchResults";
import { formatDaycarePrice } from "../../../utils/priceFormatter";

interface MapViewProps {
  daycares: Daycare[];
  onMarkerClick?: (daycare: Daycare) => void;
  isLoading?: boolean;
}

declare global {
  interface Window {
    google: {
      maps: {
        Map: new (element: HTMLElement, options: any) => any;
        Marker: new (options: any) => any;
        Geocoder: new () => any;
        LatLng: new (lat: number, lng: number) => any;
        LatLngBounds: new () => any;
        SymbolPath: {
          CIRCLE: any;
        };
        event: {
          clearInstanceListeners: (instance: any) => void;
        };
      };
    };
  }
}

export default function MapView({
  daycares,
  onMarkerClick,
  isLoading = false,
}: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const geocoderRef = useRef<any>(null);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [geocodingProgress, setGeocodingProgress] = useState(0);
  const [isGeocoding, setIsGeocoding] = useState(false);

  // Load Google Maps script
  useEffect(() => {
    const apiKey =
      process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ||
      "AIzaSyCe1aICpk2SmN3ArHwp-79FnsOk38k072M";

    if (!apiKey) {
      console.error("Google Maps API key is not configured");
      return;
    }

    // Check if script is already loaded with all required libraries
    if (
      window.google &&
      window.google.maps &&
      window.google.maps.Geocoder &&
      window.google.maps.Marker &&
      window.google.maps.Map
    ) {
      setIsScriptLoaded(true);
      return;
    }

    // Check if script tag already exists
    const existingScript = document.querySelector(
      'script[src*="maps.googleapis.com"]'
    );
    if (existingScript) {
      // Script is already loading or loaded, wait for it
      const checkGoogle = setInterval(() => {
        if (
          window.google &&
          window.google.maps &&
          window.google.maps.Geocoder &&
          window.google.maps.Marker &&
          window.google.maps.Map
        ) {
          setIsScriptLoaded(true);
          clearInterval(checkGoogle);
        }
      }, 100);

      // Timeout after 10 seconds
      setTimeout(() => {
        clearInterval(checkGoogle);
        if (
          window.google &&
          window.google.maps &&
          window.google.maps.Geocoder &&
          window.google.maps.Marker &&
          window.google.maps.Map
        ) {
          setIsScriptLoaded(true);
        }
      }, 10000);

      return () => clearInterval(checkGoogle);
    }

    // Load the script with all required libraries
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,geometry`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      // Wait for all libraries to be ready
      const checkLibraries = setInterval(() => {
        if (
          window.google &&
          window.google.maps &&
          window.google.maps.Geocoder &&
          window.google.maps.Marker &&
          window.google.maps.Map
        ) {
          setIsScriptLoaded(true);
          clearInterval(checkLibraries);
        }
      }, 100);

      // Timeout after 10 seconds
      setTimeout(() => {
        clearInterval(checkLibraries);
        if (
          window.google &&
          window.google.maps &&
          window.google.maps.Geocoder &&
          window.google.maps.Marker &&
          window.google.maps.Map
        ) {
          setIsScriptLoaded(true);
        } else {
          console.error("Google Maps libraries failed to load");
        }
      }, 10000);
    };
    script.onerror = () => {
      console.error("Failed to load Google Maps script");
    };

    document.head.appendChild(script);

    // Don't remove script on cleanup - other components might need it
  }, []);

  // Initialize map
  useEffect(() => {
    if (!isScriptLoaded || !mapRef.current || mapInstanceRef.current) return;

    // Double-check that Google Maps is fully loaded
    if (
      !window.google ||
      !window.google.maps ||
      !window.google.maps.Map ||
      !window.google.maps.Geocoder
    ) {
      return;
    }

    try {
      const map = new window.google.maps.Map(mapRef.current, {
        center: { lat: 43.6532, lng: -79.3832 } as any, // Toronto center
        zoom: 10,
        styles: [
          {
            featureType: "poi",
            elementType: "labels",
            stylers: [{ visibility: "off" }],
          },
        ] as any,
      });

      mapInstanceRef.current = map;
      geocoderRef.current = new window.google.maps.Geocoder();
    } catch (error) {
      console.error("Error initializing map:", error);
    }
  }, [isScriptLoaded]);

  // Geocode addresses and add markers
  useEffect(() => {
    if (
      !isScriptLoaded ||
      !mapInstanceRef.current ||
      !geocoderRef.current ||
      daycares.length === 0 ||
      !window.google ||
      !window.google.maps
    ) {
      return;
    }

    const map = mapInstanceRef.current;
    const geocoder = geocoderRef.current;

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];

    // Separate daycares with and without coordinates
    const withCoordinates: Daycare[] = [];
    const withoutCoordinates: Daycare[] = [];

    daycares.forEach((daycare) => {
      if (
        daycare.coordinates &&
        daycare.coordinates.lat !== 0 &&
        daycare.coordinates.lng !== 0
      ) {
        withCoordinates.push(daycare);
      } else {
        withoutCoordinates.push(daycare);
      }
    });

    // Add markers for daycares with coordinates
    const bounds = new window.google.maps.LatLngBounds();
    let markersAdded = 0;

    withCoordinates.forEach((daycare) => {
      if (!daycare.coordinates) return;

      const marker = new window.google.maps.Marker({
        position: {
          lat: daycare.coordinates.lat,
          lng: daycare.coordinates.lng,
        } as any,
        map: map,
        title: daycare.name,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: "#4285F4",
          fillOpacity: 1,
          strokeColor: "#FFFFFF",
          strokeWeight: 2,
        } as any,
      });

      if (onMarkerClick) {
        marker.addListener("click", () => {
          onMarkerClick(daycare);
        });
      }

      // Add info window
      const InfoWindow = (window.google.maps as any).InfoWindow;
      const formattedPrice = formatDaycarePrice(daycare.price, daycare.priceString);
      const infoWindow = new InfoWindow({
        content: `
          <div style="padding: 8px; min-width: 200px;">
            <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold;">${daycare.name}</h3>
            <p style="margin: 0 0 4px 0; color: #666; font-size: 14px;">${daycare.address}</p>
            <p style="margin: 0 0 4px 0; color: #666; font-size: 14px;">${daycare.city}</p>
            <p style="margin: 8px 0 0 0; color: #4285F4; font-size: 14px; font-weight: bold;">${formattedPrice}</p>
          </div>
        `,
      });

      marker.addListener("click", () => {
        infoWindow.open(map, marker);
      });

      markersRef.current.push(marker);
      bounds.extend({
        lat: daycare.coordinates.lat,
        lng: daycare.coordinates.lng,
      });
      markersAdded++;
    });

    // Geocode addresses for daycares without coordinates
    if (withoutCoordinates.length > 0) {
      setIsGeocoding(true);
      setGeocodingProgress(0);

      let geocoded = 0;
      const geocodePromises: Promise<void>[] = [];

      // Process all daycares without coordinates (with rate limiting)
      withoutCoordinates.forEach((daycare, index) => {
        // Stagger requests to avoid rate limits (200ms between each)
        const promise = new Promise<void>((resolve) => {
          setTimeout(() => {
            const address = `${daycare.address}, ${daycare.city}, ON, Canada`;
            geocoder.geocode({ address }, (results, status) => {
              if (status === "OK" && results && results[0]) {
                const location = results[0].geometry.location;
                const lat = location.lat();
                const lng = location.lng();

                // Create marker
                const marker = new window.google.maps.Marker({
                  position: { lat, lng } as any,
                  map: map,
                  title: daycare.name,
                  icon: {
                    path: window.google.maps.SymbolPath.CIRCLE,
                    scale: 8,
                    fillColor: "#4285F4",
                    fillOpacity: 1,
                    strokeColor: "#FFFFFF",
                    strokeWeight: 2,
                  } as any,
                });

                if (onMarkerClick) {
                  marker.addListener("click", () => {
                    onMarkerClick(daycare);
                  });
                }

                // Add info window
                const InfoWindow = (window.google.maps as any).InfoWindow;
                const formattedPrice = formatDaycarePrice(daycare.price, daycare.priceString);
                const infoWindow = new InfoWindow({
                  content: `
                    <div style="padding: 8px; min-width: 200px;">
                      <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold;">${daycare.name}</h3>
                      <p style="margin: 0 0 4px 0; color: #666; font-size: 14px;">${daycare.address}</p>
                      <p style="margin: 0 0 4px 0; color: #666; font-size: 14px;">${daycare.city}</p>
                      <p style="margin: 8px 0 0 0; color: #4285F4; font-size: 14px; font-weight: bold;">${formattedPrice}</p>
                    </div>
                  `,
                });

                marker.addListener("click", () => {
                  infoWindow.open(map, marker);
                });

                markersRef.current.push(marker);
                bounds.extend({ lat, lng });
                markersAdded++;

                // TODO: Save coordinates to backend/database for caching
                // This would require a backend API endpoint
              }
              geocoded++;
              setGeocodingProgress(
                Math.round((geocoded / withoutCoordinates.length) * 100)
              );
              resolve();
            });
          }, index * 200); // Stagger requests to avoid rate limits (200ms between each)
        });

        geocodePromises.push(promise);
      });

      Promise.all(geocodePromises).then(() => {
        setIsGeocoding(false);
      });
    }

    // Fit bounds to show all markers
    if (markersAdded > 0) {
      if (markersAdded === 1) {
        // If only one marker, center on it with a reasonable zoom
        const firstMarker = markersRef.current[0];
        const position = firstMarker.getPosition();
        if (position) {
          map.setCenter(position);
          map.setZoom(13);
        }
      } else {
        map.fitBounds(bounds);
      }
    }
  }, [isScriptLoaded, daycares, onMarkerClick]);

  if (isLoading) {
    return (
      <div className="w-full h-[600px] bg-gray-100 rounded-xl flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[600px] rounded-xl overflow-hidden border border-gray-200 shadow-lg">
      {isGeocoding && (
        <div className="absolute top-4 left-4 z-10 bg-white px-4 py-2 rounded-lg shadow-md">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <span className="text-sm text-gray-700">
              Geocoding addresses... {geocodingProgress}%
            </span>
          </div>
        </div>
      )}
      <div ref={mapRef} className="w-full h-full" />
    </div>
  );
}
