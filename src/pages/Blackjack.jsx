import { useState, useCallback, useEffect, useRef } from "react";
import useAnimatedNumber from "../hooks/useAnimatedNumber";
import { useAchievements } from "../context/AchievementContext";
import { checkWinAchievements } from "../utils/achievementHelpers";
import "./Blackjack.css";

// ─── Deck ────────────────────────────────────────────────────────────────────
const SUITS = ["♠", "♥", "♦", "♣"];
const RANKS = ["A","2","3","4","5","6","7","8","9","10","J","Q","K"];

function makeDeck() {
  const d = [];
  for (const suit of SUITS)
    for (const rank of RANKS)
      d.push({ suit, rank });
  return d;
}

function shuffle(deck) {
  const d = [...deck];
  for (let i = d.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [d[i], d[j]] = [d[j], d[i]];
  }
  return d;
}

function isRed(suit) { return suit === "♥" || suit === "♦"; }

function cardValue(rank) {
  if (rank === "A") return 11;
  if (["J","Q","K"].includes(rank)) return 10;
  return parseInt(rank);
}

function handTotal(hand) {
  let total = 0;
  let aces = 0;
  for (const c of hand) {
    total += cardValue(c.rank);
    if (c.rank === "A") aces++;
  }
  while (total > 21 && aces > 0) {
    total -= 10;
    aces--;
  }
  return total;
}

function isBust(hand)      { return handTotal(hand) > 21; }
function isBlackjack(hand) { return hand.length === 2 && handTotal(hand) === 21; }

// ─── Component ───────────────────────────────────────────────────────────────
export default function Blackjack({ balance, setBalance }) {
  const [deck,        setDeck]        = useState([]);
  const [playerHand,  setPlayerHand]  = useState([]);
  const [dealerHand,  setDealerHand]  = useState([]);
  const [stage,       setStage]       = useState("idle"); // idle | playing | dealer | result
  const [betAmount,   setBetAmount]   = useState(50);
  const [lockedBet,   setLockedBet]   = useState(0);
  const [result,      setResult]      = useState(null);  // win | lose | push | blackjack
  const [message,     setMessage]     = useState("");
  const [history,     setHistory]     = useState([]);
  const [showDealer,  setShowDealer]  = useState(false);
  const [stats, setStats] = useState({ wins: 0, losses: 0, pushes: 0 });
  const [doubled, setDoubled] = useState(false);
  const balanceAtDeal = useRef(0);
  const animatedBalance = useAnimatedNumber(balance);
  const { unlock, updateStats, stats: achStats } = useAchievements();

  // ── Deal ──
  const handleDeal = useCallback(() => {
    if (betAmount <= 0 || betAmount > balance) {
      setMessage(betAmount <= 0 ? "❌ Bet must be greater than 0" : "❌ Insufficient balance");
      return;
    }

    const d = shuffle(makeDeck());
    const pH = [d[0], d[2]];
    const dH = [d[1], d[3]];
    const remaining = d.slice(4);

    setDeck(remaining);
    setPlayerHand(pH);
    setDealerHand(dH);
    setShowDealer(false);
    setResult(null);
    setMessage("");
    setLockedBet(betAmount);
    setDoubled(false);
    balanceAtDeal.current = balance;
    setBalance(prev => prev - betAmount);
    setStage("playing");

    // Check player blackjack immediately
    if (isBlackjack(pH)) {
      // Reveal dealer
      setShowDealer(true);
      if (isBlackjack(dH)) {
        // Push
        setTimeout(() => endGame("push", betAmount, dH, pH, remaining), 600);
      } else {
        setTimeout(() => endGame("blackjack", betAmount, dH, pH, remaining), 600);
      }
    }
  }, [betAmount, balance, setBalance]);

  // ── Hit ──
  const handleHit = useCallback(() => {
    if (stage !== "playing") return;
    const newCard = deck[0];
    const remaining = deck.slice(1);
    const newHand = [...playerHand, newCard];
    setDeck(remaining);
    setPlayerHand(newHand);

    if (isBust(newHand)) {
      setShowDealer(true);
      setTimeout(() => endGame("lose", lockedBet, dealerHand, newHand, remaining), 500);
    }
  }, [stage, deck, playerHand, dealerHand, lockedBet]);

  // ── Stand ──
  const handleStand = useCallback(() => {
    if (stage !== "playing") return;
    setStage("dealer");
    setShowDealer(true);
    runDealer(deck, dealerHand, playerHand);
  }, [stage, deck, dealerHand, playerHand]);

  // ── Double Down ──
  const handleDouble = useCallback(() => {
    if (stage !== "playing" || playerHand.length !== 2) return;
    if (lockedBet > balance) { setMessage("❌ Insufficient balance to double"); return; }

    setBalance(prev => prev - lockedBet);
    const newBet = lockedBet * 2;
    setLockedBet(newBet);
    setDoubled(true);

    const newCard = deck[0];
    const remaining = deck.slice(1);
    const newHand = [...playerHand, newCard];
    setDeck(remaining);
    setPlayerHand(newHand);
    setStage("dealer");
    setShowDealer(true);

    if (isBust(newHand)) {
      setTimeout(() => endGame("lose", newBet, dealerHand, newHand, remaining), 500);
    } else {
      setTimeout(() => runDealer(remaining, dealerHand, newHand, newBet), 400);
    }
  }, [stage, playerHand, deck, dealerHand, lockedBet, balance, setBalance]);

  // ── Dealer plays ──
  const runDealer = (deckIn, dHand, pHand, bet) => {
    const currentBet = bet ?? lockedBet;
    let dH = [...dHand];
    let dk = [...deckIn];

    const dealerDraw = () => {
      if (handTotal(dH) < 17) {
        dH = [...dH, dk[0]];
        dk = dk.slice(1);
        setDealerHand([...dH]);
        setDeck([...dk]);
        setTimeout(dealerDraw, 600);
      } else {
        // Evaluate
        const pTotal = handTotal(pHand);
        const dTotal = handTotal(dH);
        let outcome;
        if (isBust(dH))          outcome = "win";
        else if (pTotal > dTotal) outcome = "win";
        else if (pTotal < dTotal) outcome = "lose";
        else                     outcome = "push";
        endGame(outcome, currentBet, dH, pHand, dk);
      }
    };
    setTimeout(dealerDraw, 400);
  };

  // ── End game ──
  const endGame = (outcome, bet, dH, pH, dk) => {
    setStage("result");
    setResult(outcome);
    setShowDealer(true);
    setDealerHand(dH);
    setDeck(dk);

    let payout = 0;
    let msg = "";
    if (outcome === "blackjack") {
      payout = bet + Math.floor(bet * 1.5);
      msg = `🃏 BLACKJACK! +$${payout}`;
    } else if (outcome === "win") {
      payout = bet * 2;
      msg = `✅ You win! +$${payout}`;
    } else if (outcome === "push") {
      payout = bet;
      msg = `🤝 Push — bet returned`;
    } else {
      msg = `❌ Dealer wins. -$${bet}`;
    }

    if (payout > 0) setBalance(prev => prev + payout);
    setMessage(msg);

    setStats(prev => ({
      wins:   prev.wins   + (outcome === "win" || outcome === "blackjack" ? 1 : 0),
      losses: prev.losses + (outcome === "lose" ? 1 : 0),
      pushes: prev.pushes + (outcome === "push" ? 1 : 0),
    }));

    setHistory(prev => [
      { outcome, bet, payout, playerTotal: handTotal(pH), dealerTotal: handTotal(dH) },
      ...prev.slice(0, 7)
    ]);

    // Achievement triggers
    unlock('first-hand');
    const isWin = outcome === "win" || outcome === "blackjack";
    const newBalance = balanceAtDeal.current - bet + (payout || 0);
    updateStats(prev => {
      const newStreak = isWin ? prev.winStreak + 1 : 0;
      const newLossStreak = isWin ? 0 : (prev.lossStreak || 0) + 1;
      return {
        totalBets: prev.totalBets + 1,
        bjPlayed: prev.bjPlayed + 1,
        winStreak: newStreak,
        maxWinStreak: Math.max(prev.maxWinStreak, newStreak),
        lossStreak: newLossStreak,
        maxLossStreak: Math.max(prev.maxLossStreak || 0, newLossStreak),
        hitZero: prev.hitZero || newBalance <= 0,
      };
    });
    if (bet >= 500) unlock('big-bet');
    if (isWin) {
      if (handTotal(pH) === 21) unlock('bj-21');
      if (outcome === "blackjack") unlock('bj-blackjack');
      if (doubled) unlock('bj-double-win');
      if (pH.length >= 5) unlock('bj-5-card');
      checkWinAchievements({ betAmount: bet, balance: balanceAtDeal.current, newBalance, unlock, stats: achStats });
    }
  };

  // ── Derived ──
  const playerTotal = handTotal(playerHand);
  const dealerTotal = handTotal(dealerHand);
  const canDouble   = stage === "playing" && playerHand.length === 2 && lockedBet <= balance;

  const resultColor = result === "win" || result === "blackjack" ? "win"
    : result === "lose" ? "lose" : "push";

  return (
    <div className="bj-page fade-in">

      {/* ── Header ── */}
      <div className="bj-header">
        <div className="bj-title-wrap">
          <span className="bj-title-icon">🃏</span>
          <h2>Blackjack</h2>
        </div>
        <div className="bj-chips-row">
          <div className="bj-chip">
            <span className="bj-chip-label">Balance</span>
            <span className="bj-chip-val cyan">${animatedBalance.toFixed(0)}</span>
          </div>
          {lockedBet > 0 && (
            <div className="bj-chip bj-chip-bet">
              <span className="bj-chip-label">Bet</span>
              <span className="bj-chip-val gold">${lockedBet}</span>
            </div>
          )}
          <div className="bj-chip">
            <span className="bj-chip-label">W / L / D</span>
            <span className="bj-chip-val stats">{stats.wins} / {stats.losses} / {stats.pushes}</span>
          </div>
        </div>
      </div>

      <div className="bj-layout">

        {/* ── Table ── */}
        <div className="bj-table-wrap">
          <div className="bj-table">

            {/* Dealer */}
            <div className="bj-hand-section dealer-section">
              <div className="bj-hand-label">
                🤖 Dealer
                {dealerHand.length > 0 && (
                  <span className="bj-total">{showDealer ? dealerTotal : "?"}</span>
                )}
              </div>
              <div className="bj-cards">
                {stage === "idle"
                  ? <div className="bj-card bj-card-empty" />
                  : dealerHand.map((c, i) => {
                      const isHidden = i === 1;
                      if (isHidden) {
                        return (
                          <div key={i} className="bj-card-flip" style={{ animation: 'card-in 0.3s cubic-bezier(.2,1.4,.4,1) forwards' }}>
                            <div className={`bj-card-flip-inner ${showDealer ? "flipped" : ""}`}>
                              <div className="bj-card-flip-front">
                                <span className="bj-back-icon">🂠</span>
                              </div>
                              <div className={`bj-card-flip-back ${isRed(c.suit) ? "red" : "black"}`}>
                                <span className="bj-rank">{c.rank}</span>
                                <span className="bj-suit">{c.suit}</span>
                              </div>
                            </div>
                          </div>
                        );
                      }
                      return (
                        <div key={i} className={`bj-card ${isRed(c.suit) ? "red" : "black"} ${result && (result === "lose" || result === "push") && !isBust(dealerHand) ? "" : ""}`}>
                          <span className="bj-rank">{c.rank}</span>
                          <span className="bj-suit">{c.suit}</span>
                        </div>
                      );
                    })
                }
              </div>
              {stage === "result" && isBust(dealerHand) && (
                <div className="bj-bust-badge">BUST!</div>
              )}
            </div>

            {/* Center line */}
            <div className="bj-divider">
              {stage !== "idle" && stage !== "result" && (
                <div className="bj-turn-indicator">
                  {stage === "playing" ? "Your turn" : "Dealer playing…"}
                </div>
              )}
              {result && (
                <div className={`bj-result-badge ${resultColor}`}>
                  {result === "blackjack" ? "BLACKJACK!" : result === "win" ? "WIN" : result === "lose" ? "LOSS" : "PUSH"}
                </div>
              )}
            </div>

            {/* Player */}
            <div className="bj-hand-section player-section">
              <div className="bj-cards">
                {stage === "idle"
                  ? <div className="bj-card bj-card-empty" />
                  : playerHand.map((c, i) => (
                      <div key={i} className={`bj-card ${isRed(c.suit) ? "red" : "black"} bj-card-player ${result === "win" || result === "blackjack" ? "bj-card-winner" : ""}`}>
                        <span className="bj-rank">{c.rank}</span>
                        <span className="bj-suit">{c.suit}</span>
                      </div>
                    ))
                }
              </div>
              <div className="bj-hand-label player-label">
                🧑 You
                {playerHand.length > 0 && (
                  <span className={`bj-total ${playerTotal > 21 ? "bust" : playerTotal === 21 ? "blackjack-total" : ""}`}>
                    {playerTotal}{playerTotal > 21 ? " BUST" : ""}
                  </span>
                )}
              </div>
              {stage === "result" && isBust(playerHand) && (
                <div className="bj-bust-badge player">BUST!</div>
              )}
            </div>

          </div>

          {/* Message */}
          {message && (
            <div className={`bj-message ${resultColor}`}>{message}</div>
          )}

          {/* ── Controls ── */}
          <div className="bj-controls">
            {stage === "idle" || stage === "result" ? (
              <div className="bj-bet-section">
                <div className="bj-bet-row">
                  <label className="bj-bet-label">Bet</label>
                  <div className="bj-presets">
                    {[10, 25, 50, 100, 250].map(v => (
                      <button key={v} className={`bj-preset ${betAmount === v ? "active" : ""}`}
                        onClick={() => setBetAmount(Math.min(v, balance))}
                        disabled={v > balance}>
                        ${v}
                      </button>
                    ))}
                    <button className="bj-preset" onClick={() => setBetAmount(Math.floor(balance))}>All</button>
                  </div>
                  <input
                    type="number" min="1" max={Math.floor(balance)}
                    value={betAmount}
                    onChange={e => setBetAmount(Math.max(1, Math.min(Math.floor(balance), parseInt(e.target.value) || 0)))}
                    className="bj-input"
                  />
                </div>
                <button className="bj-btn-deal" onClick={handleDeal} disabled={balance < 1}>
                  {stage === "idle" ? "🃏 Deal Cards" : "🔄 New Hand"}
                </button>
                {balance === 0 && (
                  <div className="game-over-message" style={{ marginTop: '0.75rem' }}>
                    <p>😢 You ran out of credits!</p>
                    <button className="btn-reload-demo" onClick={() => setBalance(p => p + 1000)}>
                      + Reload Demo ($1,000)
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="bj-action-row">
                <button className="bj-action bj-hit"    onClick={handleHit}    disabled={stage !== "playing"}>
                  ➕ Hit
                </button>
                <button className="bj-action bj-stand"  onClick={handleStand}  disabled={stage !== "playing"}>
                  ✋ Stand
                </button>
                <button className="bj-action bj-double" onClick={handleDouble} disabled={!canDouble}>
                  ✖️ Double
                </button>
              </div>
            )}
          </div>

        </div>

        {/* ── Side panel ── */}
        <div className="bj-side">

          {/* Rules card */}
          <div className="bj-panel">
            <h4>How to Play</h4>
            <div className="bj-rules">
              <div className="bj-rule"><span className="rule-icon">🎯</span><span>Get closer to 21 than the dealer without going over</span></div>
              <div className="bj-rule"><span className="rule-icon">➕</span><span><strong>Hit</strong> — Draw one more card</span></div>
              <div className="bj-rule"><span className="rule-icon">✋</span><span><strong>Stand</strong> — Keep your current cards</span></div>
              <div className="bj-rule"><span className="rule-icon">✖️</span><span><strong>Double</strong> — Double your bet, receive 1 card</span></div>
              <div className="bj-rule"><span className="rule-icon">🃏</span><span><strong>Blackjack</strong> — Ace + face card = pays 3:2</span></div>
              <div className="bj-rule"><span className="rule-icon">🤖</span><span>Dealer stands on 17 or higher</span></div>
            </div>
          </div>

          {/* Card values */}
          <div className="bj-panel">
            <h4>Card Values</h4>
            <div className="bj-values">
              <div className="bj-val-row"><span>A</span><span>1 or 11</span></div>
              <div className="bj-val-row"><span>J / Q / K</span><span>10</span></div>
              <div className="bj-val-row"><span>2 – 10</span><span>Face value</span></div>
            </div>
          </div>

          {/* History */}
          {history.length > 0 && (
            <div className="bj-panel">
              <h4>History</h4>
              <div className="bj-history">
                {history.map((h, i) => (
                  <div key={i} className={`bj-hist-row ${h.outcome === "win" || h.outcome === "blackjack" ? "win" : h.outcome === "lose" ? "lose" : "push"}`}>
                    <span className="hist-label">
                      {h.outcome === "blackjack" ? "🃏 BJ" : h.outcome === "win" ? "✓ Win" : h.outcome === "lose" ? "✗ Lose" : "= Push"}
                    </span>
                    <span className="hist-totals">{h.playerTotal} vs {h.dealerTotal}</span>
                    <span className="hist-amt">
                      {h.outcome === "lose" ? `-$${h.bet}` : h.outcome === "push" ? `±$0` : `+$${h.payout}`}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Payouts */}
          <div className="bj-panel">
            <h4>Payouts</h4>
            <div className="bj-payouts">
              <div className="bj-payout-row"><span>Blackjack</span><span className="payout-val gold">3:2</span></div>
              <div className="bj-payout-row"><span>Win</span><span className="payout-val green">1:1</span></div>
              <div className="bj-payout-row"><span>Push</span><span className="payout-val">Returns</span></div>
              <div className="bj-payout-row"><span>Loss</span><span className="payout-val red">-1:1</span></div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}