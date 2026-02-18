import React from "react";

export default function AssetsSortBar({
  sortEnabled,
  sortField,
  sortOrder,
  onToggle,
  onFieldChange,
  onOrderChange,
}) {
  return (
    <div style={{ marginBottom: 10 }}>
      <label>
        <input
          type="checkbox"
          checked={sortEnabled}
          onChange={onToggle}
        />
        Activer le tri
      </label>

      {sortEnabled && (
        <>
          <select value={sortField} onChange={onFieldChange}>
            <option value="hostname">Hostname</option>
            <option value="os">OS</option>
            <option value="status">Status</option>
          </select>

          <select value={sortOrder} onChange={onOrderChange}>
            <option value="asc">Asc</option>
            <option value="desc">Desc</option>
          </select>
        </>
      )}
    </div>
  );
}

