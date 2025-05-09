# Fitfolio

A workout tracking app that started as a fun project between friends. Think of it as a digital exercise journal where we can track our fitness journeys together, share progress, and keep each other motivated.

## About

Fitfolio began as a simple idea: what if we had a cool way to track our workouts together? No more scattered notes or forgotten exercises. Just a clean, simple app where we can log our workouts, see our progress, and maybe even challenge each other to try new exercises. It's like having a workout buddy in your pocket, minus the awkward high-fives.

## Tech Stack

### Frontend
- **React** - For building a snappy, interactive UI
- **Vite** - Makes development super fast and smooth
- **Tailwind CSS** - For styling without the headache
- **Clerk** - Handles all the login stuff so we don't have to
- **Phosphor Icons** - Some nice-looking icons to make things pretty

### Backend
- **Express.js** - A simple but powerful server framework
- **Prisma** - Makes talking to the database way easier
- **SQLite** - A lightweight database that's perfect for our needs
- **Node.js** - The engine that makes everything run

## Features

- 🔐 Easy sign-in with Clerk
- 💪 Create and manage your workout routines
- 🏋️‍♂️ Add exercises to your workouts
- 📊 Track your sets, reps, and weights
- 📱 Works great on phones and computers
- 🔄 See your progress over time
- 🎨 Clean, modern look that's easy on the eyes

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/fitfolio-v3.git
cd fitfolio-v3
```

2. Install dependencies for both frontend and backend:
```bash
# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../server
npm install
```

3. Set up environment variables:

Frontend (.env):
```env
VITE_API_URL=http://localhost:5000/api
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_key
```

Backend (.env):
```env
DATABASE_URL="file:./dev.db"
```

4. Start the development servers:

```bash
# Start backend server (from server directory)
npm run dev

# Start frontend server (from frontend directory)
npm run dev
```

The application should now be running at:
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

## Project Structure

```
fitfolio-v3/
├── frontend/           # React frontend application
│   ├── src/
│   │   ├── components/ # Reusable UI components
│   │   ├── models/     # API interaction models
│   │   ├── pages/      # Page components
│   │   └── utils/      # Utility functions
│   └── public/         # Static assets
│
└── server/            # Express.js backend
    ├── endpoints/     # API route handlers
    ├── models/        # Database models
    └── prisma/        # Prisma schema and migrations
```

## Contributing

Feel free to fork this project and make it your own! Whether you're adding new features, fixing bugs, or just playing around with the code, all contributions are welcome.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.