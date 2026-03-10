import { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import "./App.css";
import { AchievementProvider } from "./context/AchievementContext";
import AchievementToast from "./components/AchievementToast";
import ParticleBackground from "./components/ParticleBackground";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Roulette from "./pages/Roulette";
import Slots from "./pages/Slots";
import Blackjack from "./pages/Blackjack";
import Crash from "./pages/Crash";
import Mines from "./pages/Mines";
import Achievements from "./pages/Achievements";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);
  return null;
}

const BALANCE_KEY = "luckyspin_balance";

function App() {
  const [balance, setBalance] = useState(() => {
    const saved = localStorage.getItem(BALANCE_KEY);
    return saved !== null ? Number(saved) : 1000;
  });

  useEffect(() => {
    localStorage.setItem(BALANCE_KEY, balance);
  }, [balance]);

  return (
    <AchievementProvider>
    <div className="app-container">
      <ParticleBackground />
      <ScrollToTop />
      <Navbar balance={balance} onResetBalance={() => setBalance(1000)} />

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/roulette" element={<Roulette balance={balance} setBalance={setBalance} />} />
          <Route path="/slots" element={<Slots balance={balance} setBalance={setBalance} />} />
          <Route path="/blackjack" element={<Blackjack balance={balance} setBalance={setBalance} />} />
          <Route path="/crash" element={<Crash balance={balance} setBalance={setBalance} />} />
          <Route path="/mines" element={<Mines balance={balance} setBalance={setBalance} />} />
          <Route path="/achievements" element={<Achievements />} />
        </Routes>
      </main>

      <Footer />
      <AchievementToast />
    </div>
    </AchievementProvider>
  );
}

export default App;