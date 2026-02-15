import React, { useEffect, useState } from "react";
import AssetsTable from "./AssetsTable";

const API = "http://192.168.56.110:8000/api/assets";

export default function AssetList({ searchTerm = "" }) {
  const [assets, setAssets] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [sortEnabled, setSortEnabled] = useState(false);
  const [sortField, setSortField] = useState("hostname");
  const [sortOrder, setSortOrder] = useState("asc");

  /* =========================
     FETCH ASSETS
  ========================= */
  useEffect(() => {
    const controller = new AbortController();

    async function loadAssets() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(API, { signal: controller.signal });
        const data = await res.json();

        setAssets(data);
        setTotal(data.length); // pagination backend plus tard
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    }

    loadAssets();
    return () => controller.abort();
  }, []);

  /* =========================
     FILTER
  ========================= */
  const filteredAssets = assets.filter((a) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();

    return (
      a.hostname?.toLowerCase().includes(term) ||
      a.ip_address?.toLowerCase().includes(term)
    );
  });

  /* =========================
     SORT
  ========================= */
  const sortedAssets = [...filteredAssets].sort((a, b) => {
    if (!sortEnabled) return 0;

    const v1 = a[sortField] || "";
    const v2 = b[sortField] || "";

    return sortOrder === "asc"
      ? v1.localeCompare(v2)
      : v2.localeCompare(v1);
  });

  /* =========================
     PAGINATION (frontend temporaire)
  ========================= */
  const start = (page - 1) * limit;
  const paginatedAssets = sortedAssets.slice(start, start + limit);
  const totalPages = Math.ceil(sortedAssets.length / limit);

  /* =========================
     RENDER STATES
  ========================= */
  if (loading) return <p style={{ color: "green" }}>Chargement des assets...</p>;
  if (error) return <p style={{ color: "red" }}>Erreur : {error}</p>;

  return (
    <div>
      <h2>Liste des actifs</h2>
      <p>Nombre total : {sortedAssets.length}</p>

      {/* ===== SORT OPTIONS ===== */}
      <div style={{ marginBottom: 10 }}>
        <label>
          <input
            type="checkbox"
            checked={sortEnabled}
            onChange={() => setSortEnabled((v) => !v)}
          />
          Activer le tri
        </label>

        {sortEnabled && (
          <>
            <select
              value={sortField}
              onChange={(e) => setSortField(e.target.value)}
            >
              <option value="hostname">Hostname</option>
              <option value="ip_address">IP</option>
              <option value="os">OS</option>
              <option value="status">Status</option>
            </select>

            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="asc">Asc</option>
              <option value="desc">Desc</option>
            </select>
          </>
        )}
      </div>

      {/* ===== TABLE ===== */}
      <AssetsTable assets={paginatedAssets} />

      {/* ===== PAGINATION ===== */}
      <div style={{ marginTop: 10 }}>
        <button disabled={page === 1} onClick={() => setPage(p => p - 1)}>
          ◀
        </button>

        <span style={{ margin: "0 10px" }}>
          Page {page} / {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage(p => p + 1)}
        >
          ▶
        </button>
      </div>
    </div>
  );
}

