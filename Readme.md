# Globetrotter Challenge – The Ultimate Travel Guessing Game!

Globetrotter is a full-stack web app where users get cryptic clues about famous places and must guess the correct destination. The game features AI-generated datasets, scoring, and a challenge mode to invite friends!

## Features

- 🧠 AI-powered destination clues and fun facts
- 🎯 Score tracking for correct and incorrect answers
- 🎉 Fun animations for correct/incorrect guesses
- 🔗 "Challenge a Friend" with a shareable invite link
- 🛠️ Scalable and modular backend architecture

---

## Tech Stack

### Frontend:

- Next.js
- Tailwind CSS
- Context API for state management

### Backend:

- Node.js with Express
- MongoDB with Mongoose
- TypeScript for type safety

---

## Folder Structure

### Frontend

```
frontend
├── src
│   ├── app
│   │   ├── challenge/[username]/page.tsx
│   │   ├── game/page.tsx
│   │   ├── home/page.tsx
│   │   ├── profile/page.tsx
│   │   ├── lib/api.ts
│   │   ├── lib/utils.ts
│   │   └── contexts
│   │       ├── GameContext.tsx
│   │       └── UserContext.tsx
│   ├── components
│   │   ├── ShareDialog.tsx
│   │   └── ui/
│   └── globals.css
├── tailwind.config.js
└── tsconfig.json
```

### Backend

```
backend
├── src
│   ├── controllers
│   │   ├── gameController.ts
│   │   ├── userController.ts
│   ├── models
│   │   ├── Destination.ts
│   │   ├── User.ts
│   ├── routes
│   │   ├── gameRoutes.ts
│   │   ├── userRoutes.ts
│   ├── scripts
│   │   ├── seedDatabase.ts
│   ├── utils
│   │   ├── dataExpansion.ts
│   ├── index.ts
└── tsconfig.json
```

---

## API Endpoints

### User Routes

- `POST /api/users/login` – Logs in or registers a user
- `GET /api/users/:username` – Fetch user profile by username
- `PATCH /api/users/:id/score` – Update user score

### Game Routes

- `POST /api/game/new` – Starts a new game session
- `POST /api/game/seed` – Seed the database with destinations

---

## Setup Instructions

### Backend Setup

1. Install dependencies:
   ```sh
   cd backend
   npm install
   ```
2. Set up environment variables in `.env` file:
   ```sh
   MONGO_URI=<your_mongodb_uri>
   ```
3. Start the server:
   ```sh
   npm run dev
   ```

### Frontend Setup

1. Install dependencies:
   ```sh
   cd frontend
   npm install
   ```
2. Set up environment variables in `.env` file:
   ```sh
   NEXT_PUBLIC_API_URL=<your_backend_uri>
   ```
3. Start the development server:
   ```sh
   npm run dev
   ```

---

## Future Enhancements

- ✅ Leaderboard to track top players
- ✅ Timed challenges with countdown
- ✅ More destinations with AI-generated clues

Happy Guessing! 🌍✈️
