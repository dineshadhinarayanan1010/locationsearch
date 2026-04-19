import './App.css'
import { useState } from 'react'
import List from "./components/List";
import Map from "./components/Map";
import Search from "./components/Search";
import Tabs from "./components/Tabs";
import { getBranches } from './services/BranchService';
import { useDispatch } from "react-redux";
import { LoadScript } from "@react-google-maps/api";
import Mapbo from './components/Mapbo';

const GOOGLE_MAPS_CONFIG = {
  apiKey: import.meta.env.VITE_MAP_API_KEY,
  libraries: ["places"],
};

export default function App() {

  const [branches, setBranches] = useState([]);
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("list");
  const [center, setCenter] = useState(null);
  const [selectedBranchId, setSelectedBranchId] = useState(null);
  const [loading, setLoading] = useState(false);
  const searchLocation = async (location) => {
    setLoading(true);
    const data = await dispatch(getBranches(location));
    setBranches(data.branches);
    setCenter(data.center);
    setLoading(false);
  }

  const handleSelectBranch = (branch) => {
    setSelectedBranchId(branch.id);
    console.log("selected branch:", branch);
  };
  return (
    <div className='app-container'>
      <LoadScript googleMapsApiKey={GOOGLE_MAPS_CONFIG.apiKey} libraries={GOOGLE_MAPS_CONFIG.libraries}>
        <div className='app-header'>
          <div className="app-heading">Account Information</div>
          <div className="app-subtitle">Choose your branch of account</div>
          <Search locationSearch={searchLocation} loading={loading} />
          <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
        <div className='app-content'>
          {activeTab === "list" && <List branches={branches} selectedId={selectedBranchId} onSelect={handleSelectBranch} />}
          {activeTab === "map" && <Map branches={branches} center={center} selectedId={selectedBranchId} onSelect={handleSelectBranch} />}
          {/* {activeTab === "map" && <Mapbo branches={branches} center={center} selectedId={selectedBranchId} onSelect={handleSelectBranch} />} */}
        </div>
      </LoadScript>
    </div>
  )
}