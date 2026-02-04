import React, { useEffect, useState } from "react";

export default function App() {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [ip_address, setIp] = useState("");

  const loadAssets = () => {
<<<<<<< HEAD
    fetch("http://192.168.56.110:8000/api/assets")
      .then(r => r.json())
=======
    fetch("http://192.168.56.110:8000/assets")
      .then((r) => r.json())
>>>>>>> 2013531 (Local changes to DiscoverForm)
      .then(setAssets);
  };

  const discoverAD = async () => {
<<<<<<< HEAD
    await fetch("http://192.168.56.110:8000/api/discover?mode=ad", { method: "POST" });
=======
    await fetch("http://192.168.56.110:8000/discover?mode=ad", {
      method: "POST",
    });
>>>>>>> 2013531 (Local changes to DiscoverForm)
    loadAssets();
  };

  const discoverNetwork = async () => {
    const subnet = prompt("Subnet à scanner (ex: 192.168.56.0/24)");
    if (!subnet) return;
    await fetch(
      `http://192.168.56.110:8000/discover?mode=network&subnet=${subnet}`,
      { method: "POST" }
    );
    loadAssets();
  };

  const discoverNow = async () => {
    setLoading(true);
    const res = await fetch("http://192.168.56.110:8000/discover", {
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
        placeholder="IP"
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
