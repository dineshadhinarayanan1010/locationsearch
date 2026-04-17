import './App.css'
import { useState } from 'react'
import List from "./components/List";
import Map from "./components/Map";
import Search from "./components/Search";
import Tabs from "./components/Tabs";
import { getBranches } from './services/BranchService';

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
      <h1>BDO Branch Locator</h1>
      <Search locationSearch={searchLocation} />

      <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {activeTab === "list" && <List branches={branches} />
      }
      {activeTab === "map" && <Map branches={branches} center={center} />
      }
    </div>
  )
}