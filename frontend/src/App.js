import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./layout/MainLayout";


import AssetsPage from "./pages/AssetsPage";
import DiscoverPage from "./pages/DiscoverPage";
import DeployPage from "./pages/DeployPage";

//import "./app.css";


export default function App() {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<Navigate to="/assets" replace />} />
        <Route path="/assets" element={<AssetsPage />} />
        <Route path="/discover" element={<DiscoverPage />} />
        <Route path="/deploy" element={<DeployPage />} />
        {/* Ì†ΩÌ¥ê Catch-all pour √©viter les 404 */}
        <Route path="*" element={<Navigate to="/assets" replace />} />
      </Routes>
    </MainLayout>
  );
}

