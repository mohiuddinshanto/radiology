# Radiology Task & Annotation App - Frontend

A modern, highly interactive web application designed for medical task management and image annotation. Built with Next.js, TypeScript, Tailwind CSS, and Framer Motion.

## 🚀 Live Demo
- **Frontend App:** [https://radiology-tawny.vercel.app](https://radiology-tawny.vercel.app)
- **Backend API:** [https://radiology-backend-do2p.onrender.com](https://radiology-backend-do2p.onrender.com)

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
  - *Why:* Enables rapid, utility-first UI styling, maintaining a highly responsive, modern dark-themed aesthetic with minimal bundle overhead.
- **Motion (Framer Motion):**
  - *Where:* Dashboard transitions, Kanban drag-and-drop feedback, modal animations, and micro-interactions.
  - *Why:* Brings the application to life with smooth, high-performance UI/UX transitions, making the interface feel premium and responsive.
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
4. **Responsive Premium UI:** Gorgeous dark-mode dashboard tailored for radiologists.

---

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (v18.x or newer)
- npm or yarn

### Installation
1. Clone the repository and navigate to the frontend folder:
   ```bash
   cd "thard front end/radiology"
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

## 🛡️ Technical Challenges & Solutions
- **Hydration Mismatch:** Next.js can encounter differences between server-rendered and client-rendered markup. We resolved this using a `mounted` state inside a `useEffect` hook to defer client-only rendering (like local storage loading).
- **CORS Error:** Addressed cross-origin requests by integrating and configuring `django-cors-headers` in the Django backend.
- **State Synchronization:** The Zustand store handles state updates reactively. Changing a task status or updating polygons immediately pushes API requests while updating the local cache seamlessly.