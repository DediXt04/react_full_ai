import { useState } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Roulette from "./pages/Roulette";
import Slots from "./pages/Slots";
import Blackjack from "./pages/Blackjack";

function App() {
  // Global state for user balance (fake demo credits)
  const [balance, setBalance] = useState(1000);
  const [currentPage, setCurrentPage] = useState("home");

  // Handle navigation
  const navigate = (page) => {
    setCurrentPage(page);
    // Scroll to top
    window.scrollTo(0, 0);
  };

  return (
    <div className="app-container">
      <Navbar
        balance={balance}
        currentPage={currentPage}
        onNavigate={navigate}
      />

      <main className="main-content">
        {currentPage === "home" && <Home onNavigate={navigate} />}
        {currentPage === "roulette" && (
          <Roulette balance={balance} setBalance={setBalance} />
        )}
        {currentPage === "slots" && (
          <Slots balance={balance} setBalance={setBalance} />
        )}
        {currentPage === "blackjack" && (
          <Blackjack balance={balance} setBalance={setBalance} />
        )}
      </main>

      <Footer />
    </div>
  );
}

export default App;
