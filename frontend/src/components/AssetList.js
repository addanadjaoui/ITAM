import React, { useEffect, useState } from "react";

export default function AssetList() {
  const [assets, setAssets] = useState([]);

  useEffect(() => {
    fetch("http://192.168.56.110:8000/assets")
      .then((res) => res.json())
      .then(setAssets);
  }, []);

  return (
    <div>
      <h2>Liste des actifs</h2>
      <table className="assets-table">
        <thead>
          <tr>
            <th>Hostname</th>
            <th>OS</th>
            <th>Status</th>
            <th>Source</th>
            <th>IP Address</th>
          </tr>
        </thead>
        <tbody>
          {assets?.map((a) => (
            <tr key={a.hostname}>
              <td>{a.hostname}</td>
              <td>{a.os}</td>
              <td>{a.status}</td>
              <td>{a.source || "manual"}</td>
              <td>{a.ip}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
