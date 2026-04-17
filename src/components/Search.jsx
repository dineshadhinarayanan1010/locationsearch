import { useState } from 'react'

export default function Search({locationSearch}) {
    const [location, setLocation] = useState("");
    const searchLocation = (e) => {
        e.preventDefault();
        locationSearch(location);
    }
  return (
    <form onSubmit={searchLocation}>
        <label>Enter location to search for nearest branches:</label>
        <input type="text" placeholder='Enter location' value={location} onChange={(e) => setLocation(e.target.value)}></input>
        <button type='submit'>Search</button>
    </form>
  )
}
