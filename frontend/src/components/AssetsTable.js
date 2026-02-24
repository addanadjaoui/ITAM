/**
 * ITAM Enterprise Frontend
 * File: AssetsTable.js
 * Version: Alpha v0.1.0
 * Status: Experimental
 * Features:
 * - Affichage tableau
 * - Tri par clic sur colonnes
 * - Édition inline via EditableCell
 */

// VERSION ALPHA gestion du tri multi-cololnnes
// src/components/AssetsTable.js
import React from "react";
import EditableCell from "./EditableCell";

export default function AssetsTable({ assets, sorts, onSortChange, refresh }) {
  const handleSort = (field) => {
    const existing = sorts.find((s) => s.field === field);
    let newOrder = "asc";
    if (existing) newOrder = existing.order === "asc" ? "desc" : "asc";
    onSortChange([{ field, order: newOrder }]);
  };

  return (
    <table className="assets-table" border="1" cellPadding="5" style={{ borderCollapse: "collapse", width: "100%" }}>
      <thead>
        <tr>
          {["hostname", "ip_address", "os", "status", "source"].map((col) => (
            <th key={col} onClick={() => handleSort(col)} style={{ cursor: "pointer" }}>
              {col.charAt(0).toUpperCase() + col.slice(1)}{" "}
              {sorts[0]?.field === col ? (sorts[0].order === "asc" ? "⇅" : "⇵") : ""}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {assets.map((asset) => (
          <tr key={asset.id}>
            <EditableCell asset={asset} field="hostname" refresh={refresh} />
            <EditableCell asset={asset} field="ip_address" refresh={refresh} />
            <EditableCell asset={asset} field="os" refresh={refresh} />
            <EditableCell asset={asset} field="status" refresh={refresh} />
            <EditableCell asset={asset} field="source" refresh={refresh} />
          </tr>
        ))}
      </tbody>
    </table>
  );
}

