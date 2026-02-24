// VERSION ALPHA
// src/api/assets.api.js
import { apiFetch } from "./http";

export const fetchAssets = (params = {}) => {
  return apiFetch(`/assets?${new URLSearchParams(params)}`);
};

export const updateAsset = (id, payload) => {
  return apiFetch(`/assets/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
};

export const fetchKPI = () => {
  return apiFetch("/kpi");
};

