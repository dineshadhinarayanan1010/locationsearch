export default function Tabs({ activeTab, setActiveTab }) {
  return (
    <div className="tabs-container">
      <button
        className={`tab ${activeTab === "list" ? "active" : ""}`}
        onClick={() => setActiveTab("list")}
      >
        List View
      </button>

      <button
        className={`tab ${activeTab === "map" ? "active" : ""}`}
        onClick={() => setActiveTab("map")}
      >
        Map View
      </button>
      <div className={`underline ${activeTab}`} />
    </div>

  )
}
