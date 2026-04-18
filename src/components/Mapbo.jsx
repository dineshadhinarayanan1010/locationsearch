import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

export default function Mapbo({ branches, center, selectedId, onSelect }) {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const searchMarkerRef = useRef(null);
  const markersRef = useRef([]);

  const selectedBranch = branches.find((b) => b.id === selectedId);

  // INIT MAP
  useEffect(() => {
    if (mapRef.current) return;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: center ? [center.lng, center.lat] : [120.9842, 14.5995],
      zoom: 11,
    });

    map.addControl(new mapboxgl.NavigationControl());
    mapRef.current = map;
  }, []);

  // 🔴 SEARCH LOCATION MARKER
  useEffect(() => {
    if (!mapRef.current || !center) return;

    const map = mapRef.current;

    if (searchMarkerRef.current) {
      searchMarkerRef.current.remove();
    }

    searchMarkerRef.current = new mapboxgl.Marker({ color: "red" })
      .setLngLat([center.lng, center.lat])
      .addTo(map);

    map.flyTo({
      center: [center.lng, center.lat],
      zoom: 13,
    });
  }, [center]);

  // 🔵 CLUSTER + MARKERS
  useEffect(() => {
    if (!mapRef.current || !branches.length) return;

    const map = mapRef.current;

    const setupClusters = () => {
      // cleanup old markers
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];

      // remove old layers
      if (map.getSource("branches")) {
        if (map.getLayer("clusters")) map.removeLayer("clusters");
        if (map.getLayer("cluster-count")) map.removeLayer("cluster-count");
        map.removeSource("branches");
      }

      const geojson = {
        type: "FeatureCollection",
        features: branches.map((b) => ({
          type: "Feature",
          properties: {
            id: b.id,
          },
          geometry: {
            type: "Point",
            coordinates: [Number(b.lng), Number(b.lat)],
          },
        })),
      };

      // SOURCE
      map.addSource("branches", {
        type: "geojson",
        data: geojson,
        cluster: true,
        clusterMaxZoom: 14,
        clusterRadius: 50,
      });

      // 🔵 CLUSTERS
      map.addLayer({
        id: "clusters",
        type: "circle",
        source: "branches",
        filter: ["has", "point_count"],
        paint: {
          "circle-color": "#4285f4",
          "circle-radius": 20,
        },
      });

      // 🔢 COUNT
      map.addLayer({
        id: "cluster-count",
        type: "symbol",
        source: "branches",
        filter: ["has", "point_count"],
        layout: {
          "text-field": "{point_count_abbreviated}",
          "text-size": 12,
        },
        paint: {
          "text-color": "#fff",
        },
      });

      // 🔍 CLUSTER CLICK
      map.on("click", "clusters", (e) => {
        const features = map.queryRenderedFeatures(e.point, {
          layers: ["clusters"],
        });

        const clusterId = features[0].properties.cluster_id;

        map.getSource("branches").getClusterExpansionZoom(
          clusterId,
          (err, zoom) => {
            if (err) return;

            map.easeTo({
              center: features[0].geometry.coordinates,
              zoom,
            });
          }
        );
      });

      // 🔵 ADD BLUE MARKERS FOR INDIVIDUAL POINTS
      branches.forEach((b) => {
        const el = document.createElement("div");

        el.style.width = selectedId === b.id ? "40px" : "25px";
        el.style.height = selectedId === b.id ? "40px" : "25px";
        el.style.backgroundImage = "url('/blue-marker-icon.png')";
        el.style.backgroundSize = "cover";
        el.style.cursor = "pointer";

        const marker = new mapboxgl.Marker(el)
          .setLngLat([Number(b.lng), Number(b.lat)])
          .addTo(map);

        el.addEventListener("click", () => onSelect(b));

        markersRef.current.push(marker);
      });
    };

    // ✅ FIX: handle load properly
    if (map.isStyleLoaded()) {
      setupClusters();
    } else {
      map.once("load", setupClusters);
    }
  }, [branches, selectedId]);

  return (
    <div className="map-page">
      <div className="branch-count">
        {branches.length} branches near your selected address
      </div>

      <div
        ref={mapContainerRef}
        className="map-wrapper"
        style={{ height: "500px", width: "100%" }}
      />

      {/* 📍 MAP CARD */}
      <div className="map-card-wrapper">
        {selectedBranch && (
          <div className="map-card">
            <div className="branch-name">{selectedBranch.name}</div>

            <div className="branch-distance">
              {selectedBranch.distance.toFixed(2)} KM away
            </div>

            <div className="branch-address">
              <b>Address:</b> {selectedBranch.address}
              <br />

              {typeof selectedBranch.bankingHours === "object" ? (
                <>
                  <strong>{selectedBranch.bankingHours.days}</strong>
                  <br />
                  <span>{selectedBranch.bankingHours.hours}</span>
                </>
              ) : (
                <span>{selectedBranch.bankingHours}</span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}