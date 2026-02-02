import React,{useEffect,useState} from "react";
import {createRoot} from "react-dom/client";

function App(){
  const [kpi,setKpi]=useState({});
  const [assets,setAssets]=useState([]);

  useEffect(()=>{
    fetch("http://192.168.56.110:8000/kpi").then(r=>r.json()).then(setKpi);
    fetch("http://192.168.56.110:8000/assets").then(r=>r.json()).then(setAssets);
  },[]);

  return (
    <div style={{padding:30,fontFamily:"Arial"}}>
      <h1>ITAM Dashboard</h1>
      <p>Total assets: {kpi.total_assets}</p>
      <p>Non-compliant: {kpi.non_compliant}</p>
      <p>Conformity: {kpi.conformity}%</p>

      <h2>Assets</h2>
      <ul>{assets.map(a=><li key={a.hostname}>{a.hostname} - {a.os} ({a.status})</li>)}</ul>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App/>);

