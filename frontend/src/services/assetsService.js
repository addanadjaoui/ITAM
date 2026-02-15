const API = "http://192.168.56.110:8000/api/assets";

export async function fetchAssets() {
  const res = await fetch(API);
  if (!res.ok) throw new Error("Erreur lors du chargement des assets");
  return res.json();
}

