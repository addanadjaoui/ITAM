import logo from "../images/djezzy.png";

export default function Header() {
  return (
    <header className="header">
      <div className="header-content">
        <img src={logo} alt="ITAM Logo" className="logo" />
        <div>
          <h1>ITAM Enterprise</h1>
          <p className="subtitle">Gestion des actifs IT pour entreprise</p>
        </div>
      </div>
    </header>
  );
}

