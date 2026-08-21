import { NavLink, useNavigate } from "react-router-dom";
import Button from "@visa/nova-react/button";
import { useAuth } from "../../context/useAuth";

function Navbar() {
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  return (
    <header className="top-nav">
      <div className="top-nav-inner">
        <h2>Kudos</h2>

        <nav className="nav-links">
          <NavLink className={getLinkClass} to="/dashboard">
            Dashboard
          </NavLink>
          <NavLink className={getLinkClass} to="/give-kudos">
            Give Kudos
          </NavLink>
          <NavLink className={getLinkClass} to="/leaderboard">
            Leaderboard
          </NavLink>
          <NavLink className={getLinkClass} to="/profile">
            Profile
          </NavLink>
          {user?.role === "admin" && (
            <NavLink className={getLinkClass} to="/admin">
              Admin
            </NavLink>
          )}
        </nav>

        <Button
          className="secondary-button"
          type="button"
          onClick={handleLogout}
        >
          Logout
        </Button>
      </div>
    </header>
  );
}

function getLinkClass({ isActive }) {
  if (isActive) {
    return "nav-link nav-link-active";
  }

  return "nav-link";
}

export default Navbar;
