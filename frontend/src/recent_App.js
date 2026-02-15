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

//export const getAssets = () => fetch(`${API}/assets`).then((r) => r.json());
export const getAssets = async () => {
  const response = await fetch(`${API}/assets`);
  return response.json();
};

/* =========================
   APP
========================= */
export default function App() {
  const [time, setTime] = useState(new Date().toLocaleString("fr-FR"));
  const [showDiscover, setShowDiscover] = useState(false);
  const [showAssets, setShowAssets] = useState(false); //visible par default
  const [showAddAsset, setShowAddAsset] = useState(false);
	const [showJobAsset, setShowJobAsset] = useState(false)
  const [searchTerm, setSearchTerm] = useState("");
  const [showReport, setReport] = useState(false);


  const links = [
    { title: "Inventaire", form: showAssets, fun: setShowAssets },
    { title: "Découvert", form: showDiscover, fun: setShowDiscover },
    { title: "Deployment", form: showAddAsset, fun: setShowAddAsset },
    { title: "Jobs", form: searchTerm, fun: setSearchTerm },
    { title: "Rapports", form: showReport, fun: setReport },
  ]
  /* CLOCK */
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date().toLocaleString("fr-FR"));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      {/* = ================ HEADER ================= */}
      <header className="header">
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
          {links.map((link, index) => {
            return (
              <li
                className={`nav-item ${link.form ? "active" : ""}`}
                onClick={() => {
                  link.fun((prev) => !prev);
                }}
              >
                {link.title}
              </li>
            );
          })}
        </ul>

        <div className="rightNav">
          <input
            type="text"
            placeholder="Search hostname or IP..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {/*<button className="btn btn-sm">Search</button>*/}
        </div>
      </nav>

      {/* ================= STATS KPI ================= */}
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

