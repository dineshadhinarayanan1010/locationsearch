import './App.css'
import { useState } from 'react'
import List from "./components/List";
import Map from "./components/Map";
import Search from "./components/Search";
import Tabs from "./components/Tabs";
import { getBranches } from './services/BranchService';
import { LoadScript } from "@react-google-maps/api";

export default function App() {
    const [branches, setBranches] = useState([]);
    const [activeTab, setActiveTab] = useState("list");
    const [center, setCenter] = useState(null);

    const searchLocation= async (location) => {
        const data = await getBranches(location);
        setBranches(data.branches);
        setCenter(data.center);
    }
  return (
    <div>
      <h3>Choose your branch of account</h3>
      <br/>
      <LoadScript googleMapsApiKey="AIzaSyCoUdcR6aVirRkqbld2NS5gGF9gIMKya3k" libraries={["places"]}>
        <Search locationSearch={searchLocation} />

        <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />

        {activeTab === "list" && <List branches={branches} onSelect={(branch) => console.log("selected branch: ",branch)} />
        }
        {activeTab === "map" && <Map branches={branches} center={center} />
        }
      </LoadScript>
    </div>
  )
}