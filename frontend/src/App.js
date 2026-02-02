import "./styles.css";
import React, { useEffect, useState } from "react";
import KPI from "./components/KPI";
import AssetList from "./components/AssetList";
import AddAssetForm from "./components/AddAssetForm";
// import ModAssetForm from "./components/ModAssetForm";
import DiscoverForm from "./components/DiscoverForm";

export default function App() {
  const [time, setTime] = useState(new Date().toLocaleString("fr-FR"));

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date().toLocaleString("fr-FR"));
    }, 1000);

    return () => clearInterval(interval); // cleanup
  }, []);

  return (
    <div>
      <header>
        <h1>ITAM Enterprise Dashboard</h1>
        <p class="subtitle">Gestion des actifs IT – Enterprise</p>
      </header>
      <div className="stats-grid" style={{ padding: 30 }}>
        <div className="stat-card">
          <KPI />
          <div className="stat-label">Actifs</div>
        </div>
        <AddAssetForm />
        <DiscoverForm />
      </div>
      <AssetList />
      <footer style={{ marginTop: 20 }}>
        TO.SystemAdministration: ITAM Enterprise v4 • VM 192.168.56.110 • {time}
        <br />
        Djezzy
      </footer>
    </div>
  );
}
