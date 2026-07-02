/**
 * MapLoader utility
 * Tries to load Google Maps JS API. If it fails (invalid key, quota, network),
 * automatically falls back to Leaflet + OpenStreetMap — no API key required.
 *
 * Usage:
 *   import { loadMap, renderLeafletMap, renderGoogleMap } from "@/lib/mapLoader";
 */

const GOOGLE_SCRIPT_ID = "google-maps-script";
const LEAFLET_CSS_ID   = "leaflet-css";
const LEAFLET_JS_ID    = "leaflet-js";

let googleLoadState  = "idle";  // idle | loading | loaded | failed
let leafletLoadState = "idle";

// ─── Leaflet ───────────────────────────────────────────────────────────────

export function loadLeaflet() {
  return new Promise((resolve) => {
    if (typeof window === "undefined") return;

    if (window.L) { resolve("loaded"); return; }
    if (leafletLoadState === "loaded") { resolve("loaded"); return; }

    // Inject CSS once
    if (!document.getElementById(LEAFLET_CSS_ID)) {
      const link = document.createElement("link");
      link.id   = LEAFLET_CSS_ID;
      link.rel  = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }

    if (document.getElementById(LEAFLET_JS_ID)) {
      const iv = setInterval(() => {
        if (window.L) { clearInterval(iv); resolve("loaded"); }
      }, 50);
      return;
    }

    leafletLoadState = "loading";
    const script  = document.createElement("script");
    script.id     = LEAFLET_JS_ID;
    script.src    = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.async  = true;
    script.onload = () => { leafletLoadState = "loaded"; resolve("loaded"); };
    script.onerror = () => { leafletLoadState = "failed"; resolve("failed"); };
    document.head.appendChild(script);
  });
}

// ─── Google Maps ───────────────────────────────────────────────────────────

export function loadGoogleMaps(apiKey) {
  return new Promise((resolve) => {
    if (typeof window === "undefined") return;

    if (window.google?.maps) { resolve("loaded"); return; }
    if (googleLoadState === "loaded")  { resolve("loaded");  return; }
    if (googleLoadState === "failed")  { resolve("failed");  return; }

    if (document.getElementById(GOOGLE_SCRIPT_ID)) {
      const iv = setInterval(() => {
        if (googleLoadState === "loaded") { clearInterval(iv); resolve("loaded"); }
        if (googleLoadState === "failed") { clearInterval(iv); resolve("failed"); }
      }, 50);
      return;
    }

    googleLoadState = "loading";
    const script   = document.createElement("script");
    script.id      = GOOGLE_SCRIPT_ID;
    script.src     = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async   = true;
    script.defer   = true;
    script.onload  = () => {
      // Small delay then verify google.maps is actually available
      setTimeout(() => {
        if (window.google?.maps) {
          googleLoadState = "loaded";
          resolve("loaded");
        } else {
          googleLoadState = "failed";
          resolve("failed");
        }
      }, 200);
    };
    script.onerror = () => { googleLoadState = "failed"; resolve("failed"); };
    document.head.appendChild(script);

    // If Google Maps fires gm_authFailure (bad key), mark as failed
    window.gm_authFailure = () => {
      googleLoadState = "failed";
      // Remove the broken script so future attempts use Leaflet cleanly
      const el = document.getElementById(GOOGLE_SCRIPT_ID);
      if (el) el.remove();
      resolve("failed");
    };
  });
}

// ─── Auto-load: try Google → fallback Leaflet ─────────────────────────────

export async function loadBestMap(apiKey) {
  if (apiKey && apiKey !== "YOUR_REAL_KEY_HERE") {
    const googleResult = await loadGoogleMaps(apiKey);
    if (googleResult === "loaded" && window.google?.maps) return "google";
  }
  // Fallback
  const leafletResult = await loadLeaflet();
  if (leafletResult === "loaded") return "leaflet";
  return "none";
}

// ─── Render helpers ────────────────────────────────────────────────────────

/**
 * Initialise or update a Leaflet map in a container div.
 * Returns the Leaflet map instance.
 */
export function createLeafletMap(container, { center, zoom, markers = [], routePoints = [] }) {
  if (!container || !window.L) return null;

  // Fix Leaflet default icon path broken by bundlers
  delete window.L.Icon.Default.prototype._getIconUrl;
  window.L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl:       "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl:     "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  });

  const map = window.L.map(container, {
    center: [center.lat, center.lng],
    zoom,
    zoomControl: true,
    attributionControl: true,
  });

  window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 19,
  }).addTo(map);

  // Draw route polyline if provided
  if (routePoints.length > 1) {
    const latlngs = routePoints.map((p) => [p.lat, p.lng]);
    window.L.polyline(latlngs, { color: "#0F52BA", weight: 4, opacity: 0.8 }).addTo(map);
  }

  // Add markers
  markers.forEach((m) => {
    if (m.lat == null || m.lng == null) return;

    const color   = m.color || "#0F52BA";
    const label   = m.label || "";

    const icon = window.L.divIcon({
      className: "",
      html: `
        <div style="
          background:${color};
          color:#fff;
          font-size:11px;
          font-weight:700;
          padding:3px 8px;
          border-radius:20px;
          white-space:nowrap;
          box-shadow:0 2px 6px rgba(0,0,0,0.3);
          border:1.5px solid rgba(255,255,255,0.8);
          position:relative;
        ">
          ${label}
          <div style="
            position:absolute;
            bottom:-6px;
            left:50%;
            transform:translateX(-50%);
            width:0;height:0;
            border-left:5px solid transparent;
            border-right:5px solid transparent;
            border-top:6px solid ${color};
          "></div>
        </div>`,
      iconAnchor: [0, 28],
    });

    window.L.marker([m.lat, m.lng], { icon }).addTo(map).bindTooltip(label, { permanent: false });
  });

  return map;
}
