import { useEffect, useState } from "react";
import { fetchAssets, createAsset, updateAsset, deleteAsset, discoverOnDemand } from "../api/assets.service";

export default function useAssets(search, page, limit) {
  const [assets, setAssets] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    const load = async () => {
      setLoading(true);
      setError(null);

      try {
        const result = await fetchAssets({
          search,
          page,
          limit,
          signal: controller.signal,
        });

        setAssets(result.data);
        setTotal(result.total);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    load();

    return () => controller.abort();
  }, [search, page, limit]);

  return { assets, total, loading, error };
}

const addAsset = async (asset) => {
  await createAsset(asset);
  refresh();
};

const editAsset = async (id, asset) => {
  await updateAsset(id, asset);
  refresh();
};

const removeAsset = async (id) => {
  await deleteAsset(id);
  refresh();
};

const discover = async (target) => {
  await discoverOnDemand(target);
  refresh();
};

