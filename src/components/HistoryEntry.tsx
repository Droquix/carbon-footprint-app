import type { HistoryEntryProps } from "../types";

/**
 * HistoryEntry sub-component representing a single log timeline item.
 */
// prettier-ignore
export function HistoryEntry({ activity, categoryLabel, co2, impactPill, typeLabel, unit }: HistoryEntryProps) {
  return (
    <li className="relative flex items-center justify-between gap-4">
      {/* Timeline Node dot with emoji inside */}
      <div className="absolute -left-[24px] w-6 h-6 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-xs shadow-md z-10" aria-hidden="true">
        {categoryLabel.split(" ")[0]}
      </div>

      <div className="pl-3">
        <p className="text-sm font-bold text-slate-200 leading-tight">{typeLabel}</p>
        <p className="text-[11px] text-slate-400 mt-0.5">
          {activity.amount} {unit} •{" "}
          {new Date(activity.timestamp).toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>

      <div className="text-right">
        {/* Monospace color-coded impact pill badge with text rating alongside color */}
        <span className={`inline-block text-[10px] font-bold font-mono px-2.5 py-1 rounded-full ${impactPill.classes}`}>
          <span>{co2.toFixed(2)} kg</span> <span className="opacity-90">({impactPill.label})</span>
        </span>
      </div>
    </li>
  );
}
