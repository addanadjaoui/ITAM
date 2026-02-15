import React, { useEffect, useState } from "react";

const API = "http://192.168.56.110:8000/api/assets";

export default function AssetList({ searchTerm = "" }) {
  const [assets, setAssets] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);

  const [sortEnabled, setSortEnabled] = useState(false);
  const [sortField, setSortField] = useState("hostname");
  const [sortOrder, setSortOrder] = useState("asc");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

	useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API}`);
        setAssets(await res.json());
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);


/*	useEffect(() => {
  const fetchAssets = async () => {
    try {
      const res = await fetch(API);

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      setAssets(data);
    } catch (err) {
      console.error("Error fetching assets:", err);
    }
  };

  fetchAssets();
}, []);*/

  /*useEffect(() => {
    fetchAssets();
  }, [searchTerm, page, sortEnabled, sortField, sortOrder]);

  const fetchAssets = async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        search: searchTerm,
        page,
        limit,
      });

      if (sortEnabled) {
        params.append("sort", sortField);
        params.append("order", sortOrder);
      }

      const res = await fetch(`${API}?${params.toString()}`);

      if (!res.ok) {
        throw new Error("Erreur backend");
      }

      const data = await res.json();

      setAssets(Array.isArray(data.data) ? data.data : []);
      setTotal(typeof data.total === "number" ? data.total : 0);
    } catch (err) {
      console.error(err);
      setError("Impossible de charger les actifs");
      setAssets([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };*/

  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <div>
      <h2>Liste des actifs</h2>

      {/* ===== SORT OPTIONS ===== */}
      <div style={{ marginBottom: 10 }}>
        <label>
          <input
            type="checkbox"
            checked={sortEnabled}
            onChange={() => {
              setSortEnabled((v) => !v);
              setPage(1);
            }}
          />
          Activer le tri
        </label>

        {sortEnabled && (
          <>
            <select
              value={sortField}
              onChange={(e) => {
                setSortField(e.target.value);
                setPage(1);
              }}
            >
              <option value="hostname">Hostname</option>
              <option value="ip">IP</option>
              <option value="os">OS</option>
              <option value="status">Status</option>
            </select>

            <select
              value={sortOrder}
              onChange={(e) => {
                setSortOrder(e.target.value);
                setPage(1);
              }}
            >
              <option value="asc">Asc</option>
              <option value="desc">Desc</option>
            </select>
          </>
        )}
      </div>

      {/* ===== STATES ===== */}
      {loading && <p>Chargement...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !error && assets.length === 0 && (
        <p>Aucun actif trouvé</p>
      )}

      {!loading && !error && assets.length > 0 && (
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
            {assets.map((a, i) => (
              <tr key={`${a.hostname || "h"}-${a.ip_address || "ip"}-${i}`}>
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
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
        >
          ◀
        </button>

        <span style={{ margin: "0 10px" }}>
          Page {page} / {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage((p) => p + 1)}
        >
          ▶
        </button>
      </div>
     </div>
  );
}

