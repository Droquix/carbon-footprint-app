import { INDIAN_WEEKLY_AVERAGE_KG } from "../constants/calculationConstants";
import { useCountUp } from "../hooks/useCountUp";
// prettier-ignore
import { getComparisonDetails } from "../lib/insightUtils";
import type { InsightsCardProps } from "../types";
import { AverageComparison } from "./AverageComparison";
import { RecommendationCard } from "./RecommendationCard";

// prettier-ignore
const contributors: Record<string, string> = { transport: "🚗 Transport", food: "🥗 Food", energy: "🔌 Energy", shopping: "🛍️ Shopping", none: "" };

/**
 * InsightsCard component to present carbon footprint calculations, statistics,
 * comparison metrics, and a dynamic recommendation card.
 */
// prettier-ignore
export function InsightsCard({ insights }: InsightsCardProps) {
  const { totalWeeklyCO2, highestImpactCategory, topRecommendation, recommendation } = insights;
  const displayCO2 = useCountUp(totalWeeklyCO2);
  const comparison = getComparisonDetails(totalWeeklyCO2);
  const rec = recommendation;

  return (
    <section className="bg-slate-900/40 backdrop-blur-xl border border-emerald-900/10 rounded-3xl p-6 shadow-2xl transition-all duration-300 hover:border-emerald-500/20 flex flex-col justify-between h-full">
      <div>
        <h2 className="text-xl font-bold text-slate-100 mb-6 bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent tracking-tight">Your Carbon Assistant</h2>
        <div className="bg-slate-950/40 border border-slate-850 rounded-2xl p-5 mb-5 text-center">
          <span className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Your Weekly Carbon Footprint</span>
          <p className="text-4xl font-extrabold text-white font-mono">
            {displayCO2.toFixed(2)} <span className="text-lg font-medium text-slate-400 font-sans">kg CO2e</span>
          </p>
          {highestImpactCategory !== "none" && (
            <div className="mt-3 pt-3 border-t border-slate-900/60 flex justify-between items-center text-xs">
              <span className="text-slate-400 font-semibold">Your Primary Source:</span>
              <span className="font-bold text-slate-300">{contributors[highestImpactCategory]}</span>
            </div>
          )}
        </div>
        <AverageComparison totalWeeklyCO2={totalWeeklyCO2} indianWeeklyAverageKg={INDIAN_WEEKLY_AVERAGE_KG} {...comparison} />
      </div>
      <RecommendationCard headline={rec.headline} saving={rec.saving} topRecommendation={topRecommendation} />
    </section>
  );
}
