import React from "react";

export default function AssetsTable({ assets }) {
  if (!assets || assets.length === 0) {
    return (
      <p
        style={{
          textAlign: "center",
          padding: "14px",
          background: "#f9fafb",
          border: "1px dashed #d1d5db",
          borderRadius: "6px",
          color: "#ef4444",
        }}
      >
        Aucun actif trouvé
      </p>
    );
  }

  return (
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
        {assets.map((a) => (
          <tr key ={`${a.hostname}-${a.ip_address}`}>
            <td>{a.hostname}</td>
            <td>{a.os}</td>
            <td>{a.status}</td>
            <td>{a.source || "manual"}</td>
            <td>{a.ip_address}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

