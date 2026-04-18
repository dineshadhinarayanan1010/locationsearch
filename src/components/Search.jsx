import { useEffect, useRef, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { IoClose } from "react-icons/io5";

export default function Search({locationSearch}) {
    const [location, setLocation] = useState("");
    const [dispLoc, setDispLoc] = useState("");
    const searchLocation = (e) => {
        e.preventDefault();
        locationSearch(location);
    }
    const inputRef = useRef(null);

    useEffect(() => {
      const autocomplete = new window.google.maps.places.Autocomplete (
        inputRef.current,
        {
          types: ["geocode"],
          componentRestrictions: { country: "ph" },
        }
      );

      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (!place.geometry) return;
        setLocation(place.name);
        setDispLoc(place.formatted_address);
      });
    }, [locationSearch]);

  return (
    <form className="search-box" onSubmit={searchLocation}>
      <label className="search-label">
        Search for BDO branches and choose your branch of account
      </label>
      <div className="input-wrapper">
        <FaSearch className="search-icon" />
        <input
          ref={inputRef}
          placeholder="Search for an area or branch name"
          value={dispLoc}
          onChange={(e) => setDispLoc(e.target.value)}
        />
        {dispLoc && (
          <IoClose
            className="clear-icon"
            onClick={() => {
              setDispLoc("");
              setLocation("");
            }}
          />
        )}
      </div>
      <button className="search-button" type="submit">Search</button>
  </form>
  )
}
