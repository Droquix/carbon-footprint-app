import { useState, useEffect } from "react";
import type { InsightsResult } from "../hooks/useInsights";
import {
  INDIAN_WEEKLY_AVERAGE_KG,
  BELOW_AVERAGE_THRESHOLD,
  ABOVE_AVERAGE_THRESHOLD,
  COUNTUP_DURATION_MS,
  COUNTUP_INTERVAL_MS,
} from "../constants/calculationConstants";

interface InsightsCardProps {
  insights: InsightsResult;
}

/**
 * InsightsCard component to present carbon footprint calculations, statistics,
 * comparison metrics, and a dynamic recommendation card.
 *
 * @param props Component properties.
 * @param props.insights Computed insights data object.
 * @returns The rendered React element.
 */
export function InsightsCard({ insights }: InsightsCardProps) {
  const { totalWeeklyCO2, highestImpactCategory, topRecommendation } = insights;

  const [displayCO2, setDisplayCO2] = useState(0);

  // Count-up animation on load/update
  useEffect(() => {
    let start = 0;
    const end = totalWeeklyCO2;
    if (end === 0) {
      setDisplayCO2(0);
      return;
    }

    const duration = COUNTUP_DURATION_MS; // 800ms
    const incrementTime = COUNTUP_INTERVAL_MS; // 25ms interval
    const steps = duration / incrementTime;
    const stepValue = end / steps;

    const timer = setInterval(() => {
      start += stepValue;
      if (start >= end) {
        clearInterval(timer);
        setDisplayCO2(end);
      } else {
        setDisplayCO2(start);
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, [totalWeeklyCO2]);

  // Target comparison metrics
  const indianWeeklyAverageKg = INDIAN_WEEKLY_AVERAGE_KG; // 1900 kg / 52 weeks
  const percentageOfAverage = (totalWeeklyCO2 / indianWeeklyAverageKg) * 100;

  // Determine comparison rating and color
  let statusLabel = "No Data";
  let statusTextDesc = "Log activities to calculate your standing.";
  let barColorClass = "bg-emerald-500";
  let textColorClass = "text-emerald-400";
  let ratingLabelText = "No activities logged this week.";

  if (totalWeeklyCO2 > 0) {
    if (percentageOfAverage < BELOW_AVERAGE_THRESHOLD) {
      statusLabel = "Below Average";
      statusTextDesc =
        "Your footprint is below the national average benchmark.";
      barColorClass = "bg-emerald-500";
      textColorClass = "text-emerald-400";
    } else if (
      percentageOfAverage >= BELOW_AVERAGE_THRESHOLD &&
      percentageOfAverage <= ABOVE_AVERAGE_THRESHOLD
    ) {
      statusLabel = "Near Average";
      statusTextDesc =
        "Your footprint is inline with the national average benchmark.";
      barColorClass = "bg-amber-500";
      textColorClass = "text-amber-400";
    } else {
      statusLabel = "Above Average";
      statusTextDesc = "Your footprint exceeds the national average benchmark.";
      barColorClass = "bg-rose-500";
      textColorClass = "text-rose-400";
    }

    ratingLabelText = `Standing: ${statusLabel} (${Math.round(
      percentageOfAverage
    )}% of weekly national average).`;
  }

  /**
   * Resolves the customized green recommendation card based on the highest impact category.
   *
   * @returns An object with headline, expected saving estimation, and recommended action text.
   */
  const getRecommendationDetails = () => {
    switch (highestImpactCategory) {
      case "transport":
        return {
          headline: "Commute Green",
          saving: "15.0 kg",
          action:
            "Switch your next local car trip to cycling or taking public transit.",
        };
      case "food":
        return {
          headline: "Plant-Based Eating",
          saving: "53.5 kg",
          action:
            "Replace beef or dairy in your next meal with poultry or plant-based alternatives.",
        };
      case "energy":
        return {
          headline: "Efficient Power",
          saving: "5.0 kg",
          action:
            "Shut down idle electronics and swap standard light bulbs to LED models.",
        };
      case "shopping":
        return {
          headline: "Extend Device Lifespans",
          saving: "300.0 kg",
          action:
            "Extend the lifecycle of your current laptop and choose second-hand clothing.",
        };
      default:
        return {
          headline: "Log First Activity",
          saving: "100.0 kg",
          action:
            "Log your transport, food, energy, and shopping logs to receive carbon tips.",
        };
    }
  };

  const rec = getRecommendationDetails();

  return (
    <section className="bg-slate-900/40 backdrop-blur-xl border border-emerald-900/10 rounded-3xl p-6 shadow-2xl transition-all duration-300 hover:border-emerald-500/20 flex flex-col justify-between h-full">
      <div>
        <h2 className="text-xl font-bold text-slate-100 mb-6 bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent tracking-tight">
          Weekly Insights
        </h2>

        {/* Big Monospace animated weekly number */}
        <div className="bg-slate-950/40 border border-slate-850 rounded-2xl p-5 mb-5 text-center">
          <span className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
            Weekly Carbon Footprint
          </span>
          <p className="text-4xl font-extrabold text-white font-mono">
            {displayCO2.toFixed(2)}{" "}
            <span className="text-lg font-medium text-slate-400 font-sans">
              kg CO2e
            </span>
          </p>
          {highestImpactCategory !== "none" && (
            <div className="mt-3 pt-3 border-t border-slate-900/60 flex justify-between items-center text-xs">
              <span className="text-slate-400 font-semibold">
                Highest Contributor:
              </span>
              <span className="font-bold text-slate-300">
                {highestImpactCategory === "transport" && "🚗 Transport"}
                {highestImpactCategory === "food" && "🥗 Food"}
                {highestImpactCategory === "energy" && "🔌 Energy"}
                {highestImpactCategory === "shopping" && "🛍️ Shopping"}
              </span>
            </div>
          )}
        </div>

        {/* Progress bar comparison */}
        <div className="bg-slate-950/40 border border-slate-850 rounded-2xl p-5 mb-5">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Indian Average Comparison
            </span>
            {totalWeeklyCO2 > 0 && (
              <span className={`text-xs font-bold ${textColorClass}`}>
                {statusLabel}
              </span>
            )}
          </div>

          {totalWeeklyCO2 === 0 ? (
            <p className="text-slate-400 text-xs py-1">{ratingLabelText}</p>
          ) : (
            <div className="space-y-3">
              {/* Progress bar with color gradient track */}
              <div className="w-full bg-slate-900 rounded-full h-2.5 overflow-hidden">
                <div
                  className={`h-full ${barColorClass} transition-all duration-500`}
                  style={{ width: `${Math.min(100, percentageOfAverage)}%` }}
                ></div>
              </div>

              {/* Informative text label alongside visual color */}
              <p className="text-xs text-slate-300 font-semibold">
                {ratingLabelText}
              </p>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                {statusTextDesc} Weekly national average baseline:{" "}
                <span className="font-mono">
                  {indianWeeklyAverageKg.toFixed(2)} kg
                </span>{" "}
                (1.9 tons/year).
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Structured Single Action Recommendation Card */}
      <div className="bg-slate-950/40 border border-slate-850 rounded-2xl p-5 mt-2">
        <span className="block text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-1">
          Target Action
        </span>
        <h3 className="text-base font-bold text-slate-200 mb-2">
          {rec.headline}
        </h3>
        <div className="flex items-center justify-between gap-3 bg-emerald-950/10 border border-emerald-900/10 rounded-xl p-3 mb-3">
          <span className="text-xs text-slate-400 font-semibold">
            Potential Saving
          </span>
          <span className="text-sm font-bold text-emerald-400 font-mono">
            ~{rec.saving} CO2e
          </span>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed font-medium">
          {topRecommendation}
        </p>
      </div>
    </section>
  );
}
