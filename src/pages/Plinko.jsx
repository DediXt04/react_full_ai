import { useState, useRef, useEffect, useCallback } from "react";
import useAnimatedNumber from "../hooks/useAnimatedNumber";
import { useAchievements } from "../context/AchievementContext";
import { checkWinAchievements } from "../utils/achievementHelpers";
import "./Plinko.css";

/* ── Multiplier tables (EV ≈ $1.00 per config) ── */
const MULTIPLIERS = {
  8: {
    low:    [5.6, 2.1, 1.1, 1.0, 0.5, 1.0, 1.1, 2.1, 5.6],
    medium: [13, 3, 1.3, 0.7, 0.4, 0.7, 1.3, 3, 13],
    high:   [29, 4, 1.5, 0.3, 0.2, 0.3, 1.5, 4, 29],
  },
  12: {
    low:    [5.6, 2.1, 1.6, 1.4, 1.1, 1.0, 0.5, 1.0, 1.1, 1.4, 1.6, 2.1, 5.6],
    medium: [33, 11, 4, 2, 1.1, 0.6, 0.3, 0.6, 1.1, 2, 4, 11, 33],
    high:   [170, 41, 10, 3, 1.4, 0.2, 0.2, 0.2, 1.4, 3, 10, 41, 170],
  },
  16: {
    low:    [16, 9, 2, 1.4, 1.4, 1.2, 1.1, 1.0, 0.5, 1.0, 1.1, 1.2, 1.4, 1.4, 2, 9, 16],
    medium: [110, 41, 10, 5, 3, 1.5, 1, 0.5, 0.3, 0.5, 1, 1.5, 3, 5, 10, 41, 110],
    high:   [1000, 130, 26, 9, 4, 2, 0.2, 0.2, 0.2, 0.2, 0.2, 2, 4, 9, 26, 130, 1000],
  },
};

function slotColor(mult) {
  if (mult >= 10) return "#f59e0b";
  if (mult >= 2)  return "#22c55e";
  if (mult >= 1)  return "#3b82f6";
  return "#ef4444";
}

/* Galton board: random L/R at each row → determines final slot */
function generatePath(rows) {
  const decisions = [];
  let offset = 0;
  for (let i = 0; i < rows; i++) {
    const goRight = Math.random() < 0.5;
    decisions.push(goRight);
    offset += goRight ? 1 : -1;
  }
  return { decisions, slotIndex: (offset + rows) / 2 };
}

export default function Plinko({ balance, setBalance }) {
  const animBal = useAnimatedNumber(balance);
  const { unlock, updateStats } = useAchievements();

  const [betAmount, setBetAmount] = useState(10);
  const [rows, setRows] = useState(12);
  const [risk, setRisk] = useState("medium");
  const [lastResults, setLastResults] = useState([]);
  const [autoDrops, setAutoDrops] = useState(0);

  const canvasRef    = useRef(null);
  const ballsRef     = useRef([]);
  const animRef      = useRef(null);
  const nextId       = useRef(0);
  const autoRef      = useRef(0);
  const highlightsRef = useRef([]);

  const mults    = MULTIPLIERS[rows][risk];
  const numSlots = rows + 1;

  /* ── Canvas geometry (2× retina) ── */
  const calcGeo = useCallback((c) => {
    const W = c.width, H = c.height;
    const pad = W * 0.06, top = H * 0.07;
    const slotH = H * 0.09;
    const boardH = H - top - slotH - H * 0.06;
    const rSpace = boardH / (rows + 1);
    const pSpace = (W - pad * 2) / (rows + 2);
    return { W, H, pad, top, slotH, rSpace, pSpace };
  }, [rows]);

  /* ── Peg XY in canvas-pixel space ── */
  const pegXY = useCallback((row, idx, g) => {
    const n = row + 3;
    return {
      x: g.W / 2 + (idx - (n - 1) / 2) * g.pSpace,
      y: g.top + (row + 1) * g.rSpace,
    };
  }, []);

  /* ── Ball waypoints from L/R decisions ── */
  const makeWaypoints = useCallback((decisions, g) => {
    const wps = [{ x: g.W / 2, y: g.top * 0.4 }];
    let bx = 0;
    for (let i = 0; i < decisions.length; i++) {
      bx += decisions[i] ? 0.5 : -0.5;
      wps.push({ x: g.W / 2 + bx * g.pSpace, y: g.top + (i + 1) * g.rSpace });
    }
    wps.push({ x: wps.at(-1).x, y: g.top + (decisions.length + 1) * g.rSpace + g.slotH * 0.35 });
    return wps;
  }, []);

  /* ── Draw frame ── */
  const draw = useCallback(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    const g = calcGeo(c);
    ctx.clearRect(0, 0, g.W, g.H);

    // Pegs
    for (let r = 0; r < rows; r++) {
      for (let p = 0; p < r + 3; p++) {
        const { x, y } = pegXY(r, p, g);
        ctx.beginPath(); ctx.arc(x, y, 7, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(148,163,184,0.45)"; ctx.fill();
        ctx.beginPath(); ctx.arc(x, y, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(226,232,240,0.85)"; ctx.fill();
      }
    }

    // Highlights cleanup
    const now = performance.now();
    highlightsRef.current = highlightsRef.current.filter(h => now - h.t < 700);

    // Multiplier slots
    const slotW = g.pSpace * 0.88;
    const slotY = g.top + (rows + 0.6) * g.rSpace;
    const slotH = g.slotH;
    for (let s = 0; s < numSlots; s++) {
      const x = g.W / 2 + (s - (numSlots - 1) / 2) * g.pSpace;
      const m = mults[s];
      const col = slotColor(m);
      const hl = highlightsRef.current.find(h => h.slot === s);
      const hlA = hl ? Math.max(0, 1 - (now - hl.t) / 700) : 0;

      // Rounded rect path
      const rx = x - slotW / 2, ry = slotY, rw = slotW, rh = slotH, rad = 8;
      ctx.beginPath();
      ctx.moveTo(rx + rad, ry);
      ctx.lineTo(rx + rw - rad, ry);
      ctx.quadraticCurveTo(rx + rw, ry, rx + rw, ry + rad);
      ctx.lineTo(rx + rw, ry + rh - rad);
      ctx.quadraticCurveTo(rx + rw, ry + rh, rx + rw - rad, ry + rh);
      ctx.lineTo(rx + rad, ry + rh);
      ctx.quadraticCurveTo(rx, ry + rh, rx, ry + rh - rad);
      ctx.lineTo(rx, ry + rad);
      ctx.quadraticCurveTo(rx, ry, rx + rad, ry);
      ctx.closePath();

      // Fill
      ctx.fillStyle = col + "18";
      ctx.fill();
      if (hlA > 0) {
        ctx.save();
        ctx.globalAlpha = hlA * 0.55;
        ctx.shadowColor = col; ctx.shadowBlur = 28 * hlA;
        ctx.fillStyle = col;
        ctx.fill();
        ctx.restore();
      }
      ctx.strokeStyle = hlA > 0 ? col : col + "55";
      ctx.lineWidth = 2; ctx.stroke();

      // Text — auto-shrink to fit
      const txt = m + "×";
      let fs = rows <= 8 ? 20 : rows <= 12 ? 16 : 13;
      ctx.font = `bold ${fs}px system-ui`;
      if (ctx.measureText(txt).width > rw * 0.92) {
        fs = Math.round(fs * (rw * 0.88) / ctx.measureText(txt).width);
        ctx.font = `bold ${fs}px system-ui`;
      }
      ctx.fillStyle = col;
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText(txt, x, slotY + rh / 2);
    }

    // Balls
    for (const ball of ballsRef.current) {
      if (!ball.wps) continue;
      const seg = Math.min(Math.floor(ball.prog), ball.wps.length - 2);
      const t = ball.prog - seg;
      const a = ball.wps[seg], b = ball.wps[seg + 1];
      const xEase = 1 - (1 - t) * (1 - t); // ease-out (quick deflect)
      const yEase = t * t;                   // ease-in  (gravity)
      const bx = a.x + (b.x - a.x) * xEase;
      const by = a.y + (b.y - a.y) * yEase;

      // Glow
      const grad = ctx.createRadialGradient(bx, by, 0, bx, by, 22);
      grad.addColorStop(0, "rgba(250,204,21,0.35)");
      grad.addColorStop(1, "rgba(250,204,21,0)");
      ctx.beginPath(); ctx.arc(bx, by, 22, 0, Math.PI * 2);
      ctx.fillStyle = grad; ctx.fill();

      // Body
      const bg = ctx.createRadialGradient(bx - 3, by - 3, 0, bx, by, 11);
      bg.addColorStop(0, "#fef08a"); bg.addColorStop(1, "#f59e0b");
      ctx.beginPath(); ctx.arc(bx, by, 11, 0, Math.PI * 2);
      ctx.fillStyle = bg; ctx.fill();
    }
  }, [rows, numSlots, mults, calcGeo, pegXY]);

  /* ── Animation loop ── */
  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    c.width = c.offsetWidth * 2;
    c.height = c.offsetHeight * 2;

    const speed = rows <= 8 ? 7 : rows <= 12 ? 9 : 11;

    const tick = () => {
      const now = performance.now();
      ballsRef.current = ballsRef.current.filter(b => {
        b.prog = Math.min((now - b.start) / 1000 * speed, b.wps.length - 1);
        if (b.prog >= b.wps.length - 1 && !b.done) { b.done = true; b.doneAt = now; b.onLand(); }
        if (b.done && now - b.doneAt > 400) return false;
        return true;
      });
      draw();
      animRef.current = requestAnimationFrame(tick);
    };

    animRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animRef.current);
  }, [draw, rows]);

  /* ── Resize ── */
  useEffect(() => {
    const fn = () => { const c = canvasRef.current; if (c) { c.width = c.offsetWidth * 2; c.height = c.offsetHeight * 2; } };
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);

  /* ── Drop ball ── */
  const dropBall = useCallback(() => {
    if (betAmount <= 0 || betAmount > balance) return;
    const bet = betAmount;
    setBalance(b => b - bet);

    const c = canvasRef.current;
    if (!c) return;
    const g = calcGeo(c);
    const { decisions, slotIndex } = generatePath(rows);
    const wps = makeWaypoints(decisions, g);
    const mult = mults[slotIndex];

    updateStats(prev => ({
      ...prev,
      totalBets: (prev.totalBets || 0) + 1,
      plinkoPlayed: (prev.plinkoPlayed || 0) + 1,
    }));
    if (bet >= 500) unlock("big-bet");

    const id = nextId.current++;
    ballsRef.current.push({
      id, wps, start: performance.now(), prog: 0, done: false,
      onLand: () => {
        const win = Math.round(bet * mult * 100) / 100;
        setBalance(b => {
          const nb = Math.round((b + win) * 100) / 100;
          if (win > bet) {
            checkWinAchievements({ betAmount: bet, balance: b, newBalance: nb, unlock, stats: {} });
            updateStats(p => ({
              ...p,
              winStreak: (p.winStreak || 0) + 1,
              maxWinStreak: Math.max(p.maxWinStreak || 0, (p.winStreak || 0) + 1),
              lossStreak: 0,
            }));
          } else {
            updateStats(p => ({
              ...p,
              winStreak: 0,
              lossStreak: (p.lossStreak || 0) + 1,
              maxLossStreak: Math.max(p.maxLossStreak || 0, (p.lossStreak || 0) + 1),
            }));
          }
          if (nb <= 0) updateStats(p => ({ ...p, hitZero: true }));
          return nb;
        });
        setLastResults(prev => [{ mult, win, id }, ...prev].slice(0, 10));
        highlightsRef.current.push({ slot: slotIndex, t: performance.now() });
        if (mult >= 100) unlock("plinko-100x");
      },
    });
  }, [betAmount, balance, rows, mults, setBalance, unlock, updateStats, calcGeo, makeWaypoints]);

  /* ── Auto-drop ── */
  const dropRef = useRef(dropBall);
  dropRef.current = dropBall;

  const stopAuto = useCallback(() => { setAutoDrops(0); autoRef.current = 0; }, []);
  const startAuto = useCallback((count) => {
    setAutoDrops(count);
    autoRef.current = count;
    dropRef.current();
  }, []);

  useEffect(() => {
    if (autoRef.current === 0) return;
    const iv = setInterval(() => {
      if (autoRef.current === 0) return clearInterval(iv);
      if (balance < betAmount || betAmount <= 0) { stopAuto(); return clearInterval(iv); }
      if (autoRef.current > 0) { autoRef.current--; setAutoDrops(autoRef.current); }
      dropRef.current();
      if (autoRef.current === 0) clearInterval(iv);
    }, 350);
    return () => clearInterval(iv);
  }, [autoDrops, balance, betAmount, stopAuto]);

  const betOk = betAmount > 0 && betAmount <= balance;

  return (
    <div className="plinko-page fade-in">
      {/* ── Header bar ── */}
      <div className="plinko-header">
        <div className="header-title">
          <span className="title-icon">📍</span>
          <h2>PLINKO</h2>
        </div>
        <div className="plinko-badge">
          <span className="badge-label">RISK</span>
          <span className="badge-value">{risk.toUpperCase()}</span>
        </div>
      </div>

      <div className="plinko-container">
        {/* ── Board (canvas) ── */}
        <div className="plinko-board card">
          <canvas ref={canvasRef} className="plinko-canvas" />
        </div>

        {/* ── Controls panel ── */}
        <div className="plinko-panel">
          <div className="card">
            {/* Status bar */}
            <div className="status-bar">
              <div className="stat">
                <span className="stat-label">BALANCE</span>
                <span className="stat-value cyan">${animBal.toFixed(2)}</span>
              </div>
              <div className="stat">
                <span className="stat-label">BET</span>
                <span className="stat-value">${betAmount.toFixed(2)}</span>
              </div>
              <div className="stat">
                <span className="stat-label">ROWS</span>
                <span className="stat-value gold">{rows}</span>
              </div>
            </div>

            {/* Bet amount */}
            <div className="bet-section">
              <span className="bet-label">BET AMOUNT</span>
              <div className="bet-row">
                <input
                  type="number"
                  className="bet-input"
                  value={betAmount}
                  min={1}
                  max={balance}
                  onChange={e => setBetAmount(Math.max(0, +e.target.value))}
                  disabled={autoDrops !== 0}
                />
                <div className="bet-presets">
                  <button onClick={() => setBetAmount(b => Math.max(1, Math.floor(b / 2)))} disabled={autoDrops !== 0}>½</button>
                  <button onClick={() => setBetAmount(b => Math.min(balance, b * 2))} disabled={autoDrops !== 0}>2×</button>
                </div>
              </div>
            </div>

            {/* Rows selector */}
            <div className="plinko-option-section">
              <span className="bet-label">ROWS</span>
              <div className="bet-presets plinko-presets">
                {[8, 12, 16].map(r => (
                  <button key={r} className={rows === r ? "active" : ""}
                    onClick={() => setRows(r)} disabled={autoDrops !== 0}>{r}</button>
                ))}
              </div>
            </div>

            {/* Risk selector */}
            <div className="plinko-option-section">
              <span className="bet-label">RISK</span>
              <div className="bet-presets plinko-presets">
                {["low", "medium", "high"].map(r => (
                  <button key={r} className={risk === r ? "active" : ""}
                    onClick={() => setRisk(r)} disabled={autoDrops !== 0}>
                    {r[0].toUpperCase() + r.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Drop button */}
            <div className="actions-row">
              <button className="spin-btn" onClick={dropBall} disabled={!betOk || autoDrops !== 0}>
                🎯 DROP BALL
              </button>
            </div>

            {/* Auto-drop */}
            <div className="auto-spin-row">
              {autoDrops !== 0 ? (
                <button className="btn-auto-stop-slots" onClick={stopAuto}>
                  ⏹ STOP {autoDrops === -1 ? "∞" : autoDrops}
                </button>
              ) : (
                <>
                  {[5, 10, 25].map(n => (
                    <button key={n} className="btn-auto-slots" onClick={() => startAuto(n)} disabled={!betOk}>{n}×</button>
                  ))}
                  <button className="btn-auto-slots" onClick={() => startAuto(-1)} disabled={!betOk}>∞</button>
                </>
              )}
            </div>

            {/* Last results */}
            {lastResults.length > 0 && (
              <div className="plinko-results">
                <span className="bet-label">LAST DROPS</span>
                <div className="plinko-result-list">
                  {lastResults.map(r => (
                    <span key={r.id} className="plinko-result-tag"
                      style={{ borderColor: slotColor(r.mult), color: slotColor(r.mult) }}>
                      {r.mult}×
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Reload demo */}
            {balance === 0 && autoDrops === 0 && (
              <div className="game-over-message">
                <p>💸 You're out of demo credits!</p>
                <button className="btn-reload-demo" onClick={() => setBalance(p => p + 1000)}>
                  🔄 Reload $1,000 Demo Balance
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
