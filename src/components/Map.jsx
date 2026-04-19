import { GoogleMap, Marker, InfoWindow, useJsApiLoader } from "@react-google-maps/api";
import { useState, useEffect, useRef } from 'react';
import { MarkerClusterer } from "@googlemaps/markerclusterer";

export default function Map({ branches, center, selectedId, onSelect }) {

    const mapRef = useRef(null);
    const clustererRef = useRef(null);

    const selectedBranch = branches.find((b) => b.id === selectedId);

    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: import.meta.env.VITE_MAP_API_KEY,
    });

    useEffect(() => {
        if (!mapRef.current || !isLoaded) return;

        if (clustererRef.current) {
            clustererRef.current.clearMarkers();
            clustererRef.current.setMap(null);
        }

        const markers = branches.map((branch) => {
            const isSelected = branch.id === selectedId;
            const marker = new window.google.maps.Marker({
                position: {
                    lat: Number(branch.lat),
                    lng: Number(branch.lng),
                },
                icon: {
                    url: "/blue-marker-icon.png",
                    scaledSize: new window.google.maps.Size(
                        isSelected ? 50 : 30,
                        isSelected ? 50 : 30
                    ),
                }
            });
            
            
            marker.setZIndex(isSelected ? 999 : undefined);
            marker.setAnimation(
                isSelected ? window.google.maps.Animation.BOUNCE : null);

            marker.addListener("click", () => onSelect(branch));

            return marker;
        });

        clustererRef.current = new MarkerClusterer({
            map: mapRef.current,
            markers,
            renderer: {
                render: ({ count, position }) =>
                    new window.google.maps.Marker({
                        position,
                        label: {
                            text: String(count),
                            color: "white",
                            fontSize: "12px",
                        },
                        icon: {
                            url: "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m1.png",
                        },
                    }),
            },
        });

        clustererRef.current.markers = markers;

    }, [branches, isLoaded]);

    useEffect(() => {
        const markers = clustererRef.current?.markers;
        if (!markers) return;

        markers.forEach((marker, index) => {
            const branch = branches[index];
            const isSelected = branch.id === selectedId;
            marker.setIcon({
                url: "/blue-marker-icon.png",
                scaledSize: new window.google.maps.Size(
                    isSelected ? 50 : 30,
                    isSelected ? 50 : 30
                ),
            });

            marker.setAnimation(
                isSelected ? window.google.maps.Animation.BOUNCE : null
            );

            marker.setZIndex(isSelected ? 999 : undefined);
        });
    }, [selectedId, branches]);

    return (
        <div className="map-page">
            <div className="branch-count">
                {branches.length} branches near your selected address
            </div>
            <div className="map-wrapper">
                <GoogleMap mapContainerStyle={{ height: "100%", width: "100%" }} center={center?.lat && center?.lng ? center : { lat: 14.5995, lng: 120.9842 }} zoom={15} onLoad={(map) => {mapRef.current = map}}>
                    {center && (
                        <Marker
                            icon={"/red-marker-icon.png"}
                            position={center}

                        />
                    )}

                    {/* {branches?.map((branch) => (
                        <Marker
                            key={branch.id}
                            icon={{
                                url: "/blue-marker-icon.png",
                                scaledSize: new window.google.maps.Size(
                                    selectedId === branch.id ? 60 : 30,
                                    selectedId === branch.id ? 60 : 30
                                ),
                            }}
                            // icon={{
                            //     path: window.google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
                            //     scale: selectedId === branch.id ? 8 : 3,
                            //     fillColor: "#fff",
                            //     fillOpacity: 1,
                            //     strokeWeight: 5,
                            //     strokeColor: "#4285f4",
                            // }}
                            position={{ lat: Number(branch.lat), lng: Number(branch.lng) }}
                            onClick={() => onSelect(branch)}
                        />
                    ))} */}
                </GoogleMap>
            </div>
            <div className="map-card-wrapper">
                {selectedBranch && (
                    <div className="map-card">
                        <div className="branch-name">{selectedBranch.name}</div>
                        <div className="branch-distance">{selectedBranch.distance.toFixed(2)} KM away from your selected address</div>
                        <div className="branch-address">
                            <b>Address: </b>{selectedBranch.address}
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
    )
}
