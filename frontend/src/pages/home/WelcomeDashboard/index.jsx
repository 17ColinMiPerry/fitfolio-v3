import WidgetHeader from "./WidgetHeader";
import { useState, useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";

export default function WelcomeDashboard({ workouts }) {
  const { userId } = useAuth();
  const [streak, setStreak] = useState(0);
  
  useEffect(() => {
    const getStreak = async () => {
      if (!userId) return;
      try {
        // Get unique workout dates
        const dates = [...new Set(
          workouts.map(w => new Date(w.createdAt).toISOString().split('T')[0])
        )].sort();
        
        if (dates.length === 0) {
          setStreak(0);
          return;
        }

        let currentStreak = 0;
        const today = new Date().toISOString().split('T')[0];
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
        
        // Check if worked out today or yesterday to start counting
        if (dates.includes(today)) {
          currentStreak = 1;
          dates.splice(dates.indexOf(today), 1);
        }
        
        // Start checking from yesterday
        let checkDate = yesterday;
        
        // Sort dates in reverse order to check most recent first
        const sortedDates = [...dates].reverse();
        
        for (const date of sortedDates) {
          if (date === checkDate) {
            currentStreak++;
            // Move to previous day
            checkDate = new Date(new Date(checkDate).getTime() - 86400000)
              .toISOString().split('T')[0];
          } else if (date < checkDate) {
            break;
          }
        }
        
        setStreak(currentStreak);
      } catch (error) {
        console.error("Error fetching streak:", error);
      }
    };

    getStreak();
  }, [userId, workouts]);

  return (
    <div className="flex flex-col h-full w-full gap-4 p-8 bg-gray-100 rounded-lg">
      <WidgetHeader />
      <div className="flex flex-col gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-2">Current Streak</h2>
          <div className="flex items-baseline gap-2">
            <p className="text-4xl font-bold text-blue-600">{streak}</p>
            {streak === 1 ? (
              <p className="text-xl text-gray-600">day</p>
            ) : (
              <p className="text-xl text-gray-600">days</p>
            )}
          </div>
          <p className="text-gray-600 text-sm mt-1">Keep it going! 💪</p>
        </div>
        <p>
          Welcome to Fitfolio! You can use this app to track your workouts and
          progress. To get started, head to the Workouts widget and select a
          workout. If you do not have any workouts, you will be able to make a new
          one.
        </p>
        <p>
          More functionality such as diet and progress tracking will be added in
          the future.
        </p>
      </div>
    </div>
  );
}
