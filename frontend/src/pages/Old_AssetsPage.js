import { useState } from "react";
import useAssets from "../hooks/useAssets";

export default function AssetsPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  const { assets, total, loading, error } = useAssets(search, page, limit);

  const pages = Math.ceil(total / limit);

  return (
    <>
      <input
        placeholder="Rechercher hostname or @IP..."
        value={search}
        onChange={(e) => {
          setPage(1);
          setSearch(e.target.value);
        }}
      />

      {loading && <p>Chargement...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <table>
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
        <tbody>
          {assets.map((a) => (
            <tr key={a.id}>
              <td>{a.hostname}</td>
              <td>{a.ip_address}</td>
              <td>{a.os}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <button disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
        ◀
      </button>
      <span>
        {" "}
        {page} / {pages}{" "}
      </span>
      <button disabled={page === pages} onClick={() => setPage((p) => p + 1)}>
        ▶
      </button>
    </>
  );
}

