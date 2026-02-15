import React, { useEffect, useState } from "react";
import { getAssets } from "../api/assetsService";

const API = "http://192.168.56.110:8000/api/assets";

export default function AssetList({ searchTerm = "" }) {
  const [assets, setAssets] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState("");
  const [total, setTotal] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [sortEnabled, setSortEnabled] = useState(false);
  const [sortField, setSortField] = useState("hostname");
  const [sortOrder, setSortOrder] = useState("asc");


  /* useEffect(() => {
    (async () => {
      try {
        const res = await fetch("http://192.168.56.110:8000/api/assets");
         setAssets(await res.json());
      } catch (e) {
        console.error(e);
       }
     })();
  }, []); */

  {/*useEffect(() => {
     const loadAssets = async () => { 
    const data = await getAssets();
    console.log('data:',{data});
    setAssets(data);
    console.log('asstes:', assets);
    setTotal(data.total);
    console.log('total:',{total});
  };

  loadAssets();
}, []);*/}

	useEffect(() => {
  const controller = new AbortController();

  async function loadAssets() {
    try {
      setLoading(true);
      setError(null);

      console.log("Fetching assets from API...");

      const res = await fetch(`${API}`);
      const data = await res.json();

      console.log("API response:", data); // ✅ LOG API

      setAssets(data);
      setTotal(data.length);    // provisoir si pas de pagination
      console.log(`data.length is :${data.length}`);

      {/*console.log(`AssetList called with assets: ${assets.json()}, Page : ${page}, limit: ${limit}, search: ${search}`);
      const res = await getAssets({
        page,
        limit,
        search,
        signal: controller.signal
      });
      
      setAssets(await res.json());*/}
      /*setAssets(res.data);
       setTotal(res.total);*/
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
}, [page, search, page, sortEnabled, sortField, sortOrder]);
 
/* =========================
     LOG ASSETS STATE CHANGES
  ========================= */
  useEffect(() => {
    console.log("Assets state updated:", assets);
    console.log("Assets count:", assets.length);
  }, [assets]);

  if (loading) {
    return <p style={{ color: "green" }}>Chargement des assets...</p>;
  }

  if (error) {
    return <p style={{ color: "red" }}>Erreur : {error}</p>;
  }


  const totalPages = Math.ceil(total / limit);
  console.log(`total :${total}`);
  console.log(`totalPage :${totalPages}`);
  

  /* =========================
     FILTER LOGIC
  ========================= */
  const filteredAssets = assets.filter((a) => {
    if (!searchTerm) return true;

    const term = searchTerm.toLowerCase();

    return (
      a.hostname?.toLowerCase().includes(term) ||
      a.ip_address?.toLowerCase().includes(term)
    ); 
  });

  return (
    <div >
      <h2 >Liste des actifs</h2>
      <p>Number of Assets: {assets.length}</p>

      {/* ===== SORT OPTIONS ===== */}
      <div style={{ marginBottom: 10 }}>
        <label>
          < input
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
              <option value="ip">IP</option>
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

      {filteredAssets.length === 0 ? (
        <p style={{
             alignItems: "center",
             textAlign: "center",
             padding: "14px",
             background: "#f9fafb",
             border: "1px dashed #d1d5db",
             borderRadius: "6px",
             color: "red",
             //color: "#6b7280",
           }}
        >
          Aucun actif trouvé</p>
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
              <tr  key={`${a.hostname}-${a.ip_address}`}>
                <td >{a.hostname}</td>
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

