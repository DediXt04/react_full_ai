import { Link } from "react-router-dom";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">

        {/* Top grid */}
        <div className="footer-grid">

          {/* Brand col */}
          <div className="footer-col footer-brand-col">
            <Link to="/" className="footer-logo">
              <span className="footer-logo-icon">🎰</span>
              <div className="footer-brand-text">
                <span className="footer-brand-name">LuckySpin</span>
                <span className="footer-brand-tag">DEMO</span>
              </div>
            </Link>
            <p className="footer-tagline">
              Fictional platform created for educational and entertainment purposes. No real money involved.
            </p>
            <div className="social-links">
              {[
                { icon: "f",   label: "Facebook" },
                { icon: "𝕏",  label: "Twitter"  },
                { icon: "📷",  label: "Instagram"},
                { icon: "💬",  label: "Discord"  },
              ].map(s => (
                <a key={s.label} href="#" className="social-icon" title={s.label} aria-label={s.label}>
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div className="footer-col">
            <h4 className="footer-heading">Navigation</h4>
            <ul className="footer-links">
              {[
                { label: "Home",         to: "/"              },
                { label: "Roulette",     to: "/roulette"      },
                { label: "Slots",        to: "/slots"         },
                { label: "Blackjack",    to: "/blackjack"     },
                { label: "Crash",        to: "/crash"         },
                { label: "Mines",        to: "/mines"         },
                { label: "Achievements", to: "/achievements"  },
              ].map(l => (
                <li key={l.to}>
                  <Link to={l.to} className="footer-link">
                    <span className="footer-link-arrow">›</span> {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Games */}
          <div className="footer-col">
            <h4 className="footer-heading">Games</h4>
            <ul className="footer-links">
              <li><span className="footer-link-static">🎡 European Roulette</span></li>
              <li><span className="footer-link-static">🎰 3-Reel Slot Machine</span></li>
              <li><span className="footer-link-static">🃏 Blackjack</span></li>
              <li><span className="footer-link-static">📈 Crash</span></li>
              <li><span className="footer-link-static">💣 Mines</span></li>
            </ul>
          </div>

          {/* Disclaimer */}
          <div className="footer-col">
            <h4 className="footer-heading">⚠️ Warning</h4>
            <p className="footer-disclaimer">
              This is a <strong>demo project</strong> for educational purposes only.
              No real transactions occur. All balances are fictional credits.
              <br /><br />
              This is not a real gambling platform.
            </p>
          </div>

        </div>

        {/* Divider */}
        <div className="footer-divider" />

        {/* Bottom bar */}
        <div className="footer-bottom">
          <p className="footer-copy">© 2026 LuckySpinDEMO — Demo Project. All rights reserved.</p>
          <div className="footer-badges">
            <span className="badge">🔒 No Real Money</span>
            <span className="badge">📚 Educational Only</span>
            <span className="badge">🎮 Demo Only</span>
          </div>
        </div>

      </div>
    </footer>
  );
}

export default Footer;