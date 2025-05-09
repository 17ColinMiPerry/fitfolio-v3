# Fitfolio

A modern workout tracking application built with React and Express.js. Track your workouts, exercises, and sets with a clean, intuitive interface.

## Tech Stack

### Frontend
- **React** - UI library for building the user interface
- **Vite** - Next-generation frontend tooling for fast development
- **Tailwind CSS** - Utility-first CSS framework for styling
- **Clerk** - Authentication and user management
- **Phosphor Icons** - Icon library for the UI

### Backend
- **Express.js** - Web framework for Node.js
- **Prisma** - Next-generation ORM for database access
- **PostgreSQL** - Relational database (via Prisma Data Platform)
- **Vercel** - Deployment platform for both frontend and backend

## Features

- 🔐 Secure authentication with Clerk
- 💪 Create and manage workouts
- 🏋️‍♂️ Add exercises to workouts
- 📊 Track sets, reps, and weights
- 📱 Responsive design for all devices
- 🔄 Real-time updates
- 🎨 Modern, clean UI

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- PostgreSQL database (or use Prisma Data Platform)

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
DATABASE_URL=your_database_url
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

## Deployment

### Backend Deployment

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy the backend:
```bash
cd server
vercel
```

3. Set environment variables in Vercel dashboard:
- `DATABASE_URL`

### Frontend Deployment

1. Update the API URL in `frontend/src/utils/constants.js` to point to your deployed backend

2. Deploy the frontend:
```bash
cd frontend
vercel
```

3. Set environment variables in Vercel dashboard:
- `VITE_API_URL`
- `VITE_CLERK_PUBLISHABLE_KEY`

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

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.