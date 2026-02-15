import { NavLink } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

export default function Navbar() {
  const { searchTerm, setSearchTerm } = useAppContext();

  return (
    <nav className="navbar background">
      <ul className="nav-list">
        <li>
          <NavLink to="/assets" className="nav-item">
            Inventaire
          </NavLink>
        </li>
        <li>
          <NavLink to="/discover" className="nav-item">
            Découvert
          </NavLink>
        </li>
        <li>
          <NavLink to="/deploy" className="nav-item">
            Deployment
          </NavLink>
        </li>
      </ul>

      <div className="rightNav">
        <input
          placeholder="Search hostname or IP..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
    </nav>
  );
}






