// frontend/src/services/assetsService.js

const API_BASE = "http://192.168.56.110:8000/api";

/**
 * GET /assets
 */
export async function getAssets({
  search = "",
  page = 1,
  limit = 10,
  sort = null,
  order = "asc",
  signal,
} = {}) {
  const params = new URLSearchParams({
    search,
    page,
    limit,
  });

  if (sort) {
    params.append("sort", sort);
    params.append("order", order);
  }

  /*const res = await fetch(`${API_BASE}/assets?${params.toString()}`, {
    method: "GET",
    signal,
  });*/
  const res = await fetch(`${API_BASE}/assets?${params}`, { signal });

  if (!res.ok) {
    throw new Error(`Assets fetch failed (${res.status})`);
  }

  return res.json();
}

/**
 * POST /assets
 */
export async function createAsset(asset) {
  const res = await fetch(`${API_BASE}/assets`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(asset),
  });

  if (!res.ok) {
    throw new Error("Create asset failed");
  }

  return res.json();
}

/**
 * PUT /assets/:id
 */
export async function updateAsset(id, asset) {
  const res = await fetch(`${API_BASE}/assets/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(asset),
  });

  if (!res.ok) {
    throw new Error("Update asset failed");
  }

  return res.json();
}

/**
 * DELETE /assets/:id
 */
export async function deleteAsset(id) {
  const res = await fetch(`${API_BASE}/assets/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error("Delete asset failed");
  }

  return true;
}

/**
 * POST /discovery/on-demand
 */
export async function discoverOnDemand(ip, agent) {
  const res = await fetch(
    `${API_BASE}/discovery/on-demand?ip=${ip}&agent=${agent}`,
    { method: "POST" }
  );

  if (!res.ok) {
    throw new Error("Discovery failed");
  }

  return res.json();
}

