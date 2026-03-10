import { useState } from "react";
import { useAchievements } from "../context/AchievementContext";
import "./Achievements.css";

const RARITY_ORDER = { gold: 0, silver: 1, bronze: 2 };
const FILTERS = [
  { key: "all",      label: "All" },
  { key: "gold",     label: "🥇 Gold" },
  { key: "silver",   label: "🥈 Silver" },
  { key: "bronze",   label: "🥉 Bronze" },
  { key: "unlocked", label: "✅ Unlocked" },
  { key: "locked",   label: "🔒 Locked" },
];

export default function Achievements() {
  const { achievements, unlocked } = useAchievements();
  const [filter, setFilter] = useState("all");

  const sorted = [...achievements].sort((a, b) => RARITY_ORDER[a.rarity] - RARITY_ORDER[b.rarity]);
  const total = achievements.length;
  const done = unlocked.length;
  const pct = Math.round((done / total) * 100);
  const byRarity = (r) => achievements.filter(a => a.rarity === r);
  const unlockedOf = (r) => byRarity(r).filter(a => unlocked.includes(a.id)).length;

  const filtered = sorted.filter(ach => {
    const isUnlocked = unlocked.includes(ach.id);
    if (filter === "all") return true;
    if (filter === "unlocked") return isUnlocked;
    if (filter === "locked") return !isUnlocked;
    return ach.rarity === filter;
  });

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
          {[["bronze", "🥉"], ["silver", "🥈"], ["gold", "🥇"]].map(([r, icon]) => (
            <div key={r} className={`ach-rc-badge ${r}`}>
              <span className="ach-rc-icon">{icon}</span>
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

      {/* Grid */}
      <div className="ach-grid">
        {filtered.map((ach, i) => {
          const isUnlocked = unlocked.includes(ach.id);
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

      {filtered.length === 0 && (
        <div className="ach-empty">No achievements match this filter.</div>
      )}
    </div>
  );
}
