/**
 * ITAM Enterprise Frontend
 * File: EditableCell.js
 * Version: Alpha v0.1.0
 * Status: Experimental
 * Features:
 * - Ã‰dition inline
 * - PATCH backend
 * - Support champs vides
 */

// VERSION ALPHA
// src/components/EditableCell.js
import React, { useState } from "react";
import { updateAsset } from "../api/assets.api";

export default function EditableCell({ asset, field, refresh }) {
  const [value, setValue] = useState(asset[field] || "");
  const [editing, setEditing] = useState(false);

  const handleBlur = async () => {
    setEditing(false);

    if (value === asset[field]) return;

    try {
      // í ½í´¥ ENVOI DE L'OBJET COMPLET
      const payload = {
        hostname: asset.hostname,
        ip_address: asset.ip_address,
        os: asset.os,
        status: asset.status,
        source: asset.source,
        [field]: value, // Ã©crase seulement le champ modifiÃ©
      };

      await updateAsset(asset.id, payload);
      refresh();
    } catch (err) {
      alert("Erreur lors de la mise Ã  jour");
      console.error(err);
      setValue(asset[field] || "");
    }
  };

  return (
    <td onClick={() => setEditing(true)} style={{ cursor: "pointer" }}>
      {editing ? (
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={handleBlur}
          autoFocus
        />
      ) : (
        value || <span style={{ color: "#aaa" }}>â€”</span>
      )}
    </td>
  );
}

