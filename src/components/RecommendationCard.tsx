import type { RecommendationCardProps } from "../types";

/**
 * RecommendationCard sub-component to display carbon savings tips.
 *
 * @param props Component properties.
 * @returns The rendered React element.
 */
export function RecommendationCard({
  headline,
  saving,
  topRecommendation,
}: RecommendationCardProps) {
  return (
    <div className="bg-slate-950/40 border border-slate-850 rounded-2xl p-5 mt-2">
      <span className="block text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-1">
        Target Action
      </span>
      <h3 className="text-base font-bold text-slate-200 mb-2">{headline}</h3>
      <div className="flex items-center justify-between gap-3 bg-emerald-950/10 border border-emerald-900/10 rounded-xl p-3 mb-3">
        <span className="text-xs text-slate-400 font-semibold">
          Potential Saving
        </span>
        <span className="text-sm font-bold text-emerald-400 font-mono">
          ~{saving} CO2e
        </span>
      </div>
      <p className="text-xs text-slate-400 leading-relaxed font-medium">
        {topRecommendation}
      </p>
    </div>
  );
}
