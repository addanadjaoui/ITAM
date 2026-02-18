import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import AssetsTable from "./AssetsTable";

const API = "http://192.168.56.110:8000/api/assets";
const LIMIT = 10;

export default function AssetList({ searchTerm = "" }) {
  const [assets, setAssets] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchParams, setSearchParams] = useSearchParams();

  /* ================= URL STATE ================= */
  const page = parseInt(searchParams.get("page") || "1", 10);

  const sorts = useMemo(() => {
    const s = searchParams.get("sort");
    if (!s) return [];
    return s.split(",").map((x) => {
      const [field, order] = x.split(":");
      return { field, order };
    });
  }, [searchParams]);

  /* ================= FETCH (backend-ready) ================= */
  useEffect(() => {
    async function loadAssets() {
      try {
        setLoading(true);
        setError(null);

        // ⬇️ demain: API?page=X&limit=Y&sort=a:asc,b:desc
        const res = await fetch(API);
        const data = await res.json();

        setAssets(data);
        setTotal(data.length);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    loadAssets();
  }, []);

  /* ================= CLIENT FILTER ================= */
  const filteredAssets = useMemo(() => {
    if (!searchTerm) return assets;
    const t = searchTerm.toLowerCase();
    return assets.filter(
      (a) =>
        a.hostname?.toLowerCase().includes(t) ||
        a.ip_address?.toLowerCase().includes(t)
    );
  }, [assets, searchTerm]);

  /* ================= CLIENT SORT (temp) ================= */
  const sortedAssets = useMemo(() => {
    if (!sorts.length) return filteredAssets;
    return [...filteredAssets].sort((a, b) => {
      for (const { field, order } of sorts) {
        const v1 = a[field] ?? "";
        const v2 = b[field] ?? "";
        if (v1 < v2) return order === "asc" ? -1 : 1;
        if (v1 > v2) return order === "asc" ? 1 : -1;
      }
      return 0;
    });
  }, [filteredAssets, sorts]);

  /* ================= CLIENT PAGINATION (temp) ================= */
  const totalPages = Math.max(1, Math.ceil(sortedAssets.length / LIMIT));

  const paginatedAssets = useMemo(() => {
    const start = (page - 1) * LIMIT;
    return sortedAssets.slice(start, start + LIMIT);
  }, [sortedAssets, page]);

  /* ================= URL HELPERS ================= */
  const updateParams = useCallback(
    (params) => setSearchParams(params, { replace: false }),
    [setSearchParams]
  );

  const handlePageChange = useCallback(
    (p) => {
      const params = new URLSearchParams(searchParams);
      params.set("page", p);
      updateParams(params);
    },
    [searchParams, updateParams]
  );

  const handleSortChange = useCallback(
    (field, multi) => {
      let next = [];
      const existing = sorts.find((s) => s.field === field);

      if (!multi) {
        next = [
          { field, order: existing?.order === "asc" ? "desc" : "asc" },
        ];
      } else {
        if (!existing) {
          next = [...sorts, { field, order: "asc" }];
        } else {
          next = sorts.map((s) =>
            s.field === field
              ? { ...s, order: s.order === "asc" ? "desc" : "asc" }
              : s
          );
        }
      }

      const params = new URLSearchParams(searchParams);
      params.set(
        "sort",
        next.map((s) => `${s.field}:${s.order}`).join(",")
      );
      params.set("page", 1);
      updateParams(params);
    },
    [sorts, searchParams, updateParams]
  );

  if (loading) return <p>Chargement…</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h2>Liste des actifs</h2>

      <AssetsTable
        assets={paginatedAssets}
        sorts={sorts}
        onSortChange={handleSortChange}
      />

      <div style={{ marginTop: 10 }}>
        <button disabled={page === 1} onClick={() => handlePageChange(page - 1)}>
          ◀
        </button>
        <span style={{ margin: "0 10px" }}>
          Page {page} / {totalPages}
        </span>
        <button
          disabled={page === totalPages}
          onClick={() => handlePageChange(page + 1)}
        >
          ▶
        </button>
      </div>
    </div>
  );
}

