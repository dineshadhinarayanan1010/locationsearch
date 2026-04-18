import {
  GoogleMap,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import { useState, useEffect } from 'react'

export default function Map({branches, center, selectedId, onSelect}) {

    const selectedBranch = branches.find((b) => b.id === selectedId);

    useEffect(() => {
        if (!selectedId) 
            return;
        document.getElementById(`branch-${selectedId}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, [selectedId]);

  return (
    <div className="map-page">
        <div className="branch-count">
            {branches.length} branches near your selected address
        </div>
        <div className="map-wrapper">
            <GoogleMap mapContainerStyle={{height:"500px", width: "100%"}} center={center?.lat && center?.lng ? center : { lat: 14.5995, lng: 120.9842 }} zoom={15}>
                    {center && (
                        <Marker
                            icon={"/red-marker-icon.png"}
                            position={center}

                        />
                    )}

                    {branches?.map((branch) => (
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
                    ))}
            </GoogleMap>
        </div>
        <div className="map-card-wrapper">
            {selectedBranch && (
                <div className="map-card">
                    <div className="branch-name">{selectedBranch.name}</div>
                    <div className="branch-distance">{selectedBranch.distance.toFixed(2)} KM away from your selected address</div>
                    <div className="branch-address">
                        <b>Address: </b>{selectedBranch.address}
                        <br/>
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
