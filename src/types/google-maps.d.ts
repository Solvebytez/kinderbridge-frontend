// Shared Google Maps type definitions
export type GoogleMap = {
  setCenter: (center: { lat: number; lng: number } | unknown) => void;
  setZoom: (zoom: number) => void;
  fitBounds: (bounds: unknown) => void;
};

export type GoogleMarker = {
  setMap: (map: GoogleMap | null) => void;
  addListener: (event: string, callback: () => void) => void;
  getPosition: () => { lat: () => number; lng: () => number } | null;
};

export type GoogleGeocoder = {
  geocode: (
    request: { address: string },
    callback: (results: unknown, status: string) => void
  ) => void;
};

export type GoogleInfoWindow = {
  close: () => void;
  open: (map: GoogleMap, marker: GoogleMarker) => void;
};

declare global {
  interface Window {
    google: {
      maps: {
        Map: new (element: HTMLElement, options: unknown) => GoogleMap;
        Marker: new (options: unknown) => GoogleMarker;
        Geocoder: new () => GoogleGeocoder;
        LatLng: new (lat: number, lng: number) => unknown;
        LatLngBounds: new () => { extend: (location: { lat: number; lng: number }) => void };
        SymbolPath: {
          CIRCLE: unknown;
        };
        InfoWindow: new (options: unknown) => GoogleInfoWindow;
        places?: {
          Autocomplete: new (
            input: HTMLInputElement,
            options?: {
              types?: string[];
              componentRestrictions?: { country: string[] };
              fields?: string[];
            }
          ) => {
            getPlace: () => {
              address_components?: Array<{
                long_name: string;
                short_name: string;
                types: string[];
              }>;
              geometry?: {
                location?: {
                  lat: () => number;
                  lng: () => number;
                };
              };
              formatted_address?: string;
              [key: string]: unknown;
            };
            addListener: (event: string, callback: () => void) => void;
          };
        };
        event: {
          clearInstanceListeners: (instance: unknown) => void;
        };
      };
    };
  }
}

export {};

