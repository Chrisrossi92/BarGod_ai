# BarGod.ai

**BarGod.ai** is a mobile-first, AI-powered battle rap simulator and culture platform. Designed as a competitive, stat-based battle game — it blends real MC transcripts, 2K-style player builds, and turn-based battle logic into a strategy game rooted in real culture.

This isn’t a chatbot that spits bars — it’s a skill lab, a cultural archive, and a game where battlers rise through performance.

---

## 📱 Mobile-First Vision

BarGod is built primarily for mobile. The app is where users upload battles, simulate matchups, upgrade their battlers, and train their pen game. The web version (if used) supports onboarding, admin tools, and light previewing — but **the experience is designed for your phone**.

---

## 🎮 Core Gameplay

- **Turn-Based Battle System**  
  Build bar combos from punchlines, schemes, angles, rebuttals, and finishers.
- **Style Matchups Matter**  
  Some moves hit harder depending on matchup, momentum, and crowd control.
- **Stat-Driven Performance**  
  Every battler has a profile: rhyming, aura, rebuttals, aggression, and more.
- **Battle Modes**  
  Rise through the ranks in MyCareer, battle legends in Versus, or watch simulations in Spectator mode.

---

## 🧠 Platform Goals

- **Analyze real battles** to create authentic profiles for known battlers
- **Support community uploads** for lesser-known MCs looking to earn recognition
- **Simulate battles** that are skill-based and strategic — not just text generators
- **Give battlers a tool** to sharpen their pens, test styles, and understand their game better

---

## 🛠 Current Progress

- [x] StatCard Generator (from transcripts)
- [x] Transcript Upload UI (with mock Genius parsing)
- [x] Supabase integration for persistent battlers
- [x] Local simulation-ready stat parser (2K-style)

---

## 🛣 Roadmap → MVP (Mobile App)

- [ ] Build `TurnEngine.js` for bar combo logic and stat interactions
- [ ] Implement `MoveCatalog.json` to define bar types and effects
- [ ] Design dual-battler matchup screen with win prediction
- [ ] Real transcript fetching from Genius and YouTube
- [ ] MyCareer mode with stat cap, build trees, and XP system
- [ ] Upload flow from mobile — paste links or record audio for analysis
- [ ] Backend structure for ELO rankings, XP, and battle logs
- [ ] KOTD/U.R.L./RBE legacy partnership (stretch goal)

---

## 🔧 Setup Instructions (For Devs)

1. Clone the repo:
   ```bash
   git clone https://github.com/Chrisrossi92/BarGod_ai.git
   cd BarGod_ai

