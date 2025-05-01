import WidgetHeader from "./WidgetHeader";
import BodyText from "./BodyText";

export default function WelcomeDashboard() {
  return (
    <div className="flex flex-col h-full w-full gap-4 p-8 bg-gray-100 rounded-lg">
      <WidgetHeader />
      <BodyText />
      
    </div>
  );
}
