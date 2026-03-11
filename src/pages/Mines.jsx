import { useState, useEffect } from "react";
import useAnimatedNumber from "../hooks/useAnimatedNumber";
import { useAchievements } from "../context/AchievementContext";
import { checkWinAchievements } from "../utils/achievementHelpers";
import "./Mines.css";

const GRID_SIZE = 25;

// Calculate multiplier for revealing `revealed` safe tiles out of `total` with `mines` mines
function calcMultiplier(revealed, total, mines) {
  if (revealed === 0) return 1;
  let mult = 1; // fair odds (EV ≈ $1.00)
  for (let i = 0; i < revealed; i++) {
    mult *= (total - i) / (total - mines - i);
  }
  return Math.floor(mult * 100) / 100;
}

function generateMinePositions(count) {
  const positions = new Set();
  while (positions.size < count) {
    positions.add(Math.floor(Math.random() * GRID_SIZE));
  }
  return positions;
}

export default function Mines({ balance, setBalance }) {
  const animatedBalance = useAnimatedNumber(balance);
  const { unlock, updateStats, stats: achStats } = useAchievements();

  const [betAmount, setBetAmount] = useState(50);
  const [mineCount, setMineCount] = useState(5);
  const [phase, setPhase] = useState("idle"); // idle | playing | won | lost
  const [minePositions, setMinePositions] = useState(new Set());
  const [revealed, setRevealed] = useState(new Set());
  const [multiplier, setMultiplier] = useState(1);
  const [statusMsg, setStatusMsg] = useState("");

  const safeTiles = GRID_SIZE - mineCount;
  const isPlaying = phase === "playing";
  const betValid = betAmount > 0 && betAmount <= balance;

  // Start game
  const startGame = () => {
    if (!betValid) return;
    const mines = generateMinePositions(mineCount);

    setBalance((b) => b - betAmount);
    setMinePositions(mines);
    setRevealed(new Set());
    setMultiplier(1);
    setPhase("playing");
    setStatusMsg("");

    unlock("first-mine");
    if (betAmount >= 500) unlock("big-bet");
    updateStats((prev) => ({
      totalBets: prev.totalBets + 1,
      minesPlayed: (prev.minesPlayed || 0) + 1,
    }));
  };

  // Reveal a tile
  const revealTile = (index) => {
    if (phase !== "playing" || revealed.has(index)) return;

    const newRevealed = new Set(revealed);
    newRevealed.add(index);
    setRevealed(newRevealed);

    if (minePositions.has(index)) {
      // Hit a mine!
      setPhase("lost");
      setMultiplier(0);
      setStatusMsg(`BOOM! Hit a mine - Lost $${betAmount.toFixed(2)}`);

      if (revealed.size === 0) unlock("mines-first-boom");
      updateStats((prev) => ({
        winStreak: 0,
        lossStreak: (prev.lossStreak || 0) + 1,
        maxLossStreak: Math.max(prev.maxLossStreak || 0, (prev.lossStreak || 0) + 1),
        hitZero: prev.hitZero || (balance - betAmount) <= 0,
      }));
      return;
    }

    // Safe tile
    const gemsRevealed = newRevealed.size;
    const newMult = calcMultiplier(gemsRevealed, GRID_SIZE, mineCount);
    setMultiplier(newMult);

    // Check achievements for gems in this round
    if (gemsRevealed >= 10) unlock("mines-10-gems");

    // Check if all safe tiles revealed (sweep!)
    if (gemsRevealed === safeTiles) {
      unlock("mines-sweep");
      cashOutWith(newMult, newRevealed.size);
    }
  };

  // Cash out
  const cashOut = () => {
    if (phase !== "playing" || revealed.size === 0) return;
    cashOutWith(multiplier, revealed.size);
  };

  const cashOutWith = (mult, gemsCount) => {
    const winnings = Math.floor(betAmount * mult * 100) / 100;
    setBalance((b) => b + winnings);
    setPhase("won");
    setStatusMsg(
      gemsCount === safeTiles
        ? `PERFECT SWEEP! All ${safeTiles} gems found - Won $${winnings.toFixed(2)}!`
        : `Cashed out at ${mult.toFixed(2)}x - Won $${winnings.toFixed(2)}!`
    );

    const newBalance = balance - betAmount + winnings;
    checkWinAchievements({ betAmount, balance, newBalance, unlock, stats: achStats });

    updateStats((prev) => {
      const newStreak = prev.winStreak + 1;
      return {
        winStreak: newStreak,
        maxWinStreak: Math.max(prev.maxWinStreak, newStreak),
        lossStreak: 0,
      };
    });
  };

  const gameOver = phase === "won" || phase === "lost";

  return (
    <div className="mines-page fade-in">
      {/* Header */}
      <div className="mines-header">
        <div className="header-title">
          <span className="title-icon">💣</span>
          <h2>MINES</h2>
        </div>
        <div className="mines-jackpot">
          <span className="jackpot-label">MULTIPLIER</span>
          <span className={`jackpot-value ${phase === "lost" ? "lost" : ""}`}>
            {phase === "lost" ? "0.00×" : `${multiplier.toFixed(2)}×`}
          </span>
        </div>
      </div>

      <div className="mines-container">
        {/* LEFT — Grid (main area) */}
        <div className="mines-machine card">
          <div className="mines-grid-header">
            <span>💎 {revealed.size - (phase === "lost" ? 1 : 0)} / {safeTiles} GEMS</span>
            <span>💣 {mineCount} MINES</span>
          </div>

          <div className="mines-grid">
            {Array.from({ length: GRID_SIZE }, (_, i) => {
              const isRevealed = revealed.has(i);
              const isMine = minePositions.has(i);
              const showMine = gameOver && isMine && !isRevealed;
              const flipped = isRevealed || showMine;

              return (
                <button
                  key={i}
                  className={`mines-tile ${showMine ? "reveal-mine" : ""} ${isRevealed && !isMine ? "tile-gem" : ""} ${isRevealed && isMine ? "tile-mine" : ""}`}
                  style={showMine ? { "--reveal-delay": `${Math.random() * 0.4}s` } : undefined}
                  onClick={() => revealTile(i)}
                  disabled={!isPlaying || isRevealed}
                >
                  <div className={`mines-tile-inner ${flipped ? "flipped" : ""}`}>
                    <div className="mines-tile-front">
                      <span className="mines-tile-icon">❓</span>
                    </div>
                    <div className={`mines-tile-back ${isMine ? "mine" : "gem"}`}>
                      <span className="mines-tile-icon">
                        {isMine ? "💣" : "💎"}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Result toast */}
          {statusMsg && (
            <div className={`result-toast ${phase === "won" ? "toast-win" : "toast-lose"}`}>
              {statusMsg}
            </div>
          )}
        </div>

        {/* RIGHT — Controls (sidebar) */}
        <div className="mines-panel">
          {/* Stats bar */}
          <div className="card">
            <div className="status-bar">
              <div className="stat">
                <span className="stat-label">BALANCE</span>
                <span className="stat-value cyan">${animatedBalance.toFixed(2)}</span>
              </div>
              <div className="stat">
                <span className="stat-label">BET</span>
                <span className="stat-value">${betAmount.toFixed(2)}</span>
              </div>
              <div className="stat">
                <span className="stat-label">NEXT</span>
                <span className="stat-value gold">
                  {calcMultiplier(revealed.size + 1, GRID_SIZE, mineCount).toFixed(2)}×
                </span>
              </div>
            </div>

            {/* Bet section */}
            <div className="bet-section">
              <span className="bet-label">BET AMOUNT</span>
              <div className="bet-row">
                <input
                  type="number"
                  className="bet-input"
                  min={1}
                  max={balance}
                  value={betAmount}
                  onChange={(e) => setBetAmount(Math.max(0, Number(e.target.value)))}
                  disabled={isPlaying}
                />
                <div className="bet-presets">
                  {[10, 25, 50, 100].map((v) => (
                    <button key={v} onClick={() => setBetAmount(v)} disabled={isPlaying}>
                      ${v}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Mines selector */}
            <div className="bet-section">
              <span className="bet-label">MINES COUNT</span>
              <div className="bet-row">
                <input
                  type="number"
                  className="bet-input"
                  min={1}
                  max={24}
                  value={mineCount}
                  onChange={(e) => setMineCount(Math.min(24, Math.max(1, Number(e.target.value))))}
                  disabled={isPlaying}
                />
                <div className="bet-presets">
                  {[1, 3, 5, 10, 20].map((v) => (
                    <button key={v} onClick={() => setMineCount(v)} disabled={isPlaying}>
                      {v}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Action button */}
            <div className="actions-row">
              {!isPlaying ? (
                <button
                  className="spin-btn"
                  onClick={startGame}
                  disabled={!betValid}
                >
                  <span className="spin-icon">💣</span>
                  {gameOver ? "PLAY AGAIN" : "START GAME"}
                </button>
              ) : (
                <button
                  className="spin-btn cashout-btn"
                  onClick={cashOut}
                  disabled={revealed.size === 0}
                >
                  <span className="spin-icon">💰</span>
                  CASH OUT ${(betAmount * multiplier).toFixed(2)}
                </button>
              )}
            </div>

            {balance === 0 && !isPlaying && (
              <div className="game-over-message" style={{ marginTop: '0.75rem' }}>
                <p>😢 You ran out of credits!</p>
                <button className="btn-reload-demo" onClick={() => setBalance(p => p + 1000)}>
                  + Reload Demo ($1,000)
                </button>
              </div>
            )}
          </div>

          {/* Info panel */}
          <div className="info-panel">
            <div className="card rules">
              <h3>💣 HOW TO PLAY</h3>
              <div className="payout-table">
                <div className="payout-row">
                  <span className="payout-cond">1. Choose bet & mines</span>
                  <span className="payout-mult">⚙️</span>
                </div>
                <div className="payout-row">
                  <span className="payout-cond">2. Click tiles to reveal</span>
                  <span className="payout-mult">💎</span>
                </div>
                <div className="payout-row">
                  <span className="payout-cond">3. Cash out anytime</span>
                  <span className="payout-mult">💰</span>
                </div>
                <div className="payout-row">
                  <span className="payout-cond">4. Avoid mines!</span>
                  <span className="payout-mult">💥</span>
                </div>
              </div>
            </div>

            <div className="card tips">
              <h4>💡 TIPS</h4>
              <ul>
                <li>More mines = higher multiplier per gem</li>
                <li>Cash out early for safer wins</li>
                <li>Reveal all gems for a perfect sweep!</li>
              </ul>
              <p className="disclaimer">
                ⚠️ Demo only — fictional credits, no real money.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
