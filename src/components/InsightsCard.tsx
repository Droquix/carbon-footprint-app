import type { InsightsResult } from "../hooks/useInsights";

interface InsightsCardProps {
  insights: InsightsResult;
}

export function InsightsCard({ insights }: InsightsCardProps) {
  const {
    totalWeeklyCO2,
    highestImpactCategory,
    topRecommendation,
    comparisonToIndianAverage,
  } = insights;

  const isHigherThanAverage =
    comparisonToIndianAverage.differencePercentage > 0;
  const absDifference = Math.abs(
    comparisonToIndianAverage.differencePercentage
  ).toFixed(1);

  // Category emoji and labels mapper
  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case "transport":
        return "🚗 Transport";
      case "food":
        return "🥗 Food";
      case "energy":
        return "🔌 Energy";
      case "shopping":
        return "🛍️ Shopping";
      default:
        return "None";
    }
  };

  return (
    <section className="bg-slate-800/60 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-6 shadow-2xl transition-all duration-300 hover:border-indigo-500/30 flex flex-col justify-between h-full">
      <div>
        <h2 className="text-xl font-bold text-slate-100 mb-6 bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
          Weekly Carbon Insights
        </h2>

        {/* Total emissions display */}
        <div className="bg-slate-900/50 border border-slate-700/40 rounded-2xl p-5 mb-5 text-center">
          <p className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-1">
            Total Carbon Footprint (7 Days)
          </p>
          <p className="text-4xl font-extrabold text-white">
            {totalWeeklyCO2.toFixed(2)}{" "}
            <span className="text-xl font-medium text-slate-400">kg CO2e</span>
          </p>
        </div>

        {/* Indian average comparison */}
        <div className="bg-slate-900/50 border border-slate-700/40 rounded-2xl p-5 mb-5">
          <h3 className="text-sm font-semibold text-slate-300 mb-3 uppercase tracking-wider">
            Indian Average Comparison
          </h3>
          {totalWeeklyCO2 === 0 ? (
            <p className="text-slate-400 text-sm">
              No activities logged this week to calculate comparison.
            </p>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                    isHigherThanAverage
                      ? "bg-rose-500/10 text-rose-400 border border-rose-500/25"
                      : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/25"
                  }`}
                >
                  {isHigherThanAverage
                    ? "⚠️ Above Average"
                    : "✅ Below Average"}
                </span>
                <span className="text-sm font-semibold text-slate-200">
                  {absDifference}% {isHigherThanAverage ? "higher" : "lower"}{" "}
                  than national average
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed mt-1">
                {comparisonToIndianAverage.comparisonText} (Based on 1.9 tons /
                1,900 kg annual per capita target).
              </p>
            </div>
          )}
        </div>

        {/* Highest impact category */}
        <div className="bg-slate-900/50 border border-slate-700/40 rounded-2xl p-5 mb-5">
          <h3 className="text-sm font-semibold text-slate-300 mb-2 uppercase tracking-wider">
            Highest Impact Source
          </h3>
          {highestImpactCategory === "none" ? (
            <p className="text-slate-400 text-sm">
              No direct carbon contributors found yet.
            </p>
          ) : (
            <div>
              <p className="text-lg font-bold text-violet-300">
                {getCategoryLabel(highestImpactCategory)}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                This category has the highest relative contribution to your
                weekly carbon footprint, normalized by typical carbon budgets.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Dynamic Recommendation */}
      <div className="mt-2 bg-gradient-to-br from-violet-950/40 to-indigo-950/40 border border-violet-800/30 rounded-2xl p-5">
        <h3 className="text-xs font-bold text-violet-400 uppercase tracking-widest mb-1.5">
          💡 Next Action Recommendation
        </h3>
        <p className="text-sm text-slate-200 leading-relaxed font-medium">
          {topRecommendation}
        </p>
      </div>
    </section>
  );
}
