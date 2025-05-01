import Header from "../../components/Header";
import CurrentWorkout from "./CurrentWorkout";
import WelcomeDashboard from "./WelcomeDashboard";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-300">
      <Button>Click me</Button>
      <Header />
      <div className="flex flex-row items-center justify-center bg-gray-300 gap-12">
        <div className="w-[625px] h-[725px] rounded-lg">
          <WelcomeDashboard />
        </div>
        <div className="w-[625px] h-[725px] rounded-lg">
          <CurrentWorkout />
        </div>
      </div>
    </div>
  );
}
