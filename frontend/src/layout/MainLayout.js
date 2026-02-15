import Header from "../components/Header";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function MainLayout({ children }) {
  return (
    <div className="app-layout">
      <Header />
      <Navbar />

      <main className="content">
        {children}
      </main>

      <Footer />
    </div>
  );
}

