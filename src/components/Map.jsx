import {
  GoogleMap,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import { useState, useEffect } from 'react'

export default function Map({branches, center}) {
    const [selected, setSelected] = useState(null);
    const branchIcon = {
        url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
    };

    useEffect(() => {
        if (selected) {
            document
            .querySelector(".branch-card")
            ?.scrollIntoView({ behavior: "smooth" });
        }
    }, [selected]);

  return (
    <div className="map-page">
        <div className="branch-count">
            {branches.length} branches near your selected address
        </div>
        <div className="map-wrapper">
            <GoogleMap mapContainerStyle={{height:"500px", width: "100%"}} center={center?.lat && center?.lng ? center : { lat: 14.5995, lng: 120.9842 }} zoom={15}>
                    {center && (
                        <Marker
                            position={center}
                            label="You"
                            icon="http://maps.google.com/mapfiles/ms/icons/red-dot.png"
                        />
                    )}

                    {branches?.map((branch, index) => (
                        <Marker
                            key={index}
                            icon={branchIcon}
                            position={{ lat: Number(branch.lat), lng: Number(branch.lng) }}
                            onClick={() => setSelected(branch)}
                        />
                    ))}
            </GoogleMap>
        </div>
        <div className="map-card-wrapper">
            {selected && (
                <div className="map-card">
                    <div className="branch-name">{selected.name}</div>
                    <div className="branch-distance">{selected.distance} KM away from your selected address</div>
                    <div className="branch-address">
                        <b>Address: </b>{selected.address}
                    </div>
                </div>
            )}
        </div>
    </div>
)
}
