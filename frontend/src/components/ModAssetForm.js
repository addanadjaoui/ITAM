import React, { useState } from "react";

export default function ModAssetForm() {
  const [hostname, setHostname] = useState("");
  const [ip_address, setIp] = useState("");
  const [type, setType] = useState("");
  const [os, setOs] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    await fetch("http://192.168.56.110:8000/assets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ hostname, type, ip_address, os }),
    });
    alert("Asset ajouté !");
  };

  return (
    <form onSubmit={submit}>
      <h3>Modifier un Asset</h3>
      <div className="form-row">
        <input
          placeholder="Hostname"
          value={hostname}
          onChange={(e) => setHostname(e.target.value)}
        />
        <input
          placeholder="IP"
          value={ip_address}
          onChange={(e) => setIp(e.target.value)}
        />
        <input
          placeholder="Type"
          value={type}
          onChange={(e) => setType(e.target.value)}
        />
        <input
          placeholder="OS"
          value={os}
          onChange={(e) => setOs(e.target.value)}
        />
        <button type="submit">Modifier</button>
      </div>
    </form>
  );
}
