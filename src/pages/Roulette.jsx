import { useState, useRef, useEffect } from 'react'
import './Roulette.css'

function Roulette({ balance, setBalance }) {
  const [betAmount, setBetAmount] = useState(100)
  const [selectedColor, setSelectedColor] = useState('red')
  const [isSpinning, setIsSpinning] = useState(false)
  const [result, setResult] = useState(null)
  const [resultMessage, setResultMessage] = useState('')
  const [spinHistory, setSpinHistory] = useState([])
  const [rotation, setRotation] = useState(0)
  const currentRotation = useRef(0)

  const rouletteNumbers = [
    0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5,
    24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26
  ]

  const getNumberColor = (num) => {
    if (num === 0) return 'green'
    const redNumbers = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36]
    return redNumbers.includes(num) ? 'red' : 'black'
  }

  const segmentAngle = 360 / rouletteNumbers.length

  // Build SVG pie segments
  const buildSegments = () => {
    const cx = 200, cy = 200, r = 195, textR = 160
    return rouletteNumbers.map((num, i) => {
      const startAngle = (i * segmentAngle - 90) * (Math.PI / 180)
      const endAngle = ((i + 1) * segmentAngle - 90) * (Math.PI / 180)

      const x1 = cx + r * Math.cos(startAngle)
      const y1 = cy + r * Math.sin(startAngle)
      const x2 = cx + r * Math.cos(endAngle)
      const y2 = cy + r * Math.sin(endAngle)

      const midAngle = (startAngle + endAngle) / 2
      const tx = cx + textR * Math.cos(midAngle)
      const ty = cy + textR * Math.sin(midAngle)
      const textRotation = (midAngle * 180) / Math.PI + 90

      const color = getNumberColor(num)
      const fillColor = color === 'red' ? '#dc2626' : color === 'green' ? '#059669' : '#1f2937'
      const strokeColor = color === 'red' ? '#ef4444' : color === 'green' ? '#10b981' : '#374151'

      return (
        <g key={num}>
          <path
            d={`M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2} Z`}
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth="1.5"
          />
          <text
            x={tx}
            y={ty}
            fill="white"
            fontSize="11"
            fontWeight="800"
            textAnchor="middle"
            dominantBaseline="middle"
            transform={`rotate(${textRotation}, ${tx}, ${ty})`}
            style={{ textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}
          >
            {num}
          </text>
        </g>
      )
    })
  }

  const handleSpin = () => {
    if (betAmount <= 0) {
      setResultMessage('❌ Bet amount must be greater than 0')
      return
    }
    if (betAmount > balance) {
      setResultMessage('❌ Insufficient demo credits for this bet')
      return
    }
    if (!selectedColor) {
      setResultMessage('❌ Please select a color')
      return
    }

    setIsSpinning(true)
    setResultMessage('')
    setResult(null)

    const winningIndex = Math.floor(Math.random() * rouletteNumbers.length)
    const winningNumber = rouletteNumbers[winningIndex]
    const winningColor = getNumberColor(winningNumber)

    // FORMULA VERIFICADA:
    // Centro do segmento W no SVG = W*segmentAngle + segmentAngle/2 - 90
    // Ponteiro no topo = angulo de tela 270. Precisamos: centerW + R = 270 (mod 360)
    // R_landing = (270 - centerW + 360) mod 360
    const centerW = winningIndex * segmentAngle + segmentAngle / 2 - 90
    const rLanding = ((270 - centerW) % 360 + 360) % 360
    const currentMod = ((currentRotation.current % 360) + 360) % 360
    const diff = ((rLanding - currentMod) + 360) % 360
    const extraSpins = 360 * 8
    const targetRotation = currentRotation.current + extraSpins + diff

    currentRotation.current = targetRotation
    setRotation(targetRotation)

    setTimeout(() => {
      const playerWon = winningColor === selectedColor
      let newBalance = balance
      let winnings = 0

      if (playerWon) {
        winnings = selectedColor === 'green' ? betAmount * 35 : betAmount
        newBalance = balance + winnings
      } else {
        newBalance = balance - betAmount
      }

      setBalance(newBalance)
      setResult({ winningNumber, winningColor, playerWon, winnings })

      if (playerWon) {
        if (selectedColor === 'green') {
          setResultMessage(`🎉 JACKPOT! Você ganhou $${winnings.toFixed(2)} no Verde ${winningNumber}!`)
        } else {
          setResultMessage(`✨ Você ganhou $${winnings.toFixed(2)} no ${selectedColor.toUpperCase()}!`)
        }
      } else {
        setResultMessage(`❌ Você perdeu $${betAmount.toFixed(2)}. A bola parou no ${winningColor.toUpperCase()} ${winningNumber}`)
      }

      setSpinHistory(prev => [
        {
          number: winningNumber,
          color: winningColor,
          bet: betAmount,
          won: playerWon,
          timestamp: new Date().toLocaleTimeString()
        },
        ...prev.slice(0, 9)
      ])

      setIsSpinning(false)
    }, 4000)
  }

  const handleReset = () => {
    setResult(null)
    setResultMessage('')
    setBetAmount(100)
    setSelectedColor('red')
  }

  return (
    <div className="roulette-page fade-in">
      <div className="roulette-container">

        {/* Left: Betting */}
        <div className="betting-section">
          <h2>Place Your Bet</h2>

          <div className="balance-info card">
            <div className="balance-item">
              <span className="label">Current Balance</span>
              <span className="amount">${balance.toFixed(2)}</span>
            </div>
            <div className="balance-item">
              <span className="label">Bet Amount</span>
              <span className="amount">${betAmount.toFixed(2)}</span>
            </div>
          </div>

          <div className="form-group">
            <label>Bet Amount ($)</label>
            <div className="bet-input-group">
              <button className="btn-preset" onClick={() => setBetAmount(Math.max(10, Math.floor(balance / 10)))} disabled={isSpinning}>1/10</button>
              <button className="btn-preset" onClick={() => setBetAmount(Math.max(10, Math.floor(balance / 5)))} disabled={isSpinning}>1/5</button>
              <button className="btn-preset" onClick={() => setBetAmount(Math.max(10, Math.floor(balance / 2)))} disabled={isSpinning}>1/2</button>
              <button className="btn-preset" onClick={() => setBetAmount(Math.floor(balance))} disabled={isSpinning}>All In</button>
            </div>
            <input
              type="number"
              min="1"
              max={Math.floor(balance)}
              value={Math.floor(betAmount)}
              onChange={(e) => setBetAmount(Math.max(1, Math.min(Math.floor(balance), parseInt(e.target.value) || 0)))}
              disabled={isSpinning}
            />
          </div>

          <div className="form-group">
            <label>Select Color</label>
            <div className="color-buttons">
              <button className={`color-btn red-btn ${selectedColor === 'red' ? 'active' : ''}`} onClick={() => setSelectedColor('red')} disabled={isSpinning}>🔴 RED</button>
              <button className={`color-btn black-btn ${selectedColor === 'black' ? 'active' : ''}`} onClick={() => setSelectedColor('black')} disabled={isSpinning}>⚫ BLACK</button>
              <button className={`color-btn green-btn ${selectedColor === 'green' ? 'active' : ''}`} onClick={() => setSelectedColor('green')} disabled={isSpinning}>🟢 GREEN</button>
            </div>
            <p className="color-info">
              {selectedColor === 'green' ? '🟢 GREEN paga 35:1 (Alto Risco, Alto Retorno)' : `${selectedColor.toUpperCase()} paga 1:1`}
            </p>
          </div>

          <button className="btn-primary btn-spin" onClick={handleSpin} disabled={isSpinning || balance === 0}>
            {isSpinning ? '🎡 GIRANDO...' : '🎰 GIRAR A ROLETA'}
          </button>

          <button className="btn-secondary" onClick={handleReset} disabled={isSpinning} style={{ width: '100%', marginTop: '1rem' }}>
            Reset Bet
          </button>

          {resultMessage && (
            <div className={`result-message ${result?.playerWon ? 'win' : 'lose'}`}>
              {resultMessage}
            </div>
          )}

          {balance === 0 && (
            <div className="game-over-message card">
              <p>😢 Você ficou sem créditos!</p>
              <p style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>Recarregue a página para resetar o saldo.</p>
            </div>
          )}
        </div>

        {/* Right: Wheel */}
        <div className="wheel-section">
          <div className="wheel-container">
            {/* Pointer */}
            <div className="pointer"></div>

            {/* SVG Wheel */}
            <svg
              viewBox="0 0 400 400"
              style={{
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                border: '3px solid #00d4ff',
                boxShadow: '0 0 30px rgba(0, 212, 255, 0.4), inset 0 0 30px rgba(0, 212, 255, 0.1)',
                transform: `rotate(${rotation}deg)`,
                transition: isSpinning ? 'transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)' : 'none',
                background: '#0a0e27',
              }}
            >
              {buildSegments()}
              {/* Center circle */}
              <circle cx="200" cy="200" r="28" fill="#0a0e27" stroke="#00d4ff" strokeWidth="3" />
              <circle cx="200" cy="200" r="10" fill="#00d4ff" />
            </svg>
          </div>

          {result && (
            <div className={`win-display ${result.playerWon ? 'won' : 'lost'}`}>
              <div className="result-number" style={{ color: result.winningColor === 'red' ? '#ef4444' : result.winningColor === 'green' ? '#10b981' : '#f3f4f6' }}>
                {result.winningNumber}
              </div>
              <div className="result-color">{result.winningColor.toUpperCase()}</div>
            </div>
          )}

          {spinHistory.length > 0 && (
            <div className="history-section card">
              <h3>Recent Spins</h3>
              <div className="history-list">
                {spinHistory.map((spin, idx) => (
                  <div key={idx} className="history-item">
                    <span className={`number ${spin.color}`}>{spin.number}</span>
                    <span className="bet">${spin.bet.toFixed(2)}</span>
                    <span className={`result ${spin.won ? 'won' : 'lost'}`}>{spin.won ? '✓' : '✗'}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="info-section">
        <h3>💡 Game Information</h3>
        <div className="info-grid">
          <div className="info-card card">
            <h4>🔴 Red Bet</h4>
            <p><strong>Probability:</strong> 18/37 (48.65%)</p>
            <p><strong>Payout:</strong> 1:1 (Win = Bet Amount)</p>
            <p className="info-example">Example: Bet $100 → Win $100 → Total $200</p>
          </div>
          <div className="info-card card">
            <h4>⚫ Black Bet</h4>
            <p><strong>Probability:</strong> 18/37 (48.65%)</p>
            <p><strong>Payout:</strong> 1:1 (Win = Bet Amount)</p>
            <p className="info-example">Example: Bet $100 → Win $100 → Total $200</p>
          </div>
          <div className="info-card card">
            <h4>🟢 Green (0) Bet</h4>
            <p><strong>Probability:</strong> 1/37 (2.70%)</p>
            <p><strong>Payout:</strong> 35:1 (Win = 35 × Bet)</p>
            <p className="info-example">Example: Bet $100 → Win $3500 → Total $3600</p>
          </div>
        </div>
      </div>

      <div className="final-disclaimer card">
        <p>
          ⚠️ <strong>Lembre-se:</strong> Este é um demo fictício. Todos os saldos e transações são simulados.
          Nenhum dinheiro real está envolvido. Apenas para fins educacionais.
        </p>
      </div>
    </div>
  )
}

export default Roulette