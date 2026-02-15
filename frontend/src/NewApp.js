import "./app.css";
import React, { useEffect, useState } from "react";
import KPI from "./components/KPI";
import AssetList from "./components/AssetList";
import AddAssetForm from "./components/AddAssetForm";
import DiscoverForm from "./components/DiscoverForm";
import logo from "./images/djezzy.png";

const API = "http://192.168.56.110:8000/api";

/* =========================
   API CALLS
========================= */
export const discover = (ip, agent) =>
  fetch(`${API}/discovery/on-demand?ip=${ip}&agent=${agent}`, {
    method: "POST",
  });

export const getAssets = () =>
  fetch(`${API}/assets`).then((r) => r.json());

/* =========================
   APP
========================= */
export default function App() {
  const [time, setTime] = useState(new Date().toLocaleString("fr-FR"));
  const [showDiscover, setShowDiscover] = useState(false);
  const [showAssets, setShowAssets] = useState(false); //visible par default
  const [showAddAsset, setShowAddAsset] = useState(false);
	const [searchTerm, setSearchTerm] = useState("");

  /* CLOCK */
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date().toLocaleString("fr-FR"));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
			{/* ================= HEADER ================= */}
			<header className="header">
				{/*<h1>ITAM Enterprise Dashboard</h1>
				<p className="subtitle">
				Gestion des actifs IT – Enterprise
				</p>*/}
				<div className="header-content">
    			<img src={logo} alt="ITAM Logo" className="logo" />
    			<div>
      			<h1>ITAM Enterprise</h1>
      			<p className="subtitle">Gestion des actifs IT pour entreprise</p>
    			</div>
  			</div>
			</header>
      {/* ================= NAVBAR ================= */}
      <nav className="navbar background">
        <ul className="nav-list">
          <li className="logo">
            <img src={logo} alt="Djezzy Logo" />
          </li>

          <li
            className={`nav-item ${showAssets ? "active" : ""}`}
            onClick={() => setShowAssets((prev) => !prev)}
          >
            Inventaire
          </li>

          <li
            className={`nav-item ${showDiscover ? "active" : ""}`}
            onClick={() => setShowDiscover((prev) => !prev)}
          >
            Découvert
          </li>

          <li
            className={`nav-item ${showAddAsset ? "active" : ""}`}
            onClick={() => setShowAddAsset((prev) => !prev)}
          >
            Deployment
          </li>

          <li className="nav-item">Jobs</li>
        </ul>

        <div className="rightNav">
          {/*<input type="text" id="search" placeholder="Search..." />*/}
					<input
  					type="text"
  					id="search"
  					placeholder="Search hostname or IP..."
  					value={searchTerm}
  					onChange={(e) => setSearchTerm(e.target.value)}
					/>
          <button className="btn btn-sm">Search</button>
        </div>
      </nav>

      {/* ================= HEADER ================= */}
      {/*<header>
        <h1>ITAM Enterprise Dashboard</h1>
        <p className="subtitle">
          Gestion des actifs IT – Enterprise
        </p>
      </header>*/}

      {/* ================= STATS ================= */}
      <div className="stats-grid" style={{ padding: 30 }}>
        <div className="stat-card">
          <KPI />
          <div className="stat-label">Actifs</div>
        </div>
      </div>

      {/* ================= CONTENT ================= */}
      {showDiscover && <DiscoverForm />}
      {showAddAsset && <AddAssetForm />}
      {/*showAssets && <AssetList />*/}
			{showAssets && <AssetList searchTerm={searchTerm} />}

      {/* ================= FOOTER ================= */}
      <footer style={{ marginTop: 20 }}>
        TO.SystemAdministration: ITAM Enterprise v4 • VM 192.168.56.110 • {time}
        <br />
        Djezzy
      </footer>
    </div>
  );
}

