import KPI from "../components/KPI";
import AssetList from "../components/AssetList";
import { useAppContext } from "../context/AppContext";

export default function AssetsPage() {
  const { searchTerm } = useAppContext();

  return (
    <>
      <div className="stats-grid" style={{ padding: 30 }}>
        <div className="stat-card">
          <KPI />
          <div className="stat-label">Actifs</div>
        </div>
      </div>

      <AssetList searchTerm={searchTerm} />
    </>
  );
}

