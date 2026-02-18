import React from "react";

export default function Pagination({
  page,
  total,
  limit,
  onPageChange,
}) {
  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <div style={{ marginTop: 10, display: "flex", alignItems: "center" }}>
      <button
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
      >
        ◀
      </button>

      <span style={{ margin: "0 10px" }}>
        Page {page} / {totalPages}
      </span>

      <button
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        ▶
      </button>
    </div>
  );
}

