import React from "react";

export default function AssetsTable({ assets, sorts, onSortChange }) {
  const indicator = (field) => {
    const i = sorts.findIndex((s) => s.field === field);
    if (i === -1) return "";
    return sorts[i].order === "asc" ? ` ▲${i + 1}` : ` ▼${i + 1}`;
  };

  return (
    <table className="assets-table">
      <thead>
        <tr>
          <th onClick={(e) => onSortChange("hostname", e.shiftKey)}>
            Hostname{indicator("hostname")}
          </th>
          <th onClick={(e) => onSortChange("os", e.shiftKey)}>
            OS{indicator("os")}
          </th>
          <th onClick={(e) => onSortChange("status", e.shiftKey)}>
            Status{indicator("status")}
          </th>
          <th>Source</th>
          <th onClick={(e) => onSortChange("ip_address", e.shiftKey)}>
            IP{indicator("ip_address")}
          </th>
        </tr>
      </thead>
      <tbody>
        {assets.map((a) => (
          <tr key={`${a.hostname}-${a.ip_address}`}>
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

