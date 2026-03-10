import React, { useState, useRef, useEffect, useCallback } from "react";
import { useAchievements } from "../context/AchievementContext";
import { checkWinAchievements } from "../utils/achievementHelpers";
import "./Slots.css";

const SYMBOLS = [
  { icon: "🍒", label: "Cherry", weight: 25 },
  { icon: "🍋", label: "Lemon", weight: 20 },
  { icon: "🍊", label: "Orange", weight: 16 },
  { icon: "🔔", label: "Bell", weight: 12 },
  { icon: "⭐", label: "Star", weight: 10 },
  { icon: "🍇", label: "Grape", weight: 8 },
  { icon: "🍀", label: "Clover", weight: 5 },
  { icon: "7️⃣", label: "Seven", weight: 3 },
  { icon: "💎", label: "Diamond", weight: 1 },
];

const PAYOUTS = [
  {
    condition: "💎💎💎",
    label: "Triple Diamond",
    multiplier: 10,
    color: "#00d4ff",
  },
  {
    condition: "7️⃣7️⃣7️⃣",
    label: "Triple Seven",
    multiplier: 7,
    color: "#ffd700",
  },
  { condition: "3 matching", label: "Triple", multiplier: 5, color: "#a855f7" },
  { condition: "2 matching", label: "Pair", multiplier: 2, color: "#10b981" },
];

function weightedRandom() {
  const total = SYMBOLS.reduce((s, x) => s + x.weight, 0);
  let r = Math.random() * total;
  for (const sym of SYMBOLS) {
    r -= sym.weight;
    if (r <= 0) return sym.icon;
  }
  return SYMBOLS[0].icon;
}

function Slots({ balance, setBalance }) {
  const { unlock, updateStats, stats: achStats } = useAchievements();
const [betAmount, setBetAmount] = useState(50);
  const [reels, setReels] = useState(["🍒", "7️⃣", "🔔"]);
  const [reelSpinning, setReelSpinning] = useState([false, false, false]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [resultMessage, setResultMessage] = useState("");
  const [winMultiplier, setWinMultiplier] = useState(null);
  const [winEffect, setWinEffect] = useState(false); // small win
  const [jackpotEffect, setJackpotEffect] = useState(false); // 💎💎💎
  const [autoSpin, setAutoSpin] = useState(false);
  const [jackpot, setJackpot] = useState(10000);
  const [lastResults, setLastResults] = useState([]);
  const [streak, setStreak] = useState(0);

  const intervalsRef = useRef([]);
  const autoTimeoutRef = useRef(null);

  // Jackpot ticker
  useEffect(() => {
    let alive = true;
    const tick = () => {
      if (!alive) return;
      setJackpot((v) => v + Math.floor(Math.random() * 47 + 3));
      setTimeout(tick, 1000 + Math.random() * 2000);
    };
    tick();
    return () => {
      alive = false;
    };
  }, []);

  // Auto-spin loop
  useEffect(() => {
    if (autoSpin && !isSpinning && balance >= betAmount && betAmount > 0) {
      autoTimeoutRef.current = setTimeout(() => handleSpin(), 900);
    } else if (autoSpin && balance < betAmount) {
      setAutoSpin(false);
    }
    return () => clearTimeout(autoTimeoutRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoSpin, isSpinning, balance, betAmount]);

  const handleSpin = useCallback(() => {
    if (isSpinning) return;
    if (betAmount <= 0 || betAmount > balance) {
      setResultMessage(
        betAmount <= 0
          ? "❌ Bet must be greater than 0"
          : "❌ Insufficient balance"
      );
      return;
    }

    setResultMessage("");
    setWinMultiplier(null);
    setWinEffect(false);
    setJackpotEffect(false);
    setIsSpinning(true);
    setReelSpinning([true, true, true]);
    setBalance((prev) => Math.max(0, prev - betAmount));

    const finals = [weightedRandom(), weightedRandom(), weightedRandom()];

    // Clear old intervals
    intervalsRef.current.forEach(clearInterval);
    intervalsRef.current = [];

    // Fast spinning visuals per reel
    for (let r = 0; r < 3; r++) {
      const iv = setInterval(() => {
        setReels((prev) => {
          const c = [...prev];
          c[r] = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)].icon;
          return c;
        });
      }, 70 + r * 15);
      intervalsRef.current.push(iv);
    }

    // Staggered stops
    const base = 900 + Math.random() * 600;
    for (let r = 0; r < 3; r++) {
      const stopAt = base + r * 380 + Math.random() * 120;
      setTimeout(() => {
        clearInterval(intervalsRef.current[r]);
        intervalsRef.current[r] = null;
        setReels((prev) => {
          const c = [...prev];
          c[r] = finals[r];
          return c;
        });
        setReelSpinning((prev) => {
          const c = [...prev];
          c[r] = false;
          return c;
        });
      }, stopAt);
    }

    // Evaluate
    const evalTime = base + 3 * 380 + 450;
    setTimeout(() => {
      const [a, b, c] = finals;
      let mult = 0;
      if (a === "💎" && b === "💎" && c === "💎") mult = 10;
      else if (a === "7️⃣" && b === "7️⃣" && c === "7️⃣") mult = 7;
      else if (a === b && b === c) mult = 5;
      else if (a === b || a === c || b === c) mult = 2;

      const won = mult > 0;
      const winAmount = won ? betAmount * mult : 0;

      if (won) {
        setBalance((prev) => prev + winAmount);
        setWinMultiplier(mult);
        setStreak((s) => s + 1);
        if (mult === 10) {
          setJackpotEffect(true);
          setResultMessage(`💎 JACKPOT! +$${winAmount.toFixed(2)} (×${mult})`);
          setTimeout(() => setJackpotEffect(false), 3500);
        } else {
          setWinEffect(true);
          setResultMessage(`🎉 +$${winAmount.toFixed(2)} (×${mult})`);
          setTimeout(() => setWinEffect(false), 2200);
        }
      } else {
        setStreak(0);
        setResultMessage(`❌ −$${betAmount.toFixed(2)}`);
      }

      setLastResults((prev) => [
        { icons: [a, b, c], mult, won },
        ...prev.slice(0, 4),
      ]);

      // Achievement triggers
      unlock('first-pull');
      const newBalance = won ? balance - betAmount + winAmount : balance - betAmount;
      updateStats(prev => {
        const newStreak = won ? prev.winStreak + 1 : 0;
        return {
          totalBets: prev.totalBets + 1,
          slotsPlayed: prev.slotsPlayed + 1,
          winStreak: newStreak,
          maxWinStreak: Math.max(prev.maxWinStreak, newStreak),
          hitZero: prev.hitZero || newBalance <= 0,
        };
      });
      if (won) {
        if (a === b && b === c) unlock('slots-triple');
        if (mult === 10) unlock('slots-jackpot');
        checkWinAchievements({ betAmount, balance, newBalance, unlock, stats: achStats });
      }

      setIsSpinning(false);
    }, evalTime);
  }, [isSpinning, betAmount, balance, setBalance]);

  const handleQuickBet = (frac) =>
    setBetAmount(Math.max(1, Math.floor(balance * frac)));

  return (
    <div className="slots-page fade-in">
      {/* Jackpot banner */}
      <div className="slots-header">
        <div className="header-title">
          <span className="title-icon">🎰</span>
          <h2>Slot Machine</h2>
        </div>
        <div className="jackpot">
          <span className="jackpot-label">JACKPOT</span>
          <span className="jackpot-value">${jackpot.toLocaleString()}</span>
        </div>
      </div>

      {/* Jackpot overlay */}
      {jackpotEffect && (
        <div className="jackpot-overlay">
          <div className="jackpot-burst">💎 JACKPOT! 💎</div>
        </div>
      )}

      <div className="slots-container">
        {/* Machine */}
        <div className="machine card">
          {/* Cabinet top light strip */}
          <div className="light-strip">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className={`light-bulb ${isSpinning ? "blink" : ""}`}
                style={{ animationDelay: `${i * 80}ms` }}
              />
            ))}
          </div>

          {/* Reels */}
          <div className="reels-wrapper">
            <div className="reels">
              {reels.map((sym, i) => (
                <div
                  key={i}
                  className={`reel ${reelSpinning[i] ? "reel-spin" : ""} ${
                    winEffect && !reelSpinning[i] ? "reel-win" : ""
                  } ${jackpotEffect ? "reel-jackpot" : ""}`}
                >
                  <div className="reel-inner">
                    <span className="symbol">{sym}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Win multiplier badge */}
            {winMultiplier !== null && winMultiplier > 0 && !isSpinning && (
              <div
                className={`win-badge ${
                  winMultiplier >= 7
                    ? "badge-mega"
                    : winMultiplier >= 5
                    ? "badge-big"
                    : "badge-small"
                }`}
              >
                ×{winMultiplier}
              </div>
            )}
          </div>

          {/* Confetti */}
          {(winEffect || jackpotEffect) && (
            <div className="confetti show" aria-hidden="true">
              {Array.from({ length: 30 }).map((_, i) => (
                <span
                  key={i}
                  className={`piece p${i % 6}`}
                  style={{
                    left: `${(i / 30) * 100}%`,
                    animationDelay: `${(i % 8) * 60}ms`,
                  }}
                />
              ))}
            </div>
          )}

          {/* Controls */}
          <div className="controls">
            {/* Bet row */}
            <div className="bet-section">
              <label className="bet-label">Bet</label>
              <div className="bet-row">
                <div className="bet-presets">
                  <button
                    onClick={() => handleQuickBet(0.01)}
                    disabled={isSpinning}
                  >
                    1%
                  </button>
                  <button
                    onClick={() => handleQuickBet(0.05)}
                    disabled={isSpinning}
                  >
                    5%
                  </button>
                  <button
                    onClick={() => handleQuickBet(0.1)}
                    disabled={isSpinning}
                  >
                    10%
                  </button>
                  <button
                    onClick={() => handleQuickBet(0.5)}
                    disabled={isSpinning}
                  >
                    50%
                  </button>
                  <button
                    onClick={() => handleQuickBet(1)}
                    disabled={isSpinning}
                  >
                    All
                  </button>
                </div>
                <input
                  type="number"
                  min="1"
                  value={betAmount}
                  onChange={(e) =>
                    setBetAmount(
                      Math.max(
                        1,
                        Math.min(
                          Math.floor(balance),
                          parseInt(e.target.value) || 0
                        )
                      )
                    )
                  }
                  disabled={isSpinning}
                  className="bet-input"
                />
              </div>
            </div>

            {/* Spin + auto */}
            <div className="actions-row">
              <button
                className={`spin-btn ${isSpinning ? "spinning-btn" : ""}`}
                onClick={handleSpin}
                disabled={isSpinning || betAmount > balance || betAmount <= 0}
              >
                {isSpinning ? (
                  <>
                    <span className="spin-icon">🔄</span> Spinning…
                  </>
                ) : (
                  <>
                    <span className="spin-icon">▶</span> SPIN
                  </>
                )}
              </button>

              <label className="auto-label">
                <div
                  className={`toggle-track ${autoSpin ? "on" : ""}`}
                  onClick={() => setAutoSpin((s) => !s)}
                >
                  <div className="toggle-thumb" />
                </div>
                <span>Auto</span>
              </label>
            </div>

            {/* Status */}
            <div className="status-bar">
              <div className="stat">
                <span className="stat-label">Balance</span>
                <span className="stat-value cyan">${balance.toFixed(2)}</span>
              </div>
              <div className="stat">
                <span className="stat-label">Bet</span>
                <span className="stat-value">${betAmount.toFixed(2)}</span>
              </div>
              {streak > 1 && (
                <div className="stat">
                  <span className="stat-label">Streak</span>
                  <span className="stat-value gold">🔥 {streak}×</span>
                </div>
              )}
            </div>

            {resultMessage && (
              <div
                className={`result-toast ${
                  resultMessage.startsWith("❌") ? "toast-lose" : "toast-win"
                }`}
              >
                {resultMessage}
              </div>
            )}

            {/* Last results mini-history */}
            {lastResults.length > 0 && (
              <div className="mini-history">
                {lastResults.map((r, i) => (
                  <div
                    key={i}
                    className={`history-chip ${
                      r.won ? "chip-win" : "chip-lose"
                    }`}
                  >
                    {r.icons.join(" ")}
                    {r.won && <span className="chip-mult">×{r.mult}</span>}
                  </div>
                ))}
              </div>
            )}

            <div className="bottom-row">
              <button
                className="btn-reload"
                onClick={() => {
                  setBalance((p) => p + 1000);
                  setResultMessage("✅ +$1000 demo credits");
                }}
              >
                + Reload Demo
              </button>
              <span className="demo-note">
                ⚠️ Demo only — no real money
              </span>
            </div>
          </div>
        </div>

        {/* Info panel */}
        <div className="info-panel">
          <div className="rules card">
            <h3>Payouts</h3>
            <div className="payout-table">
              {PAYOUTS.map((p, i) => (
                <div key={i} className="payout-row">
                  <span className="payout-cond" style={{ color: p.color }}>
                    {p.label}
                  </span>
                  <span className="payout-mult" style={{ color: p.color }}>
                    ×{p.multiplier}
                  </span>
                </div>
              ))}
            </div>
            <p className="disclaimer">
              Balances are simulated. No real money involved.
            </p>
          </div>

          <div className="symbol-table card">
            <h4>Symbols (rarity)</h4>
            <div className="sym-list">
              {[...SYMBOLS].reverse().map((s) => (
                <div key={s.icon} className="sym-row">
                  <span className="sym-icon">{s.icon}</span>
                  <span className="sym-name">{s.label}</span>
                  <div className="sym-bar-wrap">
                    <div
                      className="sym-bar"
                      style={{ width: `${(s.weight / 25) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="tips card">
            <h4>💡 Tips</h4>
            <ul>
              <li>Rare symbols (💎, 7️⃣) pay more.</li>
              <li>Auto-Spin speeds up testing.</li>
              <li>Manage your bet according to your balance.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Slots;
