import { useState } from "react";
import { useAchievements } from "../context/AchievementContext";
import "./Achievements.css";

const RARITY_ORDER = ["bronze", "silver", "gold", "legendary"];
const RARITY_META = {
  bronze:    { icon: "🥉", label: "Bronze" },
  silver:    { icon: "🥈", label: "Silver" },
  gold:      { icon: "🥇", label: "Gold" },
  legendary: { icon: "💜", label: "Legendary" },
};
const FILTERS = [
  { key: "all",      label: "All" },
  { key: "bronze",   label: "🥉 Bronze" },
  { key: "silver",   label: "🥈 Silver" },
  { key: "gold",     label: "🥇 Gold" },
  { key: "legendary", label: "💜 Legendary" },
  { key: "unlocked", label: "✅ Unlocked" },
  { key: "locked",   label: "🔒 Locked" },
];

export default function Achievements() {
  const { achievements, unlocked } = useAchievements();
  const [filter, setFilter] = useState("all");

  const total = achievements.length;
  const done = unlocked.length;
  const pct = Math.round((done / total) * 100);
  const byRarity = (r) => achievements.filter(a => a.rarity === r);
  const unlockedOf = (r) => byRarity(r).filter(a => unlocked.includes(a.id)).length;

  const filtered = achievements.filter(ach => {
    const isUnlocked = unlocked.includes(ach.id);
    if (filter === "all") return true;
    if (filter === "unlocked") return isUnlocked;
    if (filter === "locked") return !isUnlocked;
    return ach.rarity === filter;
  });

  // Group by rarity, unlocked first within each group
  const grouped = RARITY_ORDER
    .map(r => ({
      rarity: r,
      ...RARITY_META[r],
      items: filtered
        .filter(a => a.rarity === r)
        .sort((a, b) => {
          const aU = unlocked.includes(a.id) ? 0 : 1;
          const bU = unlocked.includes(b.id) ? 0 : 1;
          return aU - bU;
        }),
    }))
    .filter(g => g.items.length > 0);

  let cardIndex = 0;

  return (
    <div className="ach-page fade-in">
      {/* Header */}
      <div className="ach-header">
        <div className="ach-title-wrap">
          <span className="ach-title-icon">🏆</span>
          <h2>ACHIEVEMENTS</h2>
        </div>

        <div className="ach-progress-section">
          <div className="ach-progress-bar">
            <div className="ach-progress-fill" style={{ width: `${pct}%` }}>
              {pct > 8 && <span className="ach-progress-pct">{pct}%</span>}
            </div>
          </div>
          <span className="ach-progress-text">{done} / {total}</span>
        </div>

        <div className="ach-rarity-counts">
          {RARITY_ORDER.map(r => (
            <div key={r} className={`ach-rc-badge ${r}`}>
              <span className="ach-rc-icon">{RARITY_META[r].icon}</span>
              <span className="ach-rc-num">{unlockedOf(r)}/{byRarity(r).length}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="ach-filters">
        {FILTERS.map(f => (
          <button
            key={f.key}
            className={`ach-filter-btn ${filter === f.key ? "active" : ""}`}
            onClick={() => setFilter(f.key)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Grouped by rarity */}
      {grouped.map(group => (
        <div key={group.rarity} className="ach-section">
          <div className={`ach-section-header ${group.rarity}`}>
            <span className="ach-section-icon">{group.icon}</span>
            <span className="ach-section-label">{group.label}</span>
            <span className="ach-section-count">{unlockedOf(group.rarity)}/{byRarity(group.rarity).length}</span>
          </div>
          <div className="ach-grid">
            {group.items.map(ach => {
              const isUnlocked = unlocked.includes(ach.id);
              const i = cardIndex++;
              return (
                <div
                  key={ach.id}
                  className={`ach-card ${ach.rarity} ${isUnlocked ? "unlocked" : "locked"}`}
                  style={{ "--i": i }}
                >
                  <div className="ach-card-icon">{isUnlocked ? ach.icon : "🔒"}</div>
                  <div className="ach-card-body">
                    <div className="ach-card-title">{isUnlocked ? ach.title : "???"}</div>
                    <div className="ach-card-desc">{ach.desc}</div>
                  </div>
                  <div className={`ach-card-rarity ach-rarity-${ach.rarity}`}>
                    {ach.rarity.toUpperCase()}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {filtered.length === 0 && (
        <div className="ach-empty">No achievements match this filter.</div>
      )}
    </div>
  );
}
