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

  useEffect(() => {
    fetch("http://192.168.56.110:8000/api/assets") 
      .then((res) => res.json()) 
      .then(setAssets)
      .catch((err) => console.error("Error fetching assets:", err));
  }, []);

  /* =========================
     FILTER LOGIC
  ========================= */
	const filteredAssets = assets.filter((a) => {
    if (!searchTerm) return true;

    const term = searchTerm.toLowerCase();

    return (
      a.hostname?.toLowerCase().includes(term) ||
      a.ip?.toLowerCase().includes(term)
    );
  });
	
	const totalPages = Math.ceil(total / limit);

  return (
    <div>
      <h2>Liste des actifs</h2>

      {filteredAssets.length === 0 ? (
        <p>Aucun actif trouvé</p>
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
            {filteredAssets.map((a) => (
              <tr key={`${a.hostname}-${a.ip}`}>
                <td>{a.hostname}</td>
                <td>{a.os}</td>
                <td>{a.status}</td>
                <td>{a.source || "manual"}</td>
                <td>{a.ip}</td>
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

