<div align="center">

# 📚 Mini LMS Pro

### Production-Grade Mobile Learning Platform

#### Built with React Native • Expo • TypeScript (Strict Mode)

<br/>

<p>
  <strong>Scalable Architecture • Secure Auth  • Performance Optimized</strong>
</p>

<br/>

![Expo](https://img.shields.io/badge/Expo-SDK%2054-black?logo=expo)
![React Native](https://img.shields.io/badge/React%20Native-0.81.5-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-Strict%20Mode-3178C6?logo=typescript)
![Architecture](https://img.shields.io/badge/Architecture-Clean%20Modular-blue)
![Engineering](https://img.shields.io/badge/Engineering-Production%20Ready-purple)
![Status](https://img.shields.io/badge/Status-Active%20Development-success)

</div>

---

# 🧠 Executive Summary

**Mini LMS Pro** is a high-performance mobile learning management system built with modern engineering standards. It demonstrates a scalable, modular approach to mobile application development, focusing on performance, security, and a premium user experience.

This repository serves as a blueprint for production-grade React Native applications, featuring:

- **Modular Clean Architecture**: Feature-based organization for maximum scalability.
- **Dynamic Course Domain**: High-performance catalog with infinite scroll and advanced search.
- **Offline Resilience**: Intelligent caching and connectivity-aware UI components.
- **Modern UI/UX**: Dark mode support, smooth animations, and premium aesthetics using NativeWind (Tailwind CSS).

---

# 🏗 System Architecture

## Architectural Principles

- **Feature-Based Modularity**: Logic is grouped by domain (Auth, Course, Profile, Home).
- **Service Layer Pattern**: Dedicated API clients, mutation hooks, and query managers.
- **Context-Driven State**: Efficient global state management for Auth, Theme, and Notifications.
- **Atomic UI Components**: Reusable, themed primitives for consistent design.
- **Type-Safe Contract**: Strict TypeScript interfaces across all layers.

---

## 📂 Project Structure

```bash
app/                → File-based routing (Expo Router)
  (auth)/           → Authentication flows (Login, Register)
  (protected)/      → Secure application area
src/
  modules/          → Domain-driven feature modules
    auth/           → Authentication logic & screens
    course/         → Course catalog, details & viewer
    profile/        → User profile, settings & avatar management
    home/           → Dashboard & discovery
  service/          → API integration (TanStack Query + Axios)
  context/          → Global providers (Auth, Theme, Network)
  shared/           → Reusable UI components & wrappers
  utils/            → Helpers (Image picker, Formatters)
```

---

# 🔐 Authentication & Roles

Enterprise-grade authentication system supporting multiple user personas:

- **Security Patterns**:
    - Secure token persistence via `expo-secure-store`.
    - Automatic session restoration on app launch.
    - Protected route middleware using Expo Router.
    - Centralized Auth Context for global session awareness.

---

# 📚 Course Domain Module

A sophisticated course management system designed for speed and usability.

### Key Features

- **High-Performance Catalog**: Optimized list rendering with `FlashList` concepts and memoization.
- **Infinite Loading**: Seamless pagination using `@tanstack/react-query`.
- **Advanced Search**: Debounced real-time search with visual feedback.
- **Interactive Viewer**: Bidirectional Native ↔ Web communication for course content.
- **Bookmark System**: Persistent local/remote sync for favorite courses.

---

# 👤 Profile & Personalization

Premium user experience with deep customization options:

- **Avatar Management**: In-app image picking and remote upload with server-side sync.
- **Dynamic Theming**: full Dark/Light mode support via NativeWind.
- **Role Badge**: Visual identification of user permissions.

---

# 🔔 Intelligent Notifications

Event-driven engagement model powered by `expo-notifications`:

- **Milestone Achievements**: Automated triggers for user milestones (e.g., "5th Bookmark Unlocked").
- **Engagement Reminders**: Intelligent 24-hour inactivity reminders to boost retention.
- **Permission Management**: Graceful notification permission handling and gating.

---




# ⚡ Technology Stack

| Category | Technology |
| :--- | :--- |
| **Framework** | React Native + Expo (SDK 54) |
| **Language** | TypeScript (Strict) |
| **Navigation** | Expo Router (File-based) |
| **State/Data** | TanStack Query v5 + Axios |
| **Styling** | NativeWind (Tailwind CSS) + CSS Variables |
| **Storage** | Secure Store + Async Storage |
| **Media** | Expo Image + Image Picker |
| **Tools** | EAS (Expo Application Services) |

---

# 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- npm / yarn
- Expo Go (for development)

### Setup

1. **Clone & Install**:
   ```bash
   npm install
   ```


3. **Run Application**:
   ```bash
   npm start
   ```

---

# 📦 Deployment Profiles

Ready-to-use EAS configurations for multiple environments:

```bash
# Development Build
npm run build:dev

# Preview Build (Staging)
npm run build:prev

# Production Release
npm run build:prod
```

---

<div align="center">

⭐ Built with engineering discipline and a production mindset.

</div>
