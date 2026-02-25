import "./Home.css";

function Home({ onNavigate }) {
  const features = [
    { icon: "⚡", title: "Instant Play", desc: "Sem downloads, sem cadastro. Jogue direto no navegador com nossa roleta e caça-níquel totalmente funcionais." },
    { icon: "💰", title: "$1000 Demo Credits", desc: "Todo jogador começa com 1000 créditos fictícios. Perfeito para aprender sem consequências reais." },
    { icon: "🎲", title: "Resultado Justo", desc: "Usamos Math.random() para resultados verdadeiramente aleatórios. Cada giro é independente e imprevisível." },
    { icon: "📚", title: "Fins Educacionais", desc: "Entenda probabilidade, odds e aleatoriedade de forma divertida e segura." },
    { icon: "📱", title: "Totalmente Responsivo", desc: "Jogue no desktop, tablet ou celular. A interface se adapta perfeitamente a qualquer tela." },
    { icon: "✨", title: "Design Moderno", desc: "Estética neon dark com efeitos glassmorphism. Visual profissional e visualmente impressionante." },
  ];

  const games = [
    {
      id: "roulette",
      icon: "🎡",
      title: "Roleta",
      desc: "Aposte no vermelho, preto ou verde. A clássica roleta europeia com roda SVG animada.",
      tags: ["1:1 Red/Black", "35:1 Green"],
      accent: "#ef4444",
    },
    {
      id: "slots",
      icon: "🎰",
      title: "Caça-Níquel",
      desc: "Três bobinas, seis símbolos e multiplicadores até 10×. Auto-spin incluso.",
      tags: ["Até ×10", "Auto-Spin"],
      accent: "#a855f7",
    },
    {
      id: "blackjack",
      icon: "🃏",
      title: "Blackjack",
      desc: "Chegue mais perto de 21 que o dealer. Hit, Stand ou Double Down — clássico cassino.",
      tags: ["Blackjack 3:2", "Double Down"],
      accent: "#10b981",
    },
  ];

  return (
    <div className="home-page fade-in">

      {/* ── Hero ── */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-badge">🎰 Demo Platform</div>
          <h1>
            <span className="gradient-text">LuckySpin</span>
            <span className="hero-demo-tag">DEMO</span>
          </h1>
          <p className="hero-subtitle">The Ultimate Educational Gaming Experience</p>
          <p className="hero-description">
            Experimente a emoção da roleta e do caça-níquel com créditos fictícios.
            Aprenda como jogos baseados em chance funcionam — sem dinheiro real, pura diversão e educação.
          </p>
          <div className="hero-actions">
            <button className="btn-hero btn-roulette" onClick={() => onNavigate("roulette")}>
              🎡 Jogar Roleta
            </button>
            <button className="btn-hero btn-slots" onClick={() => onNavigate("slots")}>
              🎰 Jogar Slots
            </button>
            <button className="btn-hero btn-blackjack" onClick={() => onNavigate("blackjack")}>
              🃏 Jogar Blackjack
            </button>
          </div>
          <div className="hero-stats">
            <div className="hstat"><span className="hstat-val">$1,000</span><span className="hstat-label">Créditos Demo</span></div>
            <div className="hstat-divider" />
            <div className="hstat"><span className="hstat-val">3</span><span className="hstat-label">Jogos</span></div>
            <div className="hstat-divider" />
            <div className="hstat"><span className="hstat-val">0%</span><span className="hstat-label">Dinheiro Real</span></div>
          </div>
        </div>
        <div className="hero-visual">
          <div className="orbit-ring ring-1" />
          <div className="orbit-ring ring-2" />
          <div className="orbit-ring ring-3" />
          <div className="hero-wheel-wrap">
            <span className="hero-main-icon">🎰</span>
          </div>
          <div className="floating-chip chip-1">🎡</div>
          <div className="floating-chip chip-2">💎</div>
          <div className="floating-chip chip-3">7️⃣</div>
          <div className="floating-chip chip-4">⭐</div>
        </div>
      </section>

      {/* ── Games ── */}
      <section className="games-section">
        <div className="section-label">JOGOS DISPONÍVEIS</div>
        <h2>Escolha seu Jogo</h2>
        <div className="games-grid">
          {games.map(g => (
            <div key={g.id} className="game-card card" style={{ "--accent": g.accent }}>
              <div className="game-icon-wrap">
                <span className="game-icon">{g.icon}</span>
                <div className="game-icon-glow" />
              </div>
              <h3>{g.title}</h3>
              <p>{g.desc}</p>
              <div className="game-tags">
                {g.tags.map(t => <span key={t} className="game-tag">{t}</span>)}
              </div>
              <button className="btn-play" onClick={() => onNavigate(g.id)}>
                Jogar Agora →
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section className="features">
        <div className="section-label">DIFERENCIAIS</div>
        <h2>Por que LuckySpinDEMO?</h2>
        <div className="features-grid">
          {features.map((f, i) => (
            <div key={i} className="feature-card card">
              <span className="feature-icon">{f.icon}</span>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="how-it-works">
        <div className="section-label">COMO FUNCIONA</div>
        <h2>Simples e Direto</h2>
        <div className="steps-container">
          {[
            { n: "01", title: "Receba Créditos", desc: "Comece com $1000 de créditos demo na sua conta", icon: "💳" },
            { n: "02", title: "Faça sua Aposta", desc: "Escolha o valor e a opção que deseja apostar", icon: "🎯" },
            { n: "03", title: "Gire / Spin", desc: "Assista à animação e torça pelo resultado", icon: "🎡" },
            { n: "04", title: "Veja o Resultado", desc: "Saldo atualizado instantaneamente após cada rodada", icon: "📊" },
          ].map((s, i, arr) => (
            <>
              <div key={s.n} className="step">
                <div className="step-num">{s.n}</div>
                <div className="step-icon">{s.icon}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
              {i < arr.length - 1 && <div key={`arrow-${i}`} className="step-arrow">›</div>}
            </>
          ))}
        </div>
      </section>

      {/* ── Disclaimer ── */}
      <section className="disclaimer">
        <div className="section-label">AVISO IMPORTANTE</div>
        <h2>⚠️ Este é apenas um Demo</h2>
        <div className="disclaimer-content card">
          <p>
            <strong>LuckySpinDEMO é um projeto totalmente fictício e educacional.</strong>{" "}
            Não é uma plataforma de jogos real e não envolve transações de dinheiro real.
          </p>
          <ul>
            <li>✓ Todos os saldos são créditos demo fictícios</li>
            <li>✓ Nenhum dinheiro real está envolvido em qualquer transação</li>
            <li>✓ Exclusivamente para fins educacionais e de entretenimento</li>
            <li>✓ Sem integração backend ou processamento de pagamento real</li>
            <li>✓ Todos os dados ficam apenas na memória do navegador</li>
          </ul>
          <p className="disclaimer-warning">
            <strong>Se você lida com problemas de jogo na vida real, por favor procure ajuda profissional.</strong>
          </p>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="cta">
        <div className="cta-glow" />
        <div className="cta-inner">
          <h2>Pronto para começar?</h2>
          <p>Gire a roleta ou jogue no caça-níquel com seus $1000 de créditos demo!</p>
          <div className="cta-actions">
            <button className="btn-hero btn-roulette" onClick={() => onNavigate("roulette")}>
              🎡 Jogar Roleta
            </button>
            <button className="btn-hero btn-slots" onClick={() => onNavigate("slots")}>
              🎰 Jogar Slots
            </button>
            <button className="btn-hero btn-blackjack" onClick={() => onNavigate("blackjack")}>
              🃏 Jogar Blackjack
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;