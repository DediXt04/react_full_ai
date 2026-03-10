# 🎰 LuckySpinDEMO

> *"Sim, até esse README foi escrito por IA. Inclusive essa frase. E a atualização dele também. É IAs até o fundo."*

---

## O que é isso?

Um cassino falso feito em React onde você perde dinheiro **que não existe**.

Sabe aquela sensação de jogar fora seu patrimônio em um cassino de verdade? Aqui você tem a mesma experiência emocional, mas sem as consequências financeiras reais. É quase terapêutico. Quase.

---

## Jogos disponíveis

| Jogo | Descrição honesta |
|------|------------------|
| 🎡 Roleta | Você escolhe vermelho ou preto. A bola decide que não é nenhum dos dois. |
| 🎰 Slots | Nove emojis competem pela sua atenção. As chances de ganhar diminuíram — chamamos isso de "balanceamento". |
| 🃏 Blackjack | Você pede mais uma carta quando não devia. Sempre. Agora com double down que *realmente* funciona. |
| 📈 Crash | Um número sobe e você precisa clicar antes que caia. Basicamente seu portfólio de cripto em formato de jogo. |
| 💣 Mines | Clique em quadrados e torça pra não explodir. Metáfora perfeita pra abrir emails na segunda-feira. |

---

## Stack técnica

- **React 19** — porque fazer isso em vanilla JS seria sofrimento demais até pra uma IA
- **Vite** — build em 1.2s. Mais rápido que você perder seus créditos. Brincadeira. Quase.
- **CSS puro** — sem Tailwind, sem styled-components, sem autoestima
- **Math.random()** — o motor probabilístico de última geração que decide seu destino
- **localStorage** — seu saldo persiste entre sessões, assim como suas péssimas decisões
- **Claude (Anthropic)** — escreveu 100% do código, 100% do CSS, 100% desse README, e provavelmente está te julgando agora

---

## Como rodar

```bash
npm install
npm run dev
```

Abra o browser, perca seus $1000 de créditos fictícios em 4 minutos e clique no 🔄 fingindo que não aconteceu nada.

---

## Arquitetura do projeto

```
src/
├── pages/
│   ├── Home.jsx          # Marketing enganoso com partículas flutuantes
│   ├── Roulette.jsx      # Roda SVG que gira e te decepciona
│   ├── Slots.jsx         # 9 símbolos que raramente combinam (nerfado a pedido popular)
│   ├── Blackjack.jsx     # 21 ou bust (geralmente bust)
│   ├── Crash.jsx         # Gráfico subindo até seu ego cair
│   ├── Mines.jsx         # Campo minado com consequências emocionais
│   └── Achievements.jsx  # 31 conquistas pra te dar ilusão de progresso
├── components/
│   ├── Navbar.jsx        # Dropdown de jogos que finalmente funciona
│   ├── Footer.jsx        # Parte do site que ninguém scrolla até ver
│   ├── AchievementToast.jsx  # Pop-up que te parabeniza por perder
│   └── ParticleBackground.jsx # Bolinhas flutuantes pra disfarçar o vazio
├── context/
│   └── AchievementContext.jsx # 31 achievements e um useEffect centralizado
├── utils/
│   └── achievementHelpers.js  # Lógica de conquistas que estava duplicada em 5 arquivos
├── hooks/
│   └── useAnimatedNumber.js   # Faz o saldo animar enquanto evapora
└── App.jsx               # Cola que une a decepção
```

---

## Features

- ✅ **$1.000 de créditos demo** — recarregáveis infinitamente, assim como sua esperança
- ✅ **5 jogos** — porque 1 forma de perder não era suficiente
- ✅ **31 achievements** — bronze, prata e ouro pra te recompensar pelo sofrimento
- ✅ **Navbar com dropdown** — Home, Games ▾, Achievements. Limpa, elegante, funcional (na terceira tentativa)
- ✅ **Sem dinheiro real** — o único cassino honesto do mundo
- ✅ **Totalmente responsivo** — perde dinheiro imaginário no celular também
- ✅ **Design neon dark** — glassmorphism, partículas flutuantes, e uma quantidade suspeita de `box-shadow`
- ✅ **Auto-spin nos Slots** — para otimizar sua velocidade de perder
- ✅ **Persistência localStorage** — seu saldo e achievements sobrevivem a F5. Suas escolhas, nem tanto.
- ✅ **Slots nerfado** — tinha EV de +28% pro jogador. Agora tem 9 símbolos e house edge de 5.7%. Culpe o balanceamento.

---

## Sistema de Achievements

31 conquistas organizadas por raridade, porque gamificação sobre gamificação é exatamente o que o mundo precisava.

| Raridade | Exemplos | Descrição real |
|----------|----------|----------------|
| 🥉 Bronze | First Spin, First Pull | "Parabéns, você clicou num botão" |
| 🥈 Prata | On Fire (3 wins seguidas), Bold Move (double down win) | "Parabéns, o Math.random() te favoreceu" |
| 🥇 Ouro | Unstoppable (7 wins seguidas), Slot Lord (💎💎💎) | "Parabéns, você deveria ter parado enquanto estava ganhando" |

---

## Perguntas frequentes

**Isso é um projeto real?**
Depende da sua definição de "real". O código existe. Os créditos, não.

**Os Slots estavam muito fáceis?**
Estavam. EV de +28% pro jogador. Adicionamos 3 emojis novos (🍊🍇🍀) e agora a casa vence ~5.7% do tempo. Capitalismo simulado funcionando corretamente.

**O dropdown da navbar funciona?**
Agora sim. Depois de um `::before` pseudo-element invisível pra preencher 6 pixels de gap. Programação é isso: 3 horas pra resolver 6 pixels.

**O Blackjack tinha bugs?**
Tinha 2. O achievement "Bold Move" desbloqueava com qualquer win de 3 cartas (não só double down), e o cálculo de balance pros achievements usava closure stale. Mas você não ia notar. Provavelmente.

**Posso usar isso para aprender sobre jogos de azar?**
Sim, e a principal lição é: *a casa sempre vence*. Testamos. A IA confirmou. Matemática conferiu.

**Você realmente deixou uma IA escrever tudo?**
Sim. O dev abriu o Copilot, descreveu o projeto em português informal, e foi tomar café. Voltou com um cassino funcional de 5 jogos, 31 achievements, e um README sarcástico. Esse é o estado da engenharia de software em 2026.

**O código é bom?**
É código de IA. Funciona perfeitamente até o momento em que você tenta entender por quê. Mas pelo menos agora está *refatorado* — a lógica de achievements que estava copiada em 5 arquivos foi centralizada. Progresso.

---

## Aviso legal

Este projeto **não envolve dinheiro real**. Nenhuma transação ocorre. Nenhum backend existe. Nenhuma regulamentação foi violada. Nenhuma ficha foi apostada. Nenhuma lágrima foi derramada (pelo site — pelo desenvolvedor, não podemos confirmar).

Se você tem problemas com jogos de azar, procure ajuda profissional.
Se você tem problemas com usar IA para escrever todo o seu código, bem-vindo a 2026.

*Feito com React, Copilot, Claude, e uma quantidade preocupante de fé em Math.random().*
*66 modules. 295KB de JavaScript. Zero arrependimentos.*