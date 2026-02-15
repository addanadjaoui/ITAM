import React, { useEffect, useState } from "react";
import { fetchAssets } from "../services/assetsService";

export default function AssetList({ searchTerm = "" }) {
  const [assets, setAssets] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Tri
  const [sortEnabled, setSortEnabled] = useState(false);
  const [sortField, setSortField] = useState("hostname");
  const [sortOrder, setSortOrder] = useState("asc");

  // Chargement des assets
  useEffect(() => {
    const controller = new AbortController();

    async function loadAssets() {
      try {
        setLoading(true);
        setError(null);

        const data = await fetchAssets();
        setAssets(data);
      } catch (err) {
        if (err.name !== "AbortError") setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadAssets();
    return () => controller.abort();
  }, []);

  if (loading) return <p style={{ color: "green" }}>Chargement des assets...</p>;
  if (error) return <p style={{ color: "red" }}>Erreur : {error}</p>;

  // Filtrage par recherche
  const filteredAssets = assets.filter((a) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      a.hostname?.toLowerCase().includes(term) ||
      a.ip_address?.toLowerCase().includes(term)
    );
  });

  // Tri
  const sortedAssets = sortEnabled
    ? [...filteredAssets].sort((a, b) => {
        const valA = a[sortField] || "";
        const valB = b[sortField] || "";
        if (sortOrder === "asc") return valA > valB ? 1 : -1;
        return valA < valB ? 1 : -1;
      })
    : filteredAssets;

  // Pagination
  const total = sortedAssets.length;
  const totalPages = Math.ceil(total / limit);
  const startIndex = (page - 1) * limit;
  const paginatedAssets = sortedAssets.slice(startIndex, startIndex + limit);

  return (
    <div>
      <h2>Liste des actifs</h2>
      <p>Total Assets: {total}</p>

      {/* ===== SORT OPTIONS ===== */}
      <div style={{ marginBottom: 10 }}>
        <label>
          <input
            type="checkbox"
            checked={sortEnabled}
            onChange={() => setSortEnabled((v) => !v)}
          />{" "}
          Activer le tri
        </label>

        {sortEnabled && (
          <>
            <select value={sortField} onChange={(e) => setSortField(e.target.value)}>
              <option value="hostname">Hostname</option>
              <option value="ip_address">IP</option>
              <option value="os">OS</option>
              <option value="status">Status</option>
            </select>

            <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
              <option value="asc">Asc</option>
              <option value="desc">Desc</option>
            </select>
          </>
        )}
      </div>

      {paginatedAssets.length === 0 ? (
        <p
          style={{
            textAlign: "center",
            padding: 14,
            background: "#f9fafb",
            border: "1px dashed #d1d5db",
            borderRadius: 6,
            color: "red",
          }}
        >
          Aucun actif trouvé
        </p>
      ) : (
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
            {paginatedAssets.map((a) => (
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
      )}

      {/* ===== PAGINATION ===== */}
      <div style={{ marginTop: 10 }}>
        <button disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
          ◀
        </button>
        <span style={{ margin: "0 10px" }}>
          Page {page} / {totalPages || 1}
        </span>
        <button
          disabled={page === totalPages || totalPages === 0}
          onClick={() => setPage((p) => p + 1)}
        >
          ▶
        </button>
      </div>
    </div>
  );
}

