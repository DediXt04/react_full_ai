# 🎰 LuckySpinDEMO

> _"Sim, até esse README foi escrito por IA. Inclusive essa frase. E a atualização dele também. E a atualização da atualização. É IAs o caminho inteiro pra baixo."_

---

## O que é isso?

Um cassino falso feito em React onde você perde dinheiro **que não existe**.

Sabe aquela sensação de jogar fora seu patrimônio em um cassino de verdade? Aqui você tem a mesma experiência emocional, mas sem as consequências financeiras reais. É quase terapêutico. Quase.

---

## Jogos disponíveis

| Jogo         | Descrição honesta                                                                                                                                                                                 |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 🎡 Roleta    | Você escolhe vermelho ou preto. A bola decide que não é nenhum dos dois. Agora com auto-spin pra automatizar a decepção.                                                                          |
| 🎰 Slots     | Nove emojis competem pela sua atenção. As chances de ganhar diminuíram — chamamos isso de "balanceamento". Auto-spin incluso pra quem quer perder no piloto automático.                           |
| 🃏 Blackjack | Você pede mais uma carta quando não devia. Sempre. O dealer agora _realmente_ pede cartas, porque antes ele esquecia.                                                                             |
| 📈 Crash     | Um número sobe e você precisa clicar antes que caia. Basicamente seu portfólio de cripto em formato de jogo. O gráfico agora continua subindo depois do cashout pra maximizar seu arrependimento. |
| 💣 Mines     | Clique em quadrados e torça pra não explodir. Tiles brilhantes que parecem esmeraldas — pra você se sentir rico 0.3 segundos antes de pisar numa mina.                                            |
| 📍 Plinko    | Solte uma bolinha e reze. Ela quica por pinos, desvia pra onde quer, e cai num multiplicador que provavelmente é 0.2×. Física simulada pra te dar a ilusão de controle.                           |

---

## Stack técnica

- **React 19** — porque fazer isso em vanilla JS seria sofrimento demais até pra uma IA
- **Vite** — build em 1.3s. Mais rápido que você perder seus créditos
- **CSS puro** — sem Tailwind, sem styled-components, sem autoestima. Rajdhani + Orbitron pra parecer premium
- **Canvas API** — gráficos do Crash e física do Plinko. requestAnimationFrame é o novo jQuery
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
│   ├── Plinko.jsx        # Galton board com bolinha dourada e multiplicadores que te dão esperança falsa
│   ├── Achievements.jsx  # 46 conquistas pra te dar ilusão de progresso
│   └── NotFound.jsx      # 404 com tema de cassino, porque até se perder aqui é on-brand
├── components/
│   ├── Navbar.jsx        # Dropdown de jogos que finalmente funciona (6 jogos e contando)
│   ├── Footer.jsx        # Parte do site que ninguém scrolla até ver
│   ├── AchievementToast.jsx  # Pop-up que te parabeniza por perder
│   └── ParticleBackground.jsx # Bolinhas flutuantes pra disfarçar o vazio
├── context/
│   └── AchievementContext.jsx # 46 achievements, 4 raridades, e um useEffect que virou Frankenstein
├── utils/
│   └── achievementHelpers.js  # Lógica de conquistas centralizada (estava duplicada em 5 arquivos, agora em 6)
├── hooks/
│   └── useAnimatedNumber.js   # Faz o saldo animar enquanto evapora
└── App.jsx               # Cola que une a decepção
```

---

## Features

- ✅ **$1.000 de créditos demo** — recarregáveis infinitamente em qualquer jogo, assim como sua esperança
- ✅ **6 jogos** — porque 5 formas de perder não era suficiente
- ✅ **46 achievements** — bronze, prata, ouro e **lendário** pra te recompensar pelo sofrimento em escala progressiva
- ✅ **Auto-spin/auto-drop** — Roleta, Slots e Plinko. Pra quando você quer perder mas está ocupado
- ✅ **Navbar com dropdown** — 6 jogos organizados. Limpa, elegante, funcional (na terceira tentativa)
- ✅ **Sem dinheiro real** — o único cassino honesto do mundo
- ✅ **Totalmente responsivo** — perde dinheiro imaginário no celular, tablet, e geladeira smart
- ✅ **Design neon dark** — glassmorphism, partículas flutuantes, Orbitron font, e uma quantidade suspeita de `box-shadow`
- ✅ **Página 404** — se você errar a URL, pelo menos vai errar com estilo
- ✅ **Persistência localStorage** — seu saldo, achievements e stats sobrevivem a F5. Suas escolhas, nem tanto.
- ✅ **Odds ≈ 50/50** — Crash, Mines e Slots foram balanceados. A casa ganha por pouco. Capitalismo simulado com precisão.

---

## Sistema de Achievements

46 conquistas organizadas por raridade, porque gamificação sobre gamificação é exatamente o que o mundo precisava.

| Raridade    | Qtd | Exemplos                                                                      | Descrição real                                               |
| ----------- | --- | ----------------------------------------------------------------------------- | ------------------------------------------------------------ |
| 🥉 Bronze   | 11  | First Spin, Ball Dropper, Chicken                                             | "Parabéns, você clicou num botão"                            |
| 🥈 Prata    | 14  | On Fire (3 wins), Instant Regret (mina no 1º click), Unlucky (5 losses)       | "Parabéns, o Math.random() te favoreceu. Ou não."            |
| 🥇 Ouro     | 17  | Unstoppable (7 wins), Jackpot Lane (100× no Plinko), Astronaut (50× no Crash) | "Parabéns, você deveria ter parado enquanto estava ganhando" |
| 💜 Lendário | 4   | No Life (500 bets), Wolf of Wall Street ($25k)                                | "Parabéns, você precisa sair de casa"                        |

---

## O Plinko

O jogo mais recente. Uma bolinha dourada cai por uma grade de pinos, quicando aleatoriamente pra esquerda ou direita em cada nível (Galton board). No fundo, multiplicadores coloridos esperam — dos generosos 1000× nas bordas aos deprimentes 0.2× no centro.

**Configurações:**

- **Linhas:** 8, 12 ou 16 — mais linhas = mais caos = mais arrependimento
- **Risco:** Low, Medium, High — pra quem quer controlar a _intensidade_ da decepção
- **EV ≈ $1.00** — matematicamente justo. Emocionalmente devastador.

Canvas com requestAnimationFrame, ease-in pra gravidade, ease-out pra deflexão. Porque a física de uma bolinha de cassino falso merece mais engenharia que muita startup.

---

## Perguntas frequentes

**Isso é um projeto real?**
Depende da sua definição de "real". O código existe. Os créditos, não.

**Os Slots estavam muito fáceis?**
Estavam. EV de +28% pro jogador. Adicionamos 3 emojis novos (🍊🍇🍀) e agora a casa vence ~5.7% do tempo. Capitalismo simulado funcionando corretamente.

**O dropdown da navbar funciona?**
Agora sim. Depois de um `::before` pseudo-element invisível pra preencher 6 pixels de gap. Programação é isso: 3 horas pra resolver 6 pixels.

**Por que o Crash tinha um bug de 0.01×?**
Stale closure. O `cashOut` lia `multiplier` do state do React, mas o `setMultiplier` no requestAnimationFrame ainda não tinha re-renderizado. Solução: `multiplierRef` atualizado sincronamente no tick. Você provavelmente não entendeu nada disso, e tudo bem.

**O Plinko é justo?**
Cada pino tem 50% de chance de ir pra esquerda ou direita. Distribuição binomial. EV ≈ $1.00 pra toda configuração. A casa ganha ~1-2%. Então sim, é justo. Você que não tem sorte.

**Posso usar isso para aprender sobre jogos de azar?**
Sim, e a principal lição é: _a casa sempre vence_. Testamos. A IA confirmou. Matemática conferiu.

**Você realmente deixou uma IA escrever tudo?**
Sim. O dev abriu o Copilot, descreveu o projeto em português informal, e foi tomar café. Voltou com um cassino funcional de 6 jogos, 46 achievements, física de Plinko, e um README que sabe mais sobre o projeto que o próprio dev. Esse é o estado da engenharia de software em 2026.

**O código é bom?**
É código de IA. Funciona perfeitamente até o momento em que você tenta entender por quê. Mas pelo menos agora está _refatorado_ — achievements centralizados, refs sincronizados, design padronizado. Uma bagunça _organizada_.

---

## Aviso legal

Este projeto **não envolve dinheiro real**. Nenhuma transação ocorre. Nenhum backend existe. Nenhuma regulamentação foi violada. Nenhuma ficha foi apostada. Nenhuma bolinha de Plinko foi ferida durante a produção.

Se você tem problemas com jogos de azar, procure ajuda profissional.
Se você tem problemas com usar IA para escrever todo o seu código, bem-vindo a 2026.

_Feito com React, Copilot, Claude, e uma quantidade preocupante de fé em Math.random()._
_70 modules. 311KB de JavaScript. 46 achievements. 6 jogos. Zero arrependimentos._
