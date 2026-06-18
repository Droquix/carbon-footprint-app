import { HISTORY_MAX_HEIGHT } from "../constants/uiConstants";
import {
  getActivityTypeLabel,
  getCategoryAndEmissions,
  getImpactPill,
  getUnit,
} from "../lib/displayUtils";
import type { HistoryListProps } from "../types";
import { HistoryEntry } from "./HistoryEntry";

/**
 * HistoryList component that displays the timeline of logged activities.
 */
// prettier-ignore
export function HistoryList({ activities, onClearActivities }: HistoryListProps) {
  const sorted = [...activities].sort((a, b) => b.timestamp - a.timestamp);
  return (
    <section className="bg-slate-900/40 backdrop-blur-xl border border-emerald-900/10 rounded-3xl p-6 shadow-2xl transition-all duration-300 hover:border-emerald-500/20 flex flex-col justify-between h-full">
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-100 bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent tracking-tight">Activity History</h2>
          {activities.length > 0 && (
            <button onClick={onClearActivities} aria-label="Clear all activity history" className="text-xs font-semibold text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/15 border border-rose-500/20 px-3 py-1.5 rounded-xl transition-all duration-200 min-h-[32px] focus:outline-none focus:ring-2 focus:ring-rose-500/40">Clear All</button>
          )}
        </div>
        {sorted.length === 0 ? (
          <div className="text-center py-10 border border-dashed border-slate-800 rounded-2xl">
            <span className="text-3xl block mb-2" role="img" aria-label="Empty Inbox">📭</span>
            <p className="text-slate-400 text-xs font-medium">No activities logged yet.</p>
          </div>
        ) : (
          <div className="relative pl-6 overflow-y-auto pr-1 custom-scrollbar" style={{ maxHeight: HISTORY_MAX_HEIGHT }}>
            <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-slate-800" />
            <ul className="space-y-6">
              {sorted.map((act) => {
                const { label, co2 } = getCategoryAndEmissions(act);
                return (
                  <HistoryEntry key={act.id} activity={act} categoryLabel={label} co2={co2} impactPill={getImpactPill(co2)} typeLabel={getActivityTypeLabel(act.type)} unit={getUnit(act.type)} />
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
