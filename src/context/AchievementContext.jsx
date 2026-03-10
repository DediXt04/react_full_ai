import { createContext, useContext, useState, useCallback, useRef, useEffect } from "react";

const ACHIEVEMENTS = [
  // Bronze (easy)
  { id: "first-spin",      title: "First Spin",        desc: "Spin the roulette for the first time",           rarity: "bronze", icon: "🎡" },
  { id: "first-pull",      title: "First Pull",        desc: "Play the slot machine for the first time",       rarity: "bronze", icon: "🎰" },
  { id: "first-hand",      title: "First Hand",        desc: "Play a hand of blackjack",                       rarity: "bronze", icon: "🃏" },
  { id: "first-win",       title: "Beginner's Luck",   desc: "Win your first bet in any game",                 rarity: "bronze", icon: "🍀" },
  { id: "tried-all",       title: "Explorer",          desc: "Play all 5 games at least once",                 rarity: "bronze", icon: "🧭" },
  { id: "bet-10",          title: "Small Roller",      desc: "Place 10 bets total across all games",           rarity: "bronze", icon: "🎲" },
  { id: "green-bet",       title: "Feeling Lucky",     desc: "Bet on green in roulette",                       rarity: "bronze", icon: "🟢" },

  // Silver (medium)
  { id: "win-streak-3",    title: "On Fire",           desc: "Win 3 bets in a row",                            rarity: "silver", icon: "🔥" },
  { id: "double-up",       title: "Double Up",         desc: "Reach $2,000 balance",                           rarity: "silver", icon: "💵" },
  { id: "bet-50",          title: "Regular",           desc: "Place 50 bets total across all games",           rarity: "silver", icon: "🎯" },
  { id: "slots-triple",    title: "Triple Match",      desc: "Get 3 matching symbols on slots",                rarity: "silver", icon: "💎" },
  { id: "bj-21",           title: "Twenty-One",        desc: "Get exactly 21 in blackjack",                    rarity: "silver", icon: "🎯" },
  { id: "bj-double-win",   title: "Bold Move",         desc: "Win after doubling down in blackjack",           rarity: "silver", icon: "✖️" },
  { id: "roulette-5-wins", title: "Roulette Master",   desc: "Win 5 roulette spins",                           rarity: "silver", icon: "🎡" },
  { id: "comeback",        title: "Comeback Kid",      desc: "Win a bet when balance is below $100",           rarity: "silver", icon: "💪" },
  { id: "all-in-win",      title: "All In!",           desc: "Bet your entire balance and win",                rarity: "silver", icon: "🤑" },

  // Gold (hard)
  { id: "win-streak-7",    title: "Unstoppable",       desc: "Win 7 bets in a row",                            rarity: "gold",   icon: "⚡" },
  { id: "balance-5k",      title: "High Roller",       desc: "Reach $5,000 balance",                           rarity: "gold",   icon: "👑" },
  { id: "balance-10k",     title: "Millionaire Vibes",  desc: "Reach $10,000 balance",                         rarity: "gold",   icon: "💰" },
  { id: "green-win",       title: "Jackpot Hunter",    desc: "Win betting on green in roulette (35:1)",        rarity: "gold",   icon: "🟢" },
  { id: "bj-blackjack",    title: "Natural 21",        desc: "Get a natural blackjack (Ace + face card)",      rarity: "gold",   icon: "🃏" },
  { id: "slots-jackpot",   title: "Slot Lord",         desc: "Hit the jackpot on slots (💎💎💎)",              rarity: "gold",   icon: "💎" },
  { id: "bet-200",         title: "Veteran",           desc: "Place 200 bets total across all games",          rarity: "gold",   icon: "🏆" },
  { id: "survived-zero",   title: "Phoenix",           desc: "Go to $0 balance, reset, and reach $2,000",     rarity: "gold",   icon: "🔥" },

  // Crash-specific
  { id: "first-crash",     title: "Rocket Rider",      desc: "Play crash for the first time",                  rarity: "bronze", icon: "🚀" },
  { id: "crash-5x",        title: "Diamond Hands",     desc: "Cash out at 5× or higher in crash",              rarity: "silver", icon: "💎" },
  { id: "crash-close-call",title: "Close Call",         desc: "Cash out within 0.1× of the crash point",        rarity: "silver", icon: "😰" },
  { id: "crash-10x",       title: "To The Moon",       desc: "Cash out at 10× or higher in crash",             rarity: "gold",   icon: "🌙" },

  // Mines-specific
  { id: "first-mine",      title: "Bomb Defuser",      desc: "Play mines for the first time",                  rarity: "bronze", icon: "💣" },
  { id: "mines-10-gems",   title: "Gem Collector",      desc: "Reveal 10 gems in a single mines round",        rarity: "silver", icon: "💎" },
  { id: "mines-sweep",     title: "Mine Sweeper",       desc: "Reveal ALL safe tiles without hitting a mine",  rarity: "gold",   icon: "🧹" },

];

const ACH_STORAGE_KEY = "luckyspin_achievements";
const STATS_STORAGE_KEY = "luckyspin_ach_stats";

const AchievementContext = createContext(null);

export function AchievementProvider({ children }) {
  const [unlocked, setUnlocked] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(ACH_STORAGE_KEY)) || [];
    } catch { return []; }
  });

  const [stats, setStats] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STATS_STORAGE_KEY)) || {
        totalBets: 0, winStreak: 0, maxWinStreak: 0,
        rouletteWins: 0, slotsPlayed: 0, roulettePlayed: 0, bjPlayed: 0, crashPlayed: 0, minesPlayed: 0,
        hitZero: false, greenBet: false,
      };
    } catch {
      return {
        totalBets: 0, winStreak: 0, maxWinStreak: 0,
        rouletteWins: 0, slotsPlayed: 0, roulettePlayed: 0, bjPlayed: 0, crashPlayed: 0, minesPlayed: 0,
        hitZero: false, greenBet: false,
      };
    }
  });

  const [toast, setToast] = useState(null);
  const toastTimeout = useRef(null);

  const persistUnlocked = (list) => {
    localStorage.setItem(ACH_STORAGE_KEY, JSON.stringify(list));
  };
  const persistStats = (s) => {
    localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(s));
  };

  const unlock = useCallback((id) => {
    setUnlocked(prev => {
      if (prev.includes(id)) return prev;
      const next = [...prev, id];
      persistUnlocked(next);

      const ach = ACHIEVEMENTS.find(a => a.id === id);
      if (ach) {
        setToast(ach);
        if (toastTimeout.current) clearTimeout(toastTimeout.current);
        toastTimeout.current = setTimeout(() => setToast(null), 3500);
      }

      return next;
    });
  }, []);

  const updateStats = useCallback((update) => {
    setStats(prev => {
      const next = { ...prev, ...update(prev) };
      persistStats(next);
      return next;
    });
  }, []);

  const dismissToast = useCallback(() => {
    setToast(null);
    if (toastTimeout.current) clearTimeout(toastTimeout.current);
  }, []);

  // Centralized stats-based achievement checks
  useEffect(() => {
    if (stats.totalBets >= 10) unlock('bet-10');
    if (stats.totalBets >= 50) unlock('bet-50');
    if (stats.totalBets >= 200) unlock('bet-200');
    if (stats.maxWinStreak >= 3) unlock('win-streak-3');
    if (stats.maxWinStreak >= 7) unlock('win-streak-7');
    if (stats.rouletteWins >= 5) unlock('roulette-5-wins');
    if (stats.roulettePlayed > 0 && stats.slotsPlayed > 0 && stats.bjPlayed > 0 && (stats.crashPlayed || 0) > 0 && (stats.minesPlayed || 0) > 0) unlock('tried-all');
  }, [stats, unlock]);

  return (
    <AchievementContext.Provider value={{
      achievements: ACHIEVEMENTS,
      unlocked,
      stats,
      toast,
      unlock,
      updateStats,
      dismissToast,
    }}>
      {children}
    </AchievementContext.Provider>
  );
}

export function useAchievements() {
  const ctx = useContext(AchievementContext);
  if (!ctx) throw new Error("useAchievements must be used within AchievementProvider");
  return ctx;
}
