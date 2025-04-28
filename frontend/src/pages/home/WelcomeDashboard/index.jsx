import WidgetHeader from "./appearance/WidgetHeader";
import BodyText from "./appearance/BodyText";
export default function WelcomeDashboard() {
  return (
    <div className="flex flex-col h-full w-full gap-4 p-8 bg-gray-100">
      <WidgetHeader />
      <BodyText />
    </div>
  );
}
