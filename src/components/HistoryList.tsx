import type { Activity } from "../types";
import {
  calculateTransportEmissions,
  calculateFoodEmissions,
  calculateEnergyEmissions,
  calculateShoppingEmissions,
} from "../lib/emissions";
import {
  isValidTransportType,
  isValidFoodType,
  isValidEnergyType,
  isValidShoppingType,
} from "../lib/validators";

interface HistoryListProps {
  activities: Activity[];
  onClearActivities: () => void;
}

export function HistoryList({
  activities,
  onClearActivities,
}: HistoryListProps) {
  // Category helper
  const getCategoryAndEmissions = (act: Activity) => {
    if (isValidTransportType(act.type)) {
      const co2 = calculateTransportEmissions(act.type, act.amount);
      return { category: "Transport", label: "🚗 Transport", co2 };
    }
    if (isValidFoodType(act.type)) {
      const co2 = calculateFoodEmissions(act.type, act.amount);
      return { category: "Food", label: "🥗 Food", co2 };
    }
    if (isValidEnergyType(act.type)) {
      const co2 = calculateEnergyEmissions(act.type, act.amount);
      return { category: "Energy", label: "🔌 Energy", co2 };
    }
    if (isValidShoppingType(act.type)) {
      const co2 = calculateShoppingEmissions(act.type, act.amount);
      return { category: "Shopping", label: "🛍️ Shopping", co2 };
    }
    return { category: "Unknown", label: "❓ Other", co2: 0 };
  };

  // Activity type label helper
  const getActivityTypeLabel = (type: string) => {
    switch (type) {
      case "car":
        return "Car Trip";
      case "bus":
        return "Bus Ride";
      case "flight":
        return "Flight";
      case "bike":
        return "Bicycle";
      case "beef":
        return "Beef Consumption";
      case "chicken":
        return "Poultry Consumption";
      case "vegetables":
        return "Vegetables Consumption";
      case "dairy":
        return "Dairy/Cheese Consumption";
      case "electricity":
        return "Electricity Usage";
      case "naturalGas":
        return "Natural Gas Usage";
      case "clothing":
        return "Clothing Purchase";
      case "electronics":
        return "Electronics Purchase";
      default:
        return type;
    }
  };

  // Unit helper
  const getUnit = (type: string) => {
    if (["car", "bus", "flight", "bike"].includes(type)) return "km";
    if (["beef", "chicken", "vegetables", "dairy"].includes(type)) return "kg";
    if (type === "electricity") return "kWh";
    if (type === "naturalGas") return "m³";
    return "item(s)";
  };

  // Sort activities by timestamp desc (most recent first)
  const sortedActivities = [...activities].sort(
    (a, b) => b.timestamp - a.timestamp
  );

  return (
    <section className="bg-slate-800/60 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-6 shadow-2xl transition-all duration-300 hover:border-violet-500/30">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-slate-100 bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
          Activity History
        </h2>
        {activities.length > 0 && (
          <button
            onClick={onClearActivities}
            aria-label="Clear all activity history"
            className="text-xs font-semibold text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/15 border border-rose-500/20 px-3 py-1.5 rounded-xl transition-all duration-200"
          >
            Clear All
          </button>
        )}
      </div>

      {sortedActivities.length === 0 ? (
        <div className="text-center py-10 border-2 border-dashed border-slate-700/50 rounded-2xl">
          <span className="text-4xl block mb-3" role="img" aria-label="Inbox">
            📭
          </span>
          <p className="text-slate-400 text-sm font-medium">
            No activities logged yet.
          </p>
          <p className="text-slate-500 text-xs mt-1">
            Log activities above to view your history and track calculations.
          </p>
        </div>
      ) : (
        <div className="max-h-[380px] overflow-y-auto pr-1 space-y-3 custom-scrollbar">
          {sortedActivities.map((act) => {
            const { label, co2 } = getCategoryAndEmissions(act);
            return (
              <div
                key={act.id}
                className="bg-slate-900/40 border border-slate-700/30 rounded-2xl p-4 flex justify-between items-center gap-4 transition-all duration-200 hover:border-slate-600/30 hover:bg-slate-900/60"
              >
                <div className="flex items-center gap-3">
                  <div className="text-2xl" aria-hidden="true">
                    {label.split(" ")[0]}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-200">
                      {getActivityTypeLabel(act.type)}
                    </p>
                    <p className="text-xs text-slate-400">
                      {act.amount} {getUnit(act.type)} •{" "}
                      {new Date(act.timestamp).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-extrabold text-white">
                    {co2.toFixed(2)} kg
                  </p>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    CO2e
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
