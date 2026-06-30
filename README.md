# FIFA Ticket Hub 2026

A comprehensive full-stack application for managing and purchasing FIFA World Cup 2026 tickets. This platform provides a seamless experience for fans to browse matches, view ticket packages, and get in touch with support.

## 🚀 Features

- **Match Management:** Browse FIFA 2026 matches with details on teams, stadiums, dates, and availability.
- **Ticket Packages:** Various ticket categories (Category 1-4) with detailed benefits and pricing.
- **Admin Dashboard:** Secure area for administrators to manage matches, ticket packages, and customer inquiries.
- **Interactive Map:** Visualize stadium locations and get directions.
- **AI Assistant:** Integrated AI chat box to help users with their queries.
- **Communication:** Integrated WhatsApp support and EmailJS for contact forms.
- **Authentication:** Custom secure authentication system for users and administrators.

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 19 with TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS 4, Framer Motion (animations)
- **UI Components:** Shadcn UI (Radix UI)
- **State Management:** TanStack Query (React Query)
- **Routing:** Wouter
- **Icons:** Lucide React

### Backend
- **Runtime:** Node.js
- **Framework:** Express
- **API:** tRPC (Type-safe RPC)
- **Database:** PostgreSQL with `pg` client
- **Authentication:** Session-based with JWT (Jose)

## 📁 Project Structure

```text
fifa-ticket-hub/
├── client/                 # Frontend React application
│   ├── public/             # Static assets
│   └── src/                # Frontend source code
│       ├── _core/          # Core hooks and utilities
│       ├── components/     # Reusable UI components
│       ├── contexts/       # React contexts (Theme, etc.)
│       ├── hooks/          # Custom React hooks
│       ├── lib/            # Library configurations (tRPC, EmailJS)
│       └── pages/          # Page components (Home, Matches, etc.)
├── server/                 # Backend Node.js application
│   ├── _core/              # Core server logic (SDK, tRPC, etc.)
│   ├── db.ts               # Database abstraction layer
│   ├── routers.ts          # tRPC router definitions
│   └── storage.ts          # Storage utilities
├── shared/                 # Code shared between frontend and backend
│   └── types.ts            # Shared TypeScript types
├── migrations/             # Database migration scripts
├── dist/                   # Production build output
└── [config files]          # package.json, tsconfig.json, etc.
```

## 📋 Prerequisites

- Node.js (Latest LTS recommended)
- PostgreSQL Databases
- npm or yarn

## ⚙️ Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd fifa-ticket-hub
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Variables:**
   Create a `.env` file in the root directory based on `.env.example`:
   ```bash
   cp .env.example .env
   ```
   Fill in your database credentials and API keys (EmailJS, WhatsApp, etc.).

4. **Database Setup:**
   Run the SQL scripts located in the root directory to set up your PostgreSQL schema:
   - `COMPLETE_POSTGRES_SETUP.sql`

5. **Run Development Server:**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5173`.

## 🏗️ Building for Production

```bash
npm run build
npm start
```

## 🧪 Testing

```bash
npm test
```
