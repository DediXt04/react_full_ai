import { useAchievements } from "../context/AchievementContext";
import "./AchievementToast.css";

export default function AchievementToast() {
  const { toast, dismissToast } = useAchievements();
  if (!toast) return null;

  return (
    <div className={`ach-toast ach-toast-${toast.rarity}`} onClick={dismissToast}>
      <div className="ach-toast-icon">{toast.icon}</div>
      <div className="ach-toast-body">
        <div className="ach-toast-label">🏆 Achievement Unlocked!</div>
        <div className="ach-toast-title">{toast.title}</div>
        <div className="ach-toast-desc">{toast.desc}</div>
      </div>
      <div className={`ach-toast-rarity ach-rarity-${toast.rarity}`}>
        {toast.rarity.toUpperCase()}
      </div>
    </div>
  );
}
