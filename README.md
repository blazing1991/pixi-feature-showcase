Demo Link: https://blazing1991.github.io/pixi-feature-showcase/

# Pixi Feature Showcase

A small interactive showcase built with **TypeScript** and **PixiJS v7**, demonstrating three independent features:

- Card animation system
- Dynamic rich-text dialogue system
- Constrained particle-based fire effect

The application runs fully responsive in fullscreen and works on both desktop and mobile devices.

---

## 🎮 Features

### 1️⃣ Ace of Shadows

A card animation demo featuring:

- 144-card stack
- Bezier arc flight animation
- Double flip during flight
- GSAP timeline control
- Play / Skip / Rewind (10x speed) controls

The animation system is built using a GSAP.

---

### 2️⃣ Magic Words

A dialogue system that combines text and images (custom emoji-style rendering).

Features:

- Dynamic data fetched from API
- Inline `{tag}` parsing into images
- Lazy-loaded sprite replacement
- Scrollable container (drag + wheel support)
- NineSlice bubble UI
- Graceful fallback for missing assets

Images are loaded asynchronously and replaced automatically once available.

---

### 3️⃣ Phoenix Flame

A stylized fire particle system built with `@pixi/particle-emitter`.

Constraints:
- Maximum 10 active particles at any time

Implementation focuses on:
- Motion curves
- Alpha and scale interpolation
- Additive blending
- Natural upward acceleration

The result is a smooth flame effect.

---

## 📱 Responsiveness

The app:

- Scales to full viewport
- Supports portrait and landscape layouts
- Uses logical resolution scaling
- Works with mouse and touch input
- Prevents page zoom on mobile

---

## 🚀 Running Locally

```bash
npm install
npm run dev

