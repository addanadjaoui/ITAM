import React, { useEffect, useState } from "react";

const API = "http://192.168.56.110:8000/api/assets";

export default function KPI() {
   const [kpi, setKpi] = useState({
    total: 0,
    non_compliant: 0,
    conformity: 0,
  });

  useEffect(() => {
    fetch(API)
      .then(res => {
        if (!res.ok) throw new Error("API unreachable");
        return res.json();
      })
      .then(response => {
        const assets = Array.isArray(response.data) ? response.data : [];

        const total = response.total ?? assets.length;
        const non_compliant = assets.filter(
          a => a.status !== "in_use"
        ).length;

        const conformity =
          total > 0
            ? Math.round(((total - non_compliant) / total) * 100)
            : 0;

        setKpi({ total, non_compliant, conformity });
      })
      .catch(err => {
        console.error("KPI error:", err);
        setKpi({ total: 0, non_compliant: 0, conformity: 0 });
      });
  }, []);

  return (
     <div>
      <h2>KPI</h2>
      <p>Total Assets: {kpi.total}</p>
      <p>Non-compliant: {kpi.non_compliant}</p>
      <p>Conformity: {kpi.conformity}%</p>
    </div>
  );
}

