import { NavLink, useLocation } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import useAnimatedNumber from "../hooks/useAnimatedNumber";
import { useAchievements } from "../context/AchievementContext";
import "./Navbar.css";

const gameItems = [
  { to: "/roulette",  label: "Roulette",  icon: "🎡" },
  { to: "/slots",     label: "Slots",     icon: "🎰" },
  { to: "/blackjack", label: "Blackjack", icon: "🃏" },
  { to: "/crash",     label: "Crash",     icon: "📈" },
  { to: "/mines",     label: "Mines",     icon: "💣" },
  { to: "/plinko",   label: "Plinko",    icon: "📍" },
];

function Navbar({ balance, onResetBalance }) {
  const animatedBalance = useAnimatedNumber(balance);
  const { unlocked, achievements } = useAchievements();
  const location = useLocation();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking/touching outside
  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("touchstart", handleClick);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("touchstart", handleClick);
    };
  }, []);

  // Close dropdown on route change
  useEffect(() => { setDropdownOpen(false); }, [location.pathname]);

  const isGameActive = gameItems.some(g => location.pathname === g.to);

  return (
    <nav className="navbar">
      <div className="navbar-container">

        {/* Brand */}
        <NavLink to="/" className="navbar-brand">
          <span className="logo-icon">🎰</span>
          <div className="brand-text">
            <span className="brand-name">LuckySpin</span>
            <span className="brand-tag">DEMO</span>
          </div>
        </NavLink>

        {/* Nav links */}
        <ul className="nav-links">
          <li>
            <NavLink to="/" end className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
              <span className="nav-icon">⌂</span>
              <span className="nav-label">Home</span>
            </NavLink>
          </li>

          {/* Games dropdown */}
          <li className="nav-dropdown" ref={dropdownRef}
              onMouseEnter={() => setDropdownOpen(true)}
              onMouseLeave={() => setDropdownOpen(false)}
          >
            <button
              className={`nav-link nav-dropdown-trigger ${isGameActive ? "active" : ""}`}
              onClick={() => setDropdownOpen(prev => !prev)}
              aria-expanded={dropdownOpen}
            >
              <span className="nav-icon">🎮</span>
              <span className="nav-label">Games</span>
              <span className={`dropdown-arrow ${dropdownOpen ? "open" : ""}`}>▾</span>
            </button>

            <ul className={`dropdown-menu ${dropdownOpen ? "show" : ""}`}>
              {gameItems.map(game => (
                <li key={game.to}>
                  <NavLink
                    to={game.to}
                    className={({ isActive }) => `dropdown-item ${isActive ? "active" : ""}`}
                  >
                    <span className="dropdown-item-icon">{game.icon}</span>
                    <span>{game.label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </li>

          <li>
            <NavLink to="/achievements" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
              <span className="nav-icon">🏆</span>
              <span className="nav-label">Achievements</span>
              <span className="nav-badge">{unlocked.length}/{achievements.length}</span>
            </NavLink>
          </li>
        </ul>

        {/* Right: balance */}
        <div className="navbar-right">
          <div className="balance-display">
            <span className="balance-label">Demo Credits</span>
            <span className="balance-amount">${animatedBalance.toFixed(2)}</span>
          </div>
          <button className="btn-reset-balance" onClick={onResetBalance} title="Reset to $1,000">
            🔄
          </button>
          <div className="demo-pill">DEMO</div>
        </div>

      </div>
    </nav>
  );
}

export default Navbar;