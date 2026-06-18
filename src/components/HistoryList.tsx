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
import {
  getActivityTypeLabel,
  getUnit,
  getImpactPill,
} from "../lib/displayUtils";
import { HISTORY_MAX_HEIGHT } from "../constants/uiConstants";

interface HistoryListProps {
  activities: Activity[];
  onClearActivities: () => void;
}

/**
 * HistoryList component that displays the timeline of logged activities.
 *
 * @param props Component properties.
 * @param props.activities Array of logged activities.
 * @param props.onClearActivities Callback to clear all logged activities.
 * @returns The rendered React element.
 */
export function HistoryList({
  activities,
  onClearActivities,
}: HistoryListProps) {
  /**
   * Resolves the activity category, display label, and calculated CO2 emissions.
   *
   * @param act The activity object.
   * @returns An object with category name, label, and calculated CO2 emissions.
   */
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

  // Sort activities by timestamp desc (most recent first)
  const sortedActivities = [...activities].sort(
    (a, b) => b.timestamp - a.timestamp
  );

  return (
    <section className="bg-slate-900/40 backdrop-blur-xl border border-emerald-900/10 rounded-3xl p-6 shadow-2xl transition-all duration-300 hover:border-emerald-500/20 flex flex-col justify-between h-full">
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-100 bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent tracking-tight">
            Activity History
          </h2>
          {activities.length > 0 && (
            <button
              onClick={onClearActivities}
              aria-label="Clear all activity history"
              className="text-xs font-semibold text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/15 border border-rose-500/20 px-3 py-1.5 rounded-xl transition-all duration-200 min-h-[32px]"
            >
              Clear All
            </button>
          )}
        </div>

        {sortedActivities.length === 0 ? (
          <div className="text-center py-10 border border-dashed border-slate-800 rounded-2xl">
            <span
              className="text-3xl block mb-2"
              role="img"
              aria-label="Empty Inbox"
            >
              📭
            </span>
            <p className="text-slate-400 text-xs font-medium">
              No activities logged yet.
            </p>
          </div>
        ) : (
          /* Vertical Timeline Layout container */
          <div
            className="relative pl-6 overflow-y-auto pr-1 custom-scrollbar"
            style={{ maxHeight: HISTORY_MAX_HEIGHT }}
          >
            {/* Timeline center line */}
            <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-slate-800"></div>

            <div className="space-y-6">
              {sortedActivities.map((act) => {
                const { label, co2 } = getCategoryAndEmissions(act);
                const pill = getImpactPill(co2);

                return (
                  <div
                    key={act.id}
                    className="relative flex items-center justify-between gap-4"
                  >
                    {/* Timeline Node dot with emoji inside */}
                    <div
                      className="absolute -left-[24px] w-6 h-6 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-xs shadow-md z-10"
                      aria-hidden="true"
                    >
                      {label.split(" ")[0]}
                    </div>

                    <div className="pl-3">
                      <p className="text-sm font-bold text-slate-200 leading-tight">
                        {getActivityTypeLabel(act.type)}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {act.amount} {getUnit(act.type)} •{" "}
                        {new Date(act.timestamp).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>

                    <div className="text-right">
                      {/* Monospace color-coded impact pill badge with text rating alongside color */}
                      <span
                        className={`inline-block text-[10px] font-bold font-mono px-2.5 py-1 rounded-full ${pill.classes}`}
                      >
                        <span>{co2.toFixed(2)} kg</span>{" "}
                        <span className="opacity-90">({pill.label})</span>
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
