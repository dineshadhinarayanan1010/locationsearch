import { useState } from 'react';

export default function Tabs({activeTab, setActiveTab}) {
  return (
    <div>
        <button onClick={() => setActiveTab("list")}>
            List View
        </button>
        <button onClick={() => setActiveTab("map")}>
            Map View
        </button>
    </div>
  )
}
