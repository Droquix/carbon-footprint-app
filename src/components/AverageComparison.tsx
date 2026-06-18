import type { AverageComparisonProps } from "../types";

/**
 * AverageComparison sub-component to render comparison of user footprint
 * against the national average.
 */
// prettier-ignore
export function AverageComparison({ totalWeeklyCO2, statusLabel, statusTextDesc, barColorClass, textColorClass, ratingLabelText, indianWeeklyAverageKg, percentageOfAverage }: AverageComparisonProps) {
  return (
    <div className="bg-slate-950/40 border border-slate-850 rounded-2xl p-5 mb-5">
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Indian Average Comparison</span>
        {totalWeeklyCO2 > 0 && <span className={`text-xs font-bold ${textColorClass}`}>{statusLabel}</span>}
      </div>

      {totalWeeklyCO2 === 0 ? (
        <p className="text-slate-400 text-xs py-1">{ratingLabelText}</p>
      ) : (
        <div className="space-y-3">
          <div
            className="w-full bg-slate-900 rounded-full h-2.5 overflow-hidden"
            role="progressbar"
            aria-valuenow={Math.round(percentageOfAverage)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Carbon footprint percentage of national average"
          >
            <div className={`h-full ${barColorClass} transition-all duration-500`} style={{ width: `${Math.min(100, percentageOfAverage)}%` }} />
          </div>
          <p className="text-xs text-slate-300 font-semibold">{ratingLabelText}</p>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            {statusTextDesc} Weekly national average baseline: <span className="font-mono">{indianWeeklyAverageKg.toFixed(2)} kg</span> (1.9 tons/year).
          </p>
        </div>
      )}
    </div>
  );
}
