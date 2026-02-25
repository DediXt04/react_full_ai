import "./Navbar.css";

function Navbar({ balance, currentPage, onNavigate }) {
  const navItems = [
    { id: "home",     label: "Home",   icon: "⌂"  },
    { id: "roulette", label: "Roleta", icon: "🎡" },
    { id: "slots",    label: "Slots",  icon: "🎰" },
    { id: "blackjack", label: "Blackjack", icon: "🃏" },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-container">

        {/* Brand */}
        <div className="navbar-brand" onClick={() => onNavigate("home")}>
          <span className="logo-icon">🎰</span>
          <div className="brand-text">
            <span className="brand-name">LuckySpin</span>
            <span className="brand-tag">DEMO</span>
          </div>
        </div>

        {/* Nav links */}
        <ul className="nav-links">
          {navItems.map(item => (
            <li key={item.id}>
              <button
                className={`nav-link ${currentPage === item.id ? "active" : ""}`}
                onClick={() => onNavigate(item.id)}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
                {currentPage === item.id && <span className="nav-active-bar" />}
              </button>
            </li>
          ))}
        </ul>

        {/* Right: balance */}
        <div className="navbar-right">
          <div className="balance-display">
            <span className="balance-label">Créditos Demo</span>
            <span className="balance-amount">${balance.toFixed(2)}</span>
          </div>
          <div className="demo-pill">DEMO</div>
        </div>

      </div>
    </nav>
  );
}

export default Navbar;