import { useState, useRef, useEffect, useCallback } from "react";
import useAnimatedNumber from "../hooks/useAnimatedNumber";
import { useAchievements } from "../context/AchievementContext";
import { checkWinAchievements } from "../utils/achievementHelpers";
import "./Crash.css";

// Generate a crash point using an exponential distribution
function generateCrashPoint() {
  const r = Math.random();
  // House edge ~4%. Minimum 1.00x.
  const crash = Math.max(1, Math.floor((0.96 / (1 - r)) * 100) / 100);
  return Math.min(crash, 1000); // cap at 1000x
}

export default function Crash({ balance, setBalance }) {
  const animatedBalance = useAnimatedNumber(balance);
  const { unlock, updateStats, stats: achStats } = useAchievements();

  const [betAmount, setBetAmount] = useState(50);
  const [phase, setPhase] = useState("idle"); // idle | running | crashed | cashed
  const [multiplier, setMultiplier] = useState(1.0);
  const [crashPoint, setCrashPoint] = useState(null);
  const [cashedAt, setCashedAt] = useState(null);
  const [history, setHistory] = useState([]);
  const [statusMsg, setStatusMsg] = useState("");
  const [autoCashOut, setAutoCashOut] = useState("");

  // Keep refs in sync for the animation loop
  useEffect(() => {
    autoCashOutRef.current = autoCashOut !== "" ? Number(autoCashOut) : null;
  }, [autoCashOut]);

  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);
  const startTimeRef = useRef(null);
  const pointsRef = useRef([]);
  const autoCashOutRef = useRef(null);
  const cashOutRef = useRef(null);

  // Draw the graph
  const drawGraph = useCallback((currentMult, crashed) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.width;
    const H = canvas.height;

    ctx.clearRect(0, 0, W, H);

    // Grid lines
    ctx.strokeStyle = "rgba(0,212,255,0.06)";
    ctx.lineWidth = 1;
    for (let y = 0; y < H; y += H / 5) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }
    for (let x = 0; x < W; x += W / 5) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
    }

    const points = pointsRef.current;
    if (points.length < 2) return;

    // Scale: x = time (0 to maxT), y = multiplier (1 to maxMult)
    const maxT = points[points.length - 1].t;
    const maxMult = Math.max(currentMult, 2);
    const pad = 30;

    const toX = (t) => pad + (t / maxT) * (W - pad * 2);
    const toY = (m) => H - pad - ((m - 1) / (maxMult - 1)) * (H - pad * 2);

    // Draw curve
    ctx.beginPath();
    ctx.moveTo(toX(points[0].t), toY(points[0].m));
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(toX(points[i].t), toY(points[i].m));
    }
    const color = crashed ? "#ef4444" : "#10b981";
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.shadowColor = color;
    ctx.shadowBlur = 10;
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Glow fill under curve
    ctx.lineTo(toX(points[points.length - 1].t), H - pad);
    ctx.lineTo(toX(0), H - pad);
    ctx.closePath();
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, crashed ? "rgba(239,68,68,0.15)" : "rgba(16,185,129,0.15)");
    grad.addColorStop(1, "transparent");
    ctx.fillStyle = grad;
    ctx.fill();

    // Dot at current position
    const lastP = points[points.length - 1];
    ctx.beginPath();
    ctx.arc(toX(lastP.t), toY(lastP.m), 6, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.shadowColor = color;
    ctx.shadowBlur = 15;
    ctx.fill();
    ctx.shadowBlur = 0;
  }, []);

  // Start round
  const startRound = () => {
    if (betAmount <= 0 || betAmount > balance) return;
    const cp = generateCrashPoint();

    setBalance((b) => b - betAmount);
    setCrashPoint(cp);
    setCashedAt(null);
    setMultiplier(1.0);
    setPhase("running");
    setStatusMsg("");
    pointsRef.current = [{ t: 0, m: 1.0 }];
    startTimeRef.current = performance.now();

    unlock("first-crash");
    updateStats((prev) => ({
      totalBets: prev.totalBets + 1,
      crashPlayed: (prev.crashPlayed || 0) + 1,
    }));
  };

  // Cash out
  const cashOut = useCallback(() => {
    if (phase !== "running") return;
    const winnings = Math.floor(betAmount * multiplier * 100) / 100;
    setBalance((b) => b + winnings);
    setCashedAt(multiplier);
    setPhase("cashed");
    setStatusMsg(`Cashed out at ${multiplier.toFixed(2)}× — Won $${winnings.toFixed(2)}!`);

    // Achievements
    const newBalance = balance - betAmount + winnings;
    if (multiplier >= 5) unlock("crash-5x");
    if (multiplier >= 10) unlock("crash-10x");
    if (crashPoint && Math.abs(multiplier - crashPoint) <= 0.1) unlock("crash-close-call");
    checkWinAchievements({ betAmount, balance, newBalance, unlock, stats: achStats });

    updateStats((prev) => {
      const newStreak = prev.winStreak + 1;
      return {
        winStreak: newStreak,
        maxWinStreak: Math.max(prev.maxWinStreak, newStreak),
      };
    });
  }, [phase, betAmount, multiplier, balance, crashPoint, achStats, setBalance, unlock, updateStats]);

  useEffect(() => { cashOutRef.current = cashOut; }, [cashOut]);

  // Animation loop
  useEffect(() => {
    if (phase !== "running") return;

    // Set canvas size
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = canvas.offsetWidth * 2;
      canvas.height = canvas.offsetHeight * 2;
    }

    const tick = () => {
      const elapsed = (performance.now() - startTimeRef.current) / 1000;
      // Multiplier grows exponentially: e^(0.07*t) gives ~2x at 10s, ~4x at 20s
      const currentMult = Math.floor(Math.exp(0.07 * elapsed) * 100) / 100;

      if (currentMult >= crashPoint) {
        // Crashed!
        setMultiplier(crashPoint);
        pointsRef.current.push({ t: elapsed, m: crashPoint });
        drawGraph(crashPoint, true);
        setPhase("crashed");
        setStatusMsg(`Crashed at ${crashPoint.toFixed(2)}× — You lost $${betAmount.toFixed(2)}`);

        setHistory((prev) => [crashPoint, ...prev.slice(0, 14)]);

        updateStats((prev) => ({
          winStreak: 0,
          hitZero: prev.hitZero || (balance - betAmount) <= 0,
        }));
        return;
      }

      setMultiplier(currentMult);

      // Auto cash-out check
      const target = autoCashOutRef.current;
      if (target && currentMult >= target) {
        cashOutRef.current?.();
        return;
      }

      pointsRef.current.push({ t: elapsed, m: currentMult });
      // Keep points array manageable
      if (pointsRef.current.length > 500) {
        pointsRef.current = pointsRef.current.filter((_, i) => i % 2 === 0);
      }
      drawGraph(currentMult, false);
      animFrameRef.current = requestAnimationFrame(tick);
    };

    animFrameRef.current = requestAnimationFrame(tick);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [phase, crashPoint, betAmount, balance, drawGraph, updateStats]);

  const isRunning = phase === "running";
  const betValid = betAmount > 0 && betAmount <= balance;

  return (
    <div className="crash-page fade-in">
      <div className="crash-container">
        {/* LEFT — Betting */}
        <div className="crash-betting">
          <h2>📈 CRASH</h2>

          <div className="crash-balance-info card">
            <div className="crash-balance-item">
              <span className="label">Balance</span>
              <span className="amount">${animatedBalance.toFixed(2)}</span>
            </div>
            <div className="crash-balance-item">
              <span className="label">Bet</span>
              <span className="amount">${betAmount.toFixed(2)}</span>
            </div>
          </div>

          <div className="crash-form-group">
            <label>Bet Amount</label>
            <div className="crash-input-group">
              <span>$</span>
              <input
                type="number"
                min={1}
                max={balance}
                value={betAmount}
                onChange={(e) => setBetAmount(Math.max(0, Number(e.target.value)))}
                disabled={isRunning}
              />
            </div>
            <div className="crash-presets">
              {[10, 25, 50, 100, 250].map((v) => (
                <button
                  key={v}
                  className="btn-preset"
                  onClick={() => setBetAmount(v)}
                  disabled={isRunning}
                >
                  ${v}
                </button>
              ))}
            </div>
          </div>

          <div className="crash-form-group">
            <label>Auto Cash Out</label>
            <div className="crash-input-group">
              <span>×</span>
              <input
                type="number"
                min={1.01}
                step={0.1}
                placeholder="e.g. 2.00"
                value={autoCashOut}
                onChange={(e) => setAutoCashOut(e.target.value)}
                disabled={isRunning}
              />
            </div>
            <div className="crash-presets">
              {[1.5, 2, 3, 5, 10].map((v) => (
                <button
                  key={v}
                  className={`btn-preset ${Number(autoCashOut) === v ? "active" : ""}`}
                  onClick={() => setAutoCashOut(autoCashOut === String(v) ? "" : String(v))}
                  disabled={isRunning}
                >
                  {v}×
                </button>
              ))}
            </div>
          </div>

          <div className="crash-actions">
            {!isRunning ? (
              <button
                className="btn-crash-start"
                onClick={startRound}
                disabled={!betValid || isRunning}
              >
                🚀 START
              </button>
            ) : (
              <button className="btn-cashout" onClick={cashOut}>
                💰 CASH OUT @ {multiplier.toFixed(2)}×
              </button>
            )}
          </div>
        </div>

        {/* RIGHT — Graph */}
        <div className="crash-graph-section">
          <h2>MULTIPLIER GRAPH</h2>
          <div className="crash-canvas-wrap">
            <canvas ref={canvasRef} />
            <div
              className={`crash-multiplier-overlay ${
                phase === "crashed" ? "crashed" : phase === "cashed" ? "cashed" : ""
              }`}
            >
              {multiplier.toFixed(2)}×
            </div>
          </div>
          <div className={`crash-status ${phase === "cashed" ? "win" : phase === "crashed" ? "lose" : ""}`}>
            {statusMsg}
          </div>
        </div>
      </div>

      {/* History */}
      {history.length > 0 && (
        <div className="crash-history">
          <h3>RECENT CRASHES</h3>
          <div className="crash-history-list">
            {history.map((cp, i) => (
              <span
                key={i}
                className={`crash-history-item ${cp < 2 ? "low" : cp < 5 ? "mid" : "high"}`}
              >
                {cp.toFixed(2)}×
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Info */}
      <div className="crash-info">
        <h2>HOW CRASH WORKS</h2>
        <div className="crash-info-grid">
          <div className="crash-info-card card">
            <div className="info-icon">🚀</div>
            <h3>MULTIPLIER RISES</h3>
            <p>After you bet, the multiplier starts at 1.00× and rises exponentially. The longer you wait, the bigger your potential win!</p>
          </div>
          <div className="crash-info-card card">
            <div className="info-icon">💰</div>
            <h3>CASH OUT</h3>
            <p>Hit "Cash Out" at any time to lock in your winnings. Your bet is multiplied by the current value when you cash out.</p>
          </div>
          <div className="crash-info-card card">
            <div className="info-icon">💥</div>
            <h3>CRASH!</h3>
            <p>The multiplier can crash at any moment — even at 1.00×! If it crashes before you cash out, you lose your bet.</p>
          </div>
        </div>
      </div>

      <div className="crash-disclaimer">
        ⚠️ This is a demo game with fictional credits only. No real money involved. For educational purposes.
      </div>
    </div>
  );
}
