/**
 * ITAM Enterprise Frontend
 * File: AssetList.js
 * Version: Alpha v0.1.0
 * Status: Experimental
 * Features:
 * - Pagination
 * - Tri (1 colonne)
 * - Sync URL (page, sort)
 * - Choix du nombre de lignes
 */


// VERSION ALPHA MULTI-TRI Compatible Backend
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import AssetsTable from "./AssetsTable";
import { API_BASE_URL } from "../api/config";

export default function AssetList({ searchTerm = "" }) {
  const [assets, setAssets] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchParams, setSearchParams] = useSearchParams();
  const pageFromUrl = parseInt(searchParams.get("page")) || 1;
  const [page, setPage] = useState(pageFromUrl);

  // tri multi-colonnes
  const sortFromUrl = searchParams.get("sort");
  const [sorts, setSorts] = useState(
    sortFromUrl
      ? sortFromUrl.split(",").map((s) => {
          if (s.startsWith("-")) return { field: s.slice(1), order: "desc" };
          return { field: s, order: "asc" };
        })
      : [{ field: "hostname", order: "asc" }]
  );

  const [limit, setLimit] = useState(10);
  const totalPages = Math.ceil(total / limit);

  // í ½í´„ Charger assets
  useEffect(() => {
    async function loadAssets() {
      try {
        setLoading(true);
        setError(null);

        // GÃ©nÃ©rer string compatible backend
        const sortParam = sorts
          .map((s) => (s.order === "desc" ? `-${s.field}` : s.field))
          .join(",");

        const res = await fetch(
          `${API_BASE_URL}/assets?page=${page}&limit=${limit}&sort=${sortParam}&search=${searchTerm}`
        );
        const data = await res.json();
        setAssets(data.data || []);
        setTotal(data.total || 0);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadAssets();
  }, [page, sorts, searchTerm, limit]);

  // Pagination
  const handlePageChange = (newPage) => {
    setPage(newPage);
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage);
    if (sorts.length) {
      params.set(
        "sort",
        sorts.map((s) => (s.order === "desc" ? `-${s.field}` : s.field)).join(",")
      );
    }
    setSearchParams(params);
  };

  // Changement du tri
  const handleSortChange = (newSorts) => {
    setSorts(newSorts);
    const params = new URLSearchParams(searchParams);
    params.set(
      "sort",
      newSorts.map((s) => (s.order === "desc" ? `-${s.field}` : s.field)).join(",")
    );
    params.set("page", page);
    setSearchParams(params);
  };

  // Limite
  const handleLimitChange = (e) => {
    setLimit(parseInt(e.target.value));
    setPage(1);
  };

  if (loading) return <p style={{ color: "green" }}>Chargement des assets...</p>;
  if (error) return <p style={{ color: "red" }}>Erreur : {error}</p>;

  return (
    <div>
      <h2>Liste des actifs</h2>
      <p>Total : {total}</p>

      <label>
        Lignes par page:
        <select value={limit} onChange={handleLimitChange}>
          {[5, 10, 20, 50].map((l) => (
            <option key={l} value={l}>{l}</option>
          ))}
        </select>
      </label>

      <AssetsTable
        assets={assets}
        sorts={sorts}
        onSortChange={handleSortChange}
        refresh={() => setPage(page)}
      />

      <div style={{ marginTop: 10 }}>
        <button disabled={page === 1} onClick={() => handlePageChange(page - 1)}>â—€</button>
        <span style={{ margin: "0 10px" }}>Page {page} / {totalPages}</span>
        <button disabled={page === totalPages} onClick={() => handlePageChange(page + 1)}>â–¶</button>
      </div>
    </div>
  );
}

