import React, { useEffect, useState } from "react";

export default function App() {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadAssets = () => {
    fetch("http://192.168.56.110:8000/assets")
      .then(r => r.json())
      .then(setAssets);
  };

  const discoverNow = async () => {
    setLoading(true);
    const res = await fetch("http://192.168.56.110:8000/discover", {
      method: "POST"
    });
    const data = await res.json();
    alert(`Découverte terminée : ${data.discovered} assets`);
    setAssets(data.assets);
    setLoading(false);
  };

  useEffect(loadAssets, []);

  return (
    <div style={{padding:20}}>

      <button onClick={discoverNow} disabled={loading}>
        {loading ? "Découverte en cours..." : "Découvrir les assets (AD)"}
      </button>

    </div>
  );
}

