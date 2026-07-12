# Radiology Task & Annotation App - Frontend

A modern, highly interactive web application designed for medical task management and image annotation. Built with Next.js, TypeScript, Tailwind CSS, and Framer Motion.

## 🚀 Live Demo

Frontend App: https://radiology-tawny.vercel.app

Backend API: https://radiology-backend-do2p.onrender.com

## 📂 Repository

Frontend Repository:
https://github.com/mohiuddinshanto/radiology

Backend Repository:
https://github.com/mohiuddinshanto/radiology_backend

## 🎥 Demo Video

https://drive.google.com/file/d/1Qs03IAEXAUDsWBLtu_I2n995-sOK-Psq/view?usp=sharing

---
---

## 🛡️ Challenges Faced & Solutions

### 1. Silent "Failed to Fetch" Errors With No Real Cause Shown
**Challenge:** The tasks and annotation pages started throwing generic "Failed to fetch" errors in the console after wiring them up to the backend API. The error message itself gave no clue what was actually wrong.
**Solution:** Checking the Network tab (instead of trusting the caught error) revealed every request was returning 401. The frontend simply wasn't attaching any `Authorization` header at all. Fixed it by building a centralized `apiFetch()` wrapper in `lib/api.ts` that automatically attaches the JWT access token to every request and transparently retries once with a refreshed token if it gets a 401 — instead of repeating auth-header logic across every store and component.

### 2. A Route Guard That Locked Users Out of the Login Page Itself
**Challenge:** After adding an auth guard to redirect unauthenticated users to `/login`, the login page started rendering as a completely blank white screen.
**Solution:** The guard had been placed in the root `layout.tsx`, which wraps every route — including `/login`. An unauthenticated visitor hitting `/login` would get redirected to `/login`, which redirects to `/login`, endlessly, rendering nothing in between. Moved the guard into a route-group-specific layout (`(app)/layout.tsx`) so it only protects the actual app pages, and left the `(auth)` route group (login/register) outside of it entirely.

### 3. Runtime Crash After Switching From Mock Auth to Real Login
**Challenge:** Once real JWT login was wired up (replacing an earlier placeholder auth provider that had a hardcoded display name), the dashboard started crashing on load with `Cannot read properties of undefined (reading 'split')`.
**Solution:** The Sidebar and Navbar components were calling `.split(" ")` on `user.name` to build avatar initials, but the real authenticated user object only had an email — `name` was never actually being set anywhere. Fixed it by deriving a display name from the user's email/username at login time, and made the `Avatar` component itself defensive against a missing name, so a similar gap elsewhere can't crash the whole page again.

### 4. Keeping Date Logic Decoupled From the Task UI
**Challenge:** The Kanban board needed a shared date filter that both the task list and the date picker could read/write, without tightly coupling the date-selection logic into the task components themselves (an explicit requirement of the assignment).
**Solution:** Used a Zustand store (`useTaskStore`) to hold `selectedDate` as shared state, with `<DateSelector />` staying a fully presentational component that only receives props and calls a callback — it has no idea tasks even exist. The board components subscribe to the store independently, so date logic and task logic never directly reference each other's internals.

---




## 🛠️ Tech Stack & Architecture (Why & Where)

### Core Frameworks & Language
- **Next.js 16 (App Router) & React 19:**
  - *Where:* Core framework of the entire frontend application.
  - *Why:* Provides fast, component-based rendering, client-side routing, and support for the React Compiler for highly optimized rendering.
- **TypeScript:**
  - *Where:* Used across the codebase (`src/**/*.ts`, `src/**/*.tsx`).
  - *Why:* Ensures strict type-safety, which is crucial for handling complex polygon structures (arrays of coordinate objects), API payloads, state interfaces, and tasks.

### State Management
- **Zustand:**
  - *Where:* Global client-side state (`src/store/`).
  - *Why:* Serves as a lightweight, clean, and highly performant alternative to Redux. Used to handle authentication states, drag-and-drop Kanban task sync, and active annotation canvas data across components.
  
### UI & Styling
- **Tailwind CSS v4 (@tailwindcss/postcss):**
  - *Where:* Styling utility classes across all components.
  - *Why:* Enables rapid, utility-first UI styling, maintaining a highly modern dark-themed aesthetic with minimal bundle overhead.
- **Motion (Framer Motion):**
  - *Where:* Dashboard transitions, Kanban drag-and-drop feedback, modal animations, and micro-interactions.
  - *Why:* Brings the application to life with smooth, high-performance UI/UX transitions, making the interface feel premium.
- **Lucide React:**
  - *Where:* App-wide SVG icons.
  - *Why:* Offers a cohesive, clean icon library for tasks, drawing tools (polygon, brush, erase), navigation, and priority badges.

### Utilities
- **Date-fns:**
  - *Where:* Kanban task cards and scheduler.
  - *Why:* Used to handle, parse, and format due dates in a clean, human-readable format.
- **React Hot Toast:**
  - *Where:* System alerts and responses (e.g., successful login, saved annotations, validation errors).
  - *Why:* Renders beautiful, non-blocking toast notifications for system-user interactions.

---

## ✨ Features
1. **Secure JWT Authentication:** User registration, login, and token refresh system.
2. **Interactive Kanban Board:**
   - Real-time task cards displaying title, description, assignee, priority tags, and due date.
   - Smooth drag-and-drop to update statuses (`To Do` ➔ `In Progress` ➔ `Done`).
3. **Advanced Annotation Studio:**
   - Dynamic canvas loading medical/radiology images.
   - Vector polygon tool allowing users to click, draw, edit labels, custom colors, and save regions.
   - Deleting and editing existing polygons in real-time.
4. **Modern UI:**
  - Clean dark-themed dashboard designed for efficient task management and medical image annotation.

---

## 🛠️ Setup Instructions

## Prerequisites

### Frontend
- Node.js: v24.15.0
- npm: 11.15.0

### Installation
1. Clone the repository and navigate to the frontend folder:
   ```bash
   git clone https://github.com/mohiuddinshanto/radiology.git
   ```
2. Install the dependencies:
   ```bash
   npm install
   ```
3. Set up the Environment Variables:
   Create a `.env.local` file in the root folder and add the Backend API URL:
   ```env
   NEXT_PUBLIC_API_URL=https://radiology-backend-do2p.onrender.com
   ```
4. Start the Development Server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

---

## 🔒 Demo Credentials
Test the app using the following pre-configured credentials:
- **Email:** `demo@404project.io`
- **Password:** `demo1234`

---

