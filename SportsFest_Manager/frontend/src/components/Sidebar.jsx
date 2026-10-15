import { NavLink } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand">
        <span className="brand-icon">S</span>
        <div>
          <h2>SportsFest</h2>
          <small>MANAGER</small>
        </div>
      </div>

      <p className="nav-heading">MAIN MENU</p>

      <nav>
        <NavLink to="/" end>
          <span>▦</span> Dashboard
        </NavLink>

        <NavLink to="/events">
          <span>⚽</span> Manage Events
        </NavLink>

        <NavLink to="/results">
          <span>🏆</span> Results & Leaderboard
        </NavLink>
      </nav>

      <div className="sidebar-bottom">
        <span className="status-dot"></span>
        Local database
        <small>MongoDB</small>
      </div>
    </aside>
  );
}