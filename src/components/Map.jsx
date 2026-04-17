import {
  GoogleMap,
  LoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import { useState } from 'react'

export default function Map({branches, center}) {
    const [selected, setSelected] = useState(null);

  return (
    <div>
        <h2> Map</h2>
        <LoadScript googleMapsApiKey="AIzaSyCoUdcR6aVirRkqbld2NS5gGF9gIMKya3k">
            <GoogleMap mapContainerStyle={{height:"500px", width: "100%"}} center={center?.lat && center?.lng ? center : { lat: 14.5995, lng: 120.9842 }} zoom={13}>
                    {center && (
                        <Marker
                            position={center}
                            label="You"
                            icon="http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
                        />
                    )}

                    {branches?.map((branch, index) => (
                        <Marker
                            key={index}
                            position={{ lat: Number(branch.lat), lng: Number(branch.lng) }}
                            onClick={() => setSelected(branch)}
                        />
                    ))}

                    {selected && (
                        <InfoWindow
                            position={{ lat: Number(selected.lat), lng: Number(selected.lng) }}
                            onCloseClick={() => setSelected(null)}
                        >
                        <div>
                            <h3>{selected.name}</h3>
                            <p>{selected.address}</p>
                            <p>
                                <strong>Distance:</strong> {selected.distance} km
                            </p>
                        </div>
                    </InfoWindow>
                    )}
            </GoogleMap>

        </LoadScript>
    </div>
)
}
