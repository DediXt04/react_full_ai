import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "./Home.css";

function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add("revealed"); observer.unobserve(el); } },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return ref;
}

function Home() {
  const features = [
    {
      icon: "⚡",
      title: "Instant Play",
      desc: "No downloads, no sign-up. Play directly in your browser with our fully functional roulette and slot machine.",
    },
    {
      icon: "💰",
      title: "$1000 Demo Credits",
      desc: "Every player starts with 1000 fictional credits. Perfect for learning without real consequences.",
    },
    {
      icon: "🎲",
      title: "Fair Results",
      desc: "We use Math.random() for truly random results. Each spin is independent and unpredictable.",
    },
    {
      icon: "📚",
      title: "Educational Purpose",
      desc: "Understand probability, odds, and randomness in a fun and safe way.",
    },
    {
      icon: "📱",
      title: "Fully Responsive",
      desc: "Play on desktop, tablet, or mobile. The interface adapts perfectly to any screen.",
    },
    {
      icon: "✨",
      title: "Modern Design",
      desc: "Dark neon aesthetic with glassmorphism effects. Professional and visually stunning.",
    },
  ];

  const games = [
    {
      id: "roulette",
      icon: "🎡",
      title: "Roulette",
      desc: "Bet on red, black, or green. The classic European roulette with animated SVG wheel.",
      tags: ["1:1 Red/Black", "35:1 Green"],
      accent: "#ef4444",
      badge: null,
    },
    {
      id: "slots",
      icon: "🎰",
      title: "Slot Machine",
      desc: "Three reels, six symbols, and multipliers up to 10×. Auto-spin included.",
      tags: ["Up to ×10", "Auto-Spin"],
      accent: "#a855f7",
      badge: null,
    },
    {
      id: "blackjack",
      icon: "🃏",
      title: "Blackjack",
      desc: "Get closer to 21 than the dealer. Hit, Stand, or Double Down — classic casino.",
      tags: ["Blackjack 3:2", "Double Down"],
      accent: "#10b981",
      badge: null,
    },
    {
      id: "crash",
      icon: "📈",
      title: "Crash",
      desc: "Watch the multiplier rise and cash out before it crashes! How far can you go?",
      tags: ["Up to 1000×", "Cash Out"],
      accent: "#f59e0b",
      badge: "NEW",
    },
    {
      id: "mines",
      icon: "💣",
      title: "Mines",
      desc: "Reveal gems on a 5×5 grid without hitting a mine. The more you find, the bigger the payout!",
      tags: ["Up to 24 Mines", "Cash Out"],
      accent: "#ef4444",
      badge: "NEW",
    },
    {
      id: "plinko",
      icon: "📍",
      title: "Plinko",
      desc: "Drop the ball and watch it bounce through pegs. Land on high multipliers to win big!",
      tags: ["Up to 1000×", "3 Risk Levels"],
      accent: "#06b6d4",
      badge: "NEW",
    },
  ];

  const gamesRef = useReveal();
  const featuresRef = useReveal();
  const howRef = useReveal();
  const disclaimerRef = useReveal();
  const ctaRef = useReveal();

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
          <p className="hero-subtitle">
            The Ultimate Educational Gaming Experience
          </p>
          <p className="hero-description">
            Experience the thrill of roulette and slot machines with fictional
            credits. Learn how chance-based games work — no real money, pure fun
            and education.
          </p>
          <div className="hero-actions">
            <Link to="/roulette" className="btn-hero btn-roulette">
              🎡 Play Roulette
            </Link>
            <Link to="/slots" className="btn-hero btn-slots">
              🎰 Play Slots
            </Link>
            <Link to="/blackjack" className="btn-hero btn-blackjack">
              🃏 Play Blackjack
            </Link>
            <Link to="/crash" className="btn-hero btn-crash">
              📈 Play Crash
            </Link>
            <Link to="/mines" className="btn-hero btn-mines">
              💣 Play Mines
            </Link>
            <Link to="/plinko" className="btn-hero btn-plinko">
              📍 Play Plinko
            </Link>
          </div>
          <div className="hero-stats">
            <div className="hstat">
              <span className="hstat-val">$1,000</span>
              <span className="hstat-label">Demo Credits</span>
            </div>
            <div className="hstat-divider" />
            <div className="hstat">
              <span className="hstat-val">6</span>
              <span className="hstat-label">Games</span>
            </div>
            <div className="hstat-divider" />
            <div className="hstat">
              <span className="hstat-val">0%</span>
              <span className="hstat-label">Real Money</span>
            </div>
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
      <section className="games-section reveal-section" ref={gamesRef}>
        <div className="section-label">AVAILABLE GAMES</div>
        <h2>Choose Your Game</h2>
        <div className="games-grid">
          {games.map((g) => (
            <div
              key={g.id}
              className="game-card card"
              style={{ "--accent": g.accent }}
            >
              <div className="game-card-accent" />
              {g.badge && <span className="game-badge">{g.badge}</span>}
              <div className="game-icon-wrap">
                <span className="game-icon">{g.icon}</span>
                <div className="game-icon-glow" />
              </div>
              <h3>{g.title}</h3>
              <p>{g.desc}</p>
              <div className="game-tags">
                {g.tags.map((t) => (
                  <span key={t} className="game-tag">
                    {t}
                  </span>
                ))}
              </div>
              <Link to={`/${g.id}`} className="btn-play">
                Play Now →
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section className="features reveal-section" ref={featuresRef}>
        <div className="section-label">FEATURES</div>
        <h2>Why LuckySpinDEMO?</h2>
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
      <section className="how-it-works reveal-section" ref={howRef}>
        <div className="section-label">HOW IT WORKS</div>
        <h2>Simple and Straightforward</h2>
        <div className="steps-container">
          {[
            {
              n: "01",
              title: "Get Credits",
              desc: "Start with $1000 in demo credits in your account",
              icon: "💳",
            },
            {
              n: "02",
              title: "Place Your Bet",
              desc: "Choose the amount and the option you want to bet on",
              icon: "🎯",
            },
            {
              n: "03",
              title: "Spin",
              desc: "Watch the animation and cheer for the result",
              icon: "🎡",
            },
            {
              n: "04",
              title: "See the Result",
              desc: "Balance updated instantly after each round",
              icon: "📊",
            },
          ].map((s, i, arr) => (
            <React.Fragment key={s.n}>
              <div className="step">
                <div className="step-num">{s.n}</div>
                <div className="step-icon">{s.icon}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
              {i < arr.length - 1 && (
                <div className="step-arrow">
                  ›
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </section>

      {/* ── Disclaimer ── */}
      <section className="disclaimer reveal-section" ref={disclaimerRef}>
        <div className="section-label">IMPORTANT NOTICE</div>
        <h2>⚠️ This is Just a Demo</h2>
        <div className="disclaimer-content card">
          <p>
            <strong>
              LuckySpinDEMO is a completely fictional and educational project.
            </strong>{" "}
            It is not a real gaming platform and does not involve real money
            transactions.
          </p>
          <ul>
            <li>✓ All balances are fictional demo credits</li>
            <li>✓ No real money is involved in any transaction</li>
            <li>✓ Exclusively for educational and entertainment purposes</li>
            <li>✓ No backend integration or real payment processing</li>
            <li>✓ All data is stored only in browser memory</li>
          </ul>
          <p className="disclaimer-warning">
            <strong>
              If you deal with gambling problems in real life, please seek
              professional help.
            </strong>
          </p>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="cta reveal-section" ref={ctaRef}>
        <div className="cta-glow" />
        <div className="cta-inner">
          <h2>Ready to Start?</h2>
          <p>
            Spin the roulette or play slots with your $1000 in demo credits!
          </p>
          <div className="cta-actions">
            <Link to="/roulette" className="btn-hero btn-roulette">
              🎡 Play Roulette
            </Link>
            <Link to="/slots" className="btn-hero btn-slots">
              🎰 Play Slots
            </Link>
            <Link to="/blackjack" className="btn-hero btn-blackjack">
              🃏 Play Blackjack
            </Link>
            <Link to="/crash" className="btn-hero btn-crash">
              📈 Play Crash
            </Link>
            <Link to="/mines" className="btn-hero btn-mines">
              💣 Play Mines
            </Link>
            <Link to="/plinko" className="btn-hero btn-plinko">
              📍 Play Plinko
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
