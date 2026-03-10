/**
 * Centralized win-outcome achievement checks.
 * Call this after any winning bet in any game.
 */
export function checkWinAchievements({ betAmount, balance, newBalance, unlock, stats }) {
  unlock('first-win');
  if (betAmount >= balance) unlock('all-in-win');
  if (balance < 100) unlock('comeback');
  if (newBalance >= 2000) {
    unlock('double-up');
    if (stats.hitZero) unlock('survived-zero');
  }
  if (newBalance >= 5000) unlock('balance-5k');
  if (newBalance >= 10000) unlock('balance-10k');
}
