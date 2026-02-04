import React, { useEffect, useState } from "react";

export default function KPI() {
  const [kpi, setKpi] = useState({});

  useEffect(() => {
    fetch("http://192.168.56.110:8000/api/assets")
      .then(res => res.json())
      .then(data => {
        const total = data.length;
        const non_compliant = data.filter(a => a.status !== "in_use").length;
        setKpi({ total, non_compliant, conformity: Math.round((total - non_compliant)/total*100) });
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

