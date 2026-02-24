// VERSION ALPHA
import { apiFetch } from "./http";

export const fetchKPI = () => {
  return apiFetch("/kpi");
};

