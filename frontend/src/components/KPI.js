// VERSION ALPHA
// src/components/KPI.js
import React, { useEffect, useState } from "react";
import { fetchKPI } from "../api/assets.api";

export default function KPI() {
  const [kpi, setKpi] = useState({ total: 0, non_compliant: 0, conformity: 0 });
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchKPI()
      .then(setKpi)
      .catch(err => setError(err.message));
  }, []);

  if (error) return <p style={{ color: "red" }}>Erreur : {error}</p>;

  return (
    <div>
      <h2>KPI</h2>
      <p>Total Assets: {kpi.total}</p>
      <p>Non-compliant: {kpi.non_compliant}</p>
      <p>Conformity: {kpi.conformity}%</p>
    </div>
  );
}

