import "./Footer.css";

function Footer({ onNavigate }) {
  return (
    <footer className="footer">
      <div className="footer-inner">

        {/* Top grid */}
        <div className="footer-grid">

          {/* Brand col */}
          <div className="footer-col footer-brand-col">
            <div className="footer-logo" onClick={() => onNavigate?.("home")}>
              <span className="footer-logo-icon">🎰</span>
              <div className="footer-brand-text">
                <span className="footer-brand-name">LuckySpin</span>
                <span className="footer-brand-tag">DEMO</span>
              </div>
            </div>
            <p className="footer-tagline">
              Plataforma fictícia criada para fins educacionais e de entretenimento. Sem dinheiro real envolvido.
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
            <h4 className="footer-heading">Navegação</h4>
            <ul className="footer-links">
              {[
                { label: "Home",   page: "home"     },
                { label: "Roleta", page: "roulette" },
                { label: "Slots",  page: "slots"    },
                { label: "Blackjack", page: "blackjack" },
              ].map(l => (
                <li key={l.page}>
                  <button className="footer-link" onClick={() => onNavigate?.(l.page)}>
                    <span className="footer-link-arrow">›</span> {l.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Games */}
          <div className="footer-col">
            <h4 className="footer-heading">Jogos</h4>
            <ul className="footer-links">
              <li><span className="footer-link-static">🎡 Roleta Europeia</span></li>
              <li><span className="footer-link-static">🎰 Caça-Níquel 3 Bobinas</span></li>
              <li><span className="footer-link-static">🃏 Blackjack</span></li>
              <li><span className="footer-link-static coming">🎴 Poker (em breve)</span></li>
            </ul>
          </div>

          {/* Disclaimer */}
          <div className="footer-col">
            <h4 className="footer-heading">⚠️ Aviso</h4>
            <p className="footer-disclaimer">
              Este é um <strong>projeto demo</strong> apenas para fins educacionais.
              Nenhuma transação real ocorre. Todos os saldos são créditos fictícios.
              <br /><br />
              Não é uma plataforma de apostas real.
            </p>
          </div>

        </div>

        {/* Divider */}
        <div className="footer-divider" />

        {/* Bottom bar */}
        <div className="footer-bottom">
          <p className="footer-copy">© 2026 LuckySpinDEMO — Projeto Demo. Todos os direitos reservados.</p>
          <div className="footer-badges">
            <span className="badge">🔒 Sem Dinheiro Real</span>
            <span className="badge">📚 Fins Educacionais</span>
            <span className="badge">🎮 Demo Only</span>
          </div>
        </div>

      </div>
    </footer>
  );
}

export default Footer;