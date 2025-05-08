import { useUser } from "@clerk/clerk-react";
import { useState, useEffect } from "react";

function StatTracker({ workouts }) {
  const { user } = useUser();
  const [daysSinceCreation, setDaysSinceCreation] = useState(0);
  const [totalWorkouts, setTotalWorkouts] = useState(0);

  useEffect(() => {
    const getDaysSinceCreation = () => {
      if (!user) return;
      
      const createdAt = new Date(user.createdAt);
      const today = new Date();
      
      // Calculate the difference in days
      const diffTime = today.getTime() - createdAt.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      
      setDaysSinceCreation(diffDays);
    };

    const calculateStats = () => {
      if (!workouts) return;
      
      // Calculate total workouts
      setTotalWorkouts(workouts.length);
    };

    getDaysSinceCreation();
    calculateStats();
  }, [user, workouts]);

  return (
    <div className="flex flex-col h-full w-full gap-4 p-8 bg-gray-100 rounded-lg">
      <h1 className="text-3xl font-semibold mb-4">Your Stats</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Days Since Creation */}
        <div className="bg-white p-6 rounded-lg shadow-sm flex-1">
          <h2 className="text-xl font-semibold mb-2">Account Age</h2>
          <div className="flex items-baseline gap-2">
            <p className="text-4xl font-bold text-blue-600">{daysSinceCreation}</p>
            <p className="text-xl text-gray-600">days</p>
          </div>
          <p className="text-gray-600 text-sm mt-1">Keep up the great work! 🎉</p>
        </div>

        {/* Total Workouts */}
        <div className="bg-white p-6 rounded-lg shadow-sm flex-1">
          <h2 className="text-xl font-semibold mb-2">Total Workouts</h2>
          <div className="flex items-baseline gap-2">
            <p className="text-4xl font-bold text-green-600">{totalWorkouts}</p>
            <p className="text-xl text-gray-600">workouts</p>
          </div>
          <p className="text-gray-600 text-sm mt-1">Every workout counts! 💪</p>
        </div>

        {/* More Stats Coming Soon */}
        <div className="bg-white p-6 rounded-lg shadow-sm flex-1 flex flex-col items-center justify-center">
          <h2 className="text-xl font-semibold mb-2">More Stats</h2>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-bold text-gray-400">Coming soon!</p>
          </div>
          <p className="text-gray-600 text-sm mt-1">Stay tuned for more features 🚀</p>
        </div>
      </div>
    </div>
  );
}

export default StatTracker;