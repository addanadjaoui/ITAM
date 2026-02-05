import React, { useEffect, useState } from "react";

export default function App() {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [ip_address, setIp] = useState("");

  const loadAssets = () => {
    fetch("http://192.168.56.110:8000/api/assets")
      .then(r => r.json())
    fetch("http://192.168.56.110:8000/api/assets")
      .then((r) => r.json())
      .then(setAssets);
  };

  const discoverAD = async () => {
    await fetch("http://192.168.56.110:8000/api/discover?mode=ad", { method: "POST" });
    await fetch("http://192.168.56.110:8000/api/discover?mode=ad", {
      method: "POST",
    });
    loadAssets();
  };

  const discoverNetwork = async () => {
    const subnet = prompt("Subnet à scanner (ex : 192.168.56.0/24)");
    if (!subnet) return;
    await fetch(
      `http://192.168.56.110:8000/api/discover?mode=network&subnet=${subnet}`,
      { method: "POST" }
    );
    loadAssets();
  };

  const discoverNow = async () => {
    setLoading(true);
    const res = await fetch("http://192.168.56.110:8000/api/discover", {
      method: "POST",
    });
    const data = await res.json();
    alert(`Découverte terminée : ${data.discovered} assets`);
    setAssets(data.assets);
    setLoading(false);
  };

  useEffect(loadAssets, []);

  return (
    <div className="actions"> 
      <input 
        place holder="IP"
        value={ip_address}
        onChange={(e) => setIp(e.target.value)}
      />
      <div className="buttons">
        <button onClick={discoverNow} disabled={loading}>
          {loading ? "Découverte en cours..." : "Découvrir les assets (AD)"}
        </button>
        <button onClick={discoverNetwork}>Découverte Réseau</button>
      </div>
    </div>
  );
}
