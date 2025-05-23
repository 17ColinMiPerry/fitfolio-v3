import Header from "../../components/Header";
import CurrentWorkout from "./CurrentWorkout";
import WelcomeDashboard from "./WelcomeDashboard";
import StatTracker from "./StatTracker";
import { SignedIn, SignedOut, SignInButton } from "@clerk/clerk-react";
import Workouts from "../../models/workout";
import { useAuth } from "@clerk/clerk-react";
import { useState, useEffect } from "react";

export default function Home() {
  const { userId } = useAuth();
  const [workouts, setWorkouts] = useState([]);
  
  useEffect(() => {
    const getWorkouts = async () => {
      const workouts = await Workouts.all(userId);
      setWorkouts(workouts);
    };
    getWorkouts();
  }, [userId]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-300">
      <SignedIn>
        <Header />
        <div className="flex flex-wrap justify-center gap-10 p-4 bg-gray-300">
          <div className="w-[600px] h-[725px] rounded-lg">
            <WelcomeDashboard workouts={workouts} />
          </div>
          <div className="w-[600px] h-[725px] rounded-lg">
            <CurrentWorkout workouts={workouts} setWorkouts={setWorkouts} />
          </div>
          <div className="w-[600px] h-[725px] rounded-lg">
            <StatTracker workouts={workouts} />
          </div>
        </div>
      </SignedIn>
      <SignedOut>
        <div className="flex flex-col items-center justify-center h-screen bg-gray-300 gap-8">
          <h1 className="text-2xl font-bold">Please sign in to continue</h1>
          <SignInButton mode="modal">
            <button className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded transition-colors">
              Sign In
            </button>
          </SignInButton>
        </div>
      </SignedOut>
    </div>
  );
}
