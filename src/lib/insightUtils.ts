import {
  INDIAN_WEEKLY_AVERAGE_KG,
  BELOW_AVERAGE_THRESHOLD,
  ABOVE_AVERAGE_THRESHOLD,
} from "../constants/calculationConstants";

export interface ComparisonDetails {
  percentageOfAverage: number;
  statusLabel: string;
  statusTextDesc: string;
  barColorClass: string;
  textColorClass: string;
  ratingLabelText: string;
}

export interface RecommendationDetails {
  headline: string;
  saving: string;
  action: string;
}

/**
 * Calculates comparison metrics and display classes/text based on total weekly CO2.
 *
 * @param totalWeeklyCO2 Total weekly CO2 emissions in kg.
 * @returns ComparisonDetails object.
 */
export function getComparisonDetails(
  totalWeeklyCO2: number
): ComparisonDetails {
  const indianWeeklyAverageKg = INDIAN_WEEKLY_AVERAGE_KG;
  const percentageOfAverage = (totalWeeklyCO2 / indianWeeklyAverageKg) * 100;

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

  return {
    percentageOfAverage,
    statusLabel,
    statusTextDesc,
    barColorClass,
    textColorClass,
    ratingLabelText,
  };
}

/**
 * Resolves recommendation details based on the highest impact category.
 *
 * @param highestImpactCategory The highest impact category identifier.
 * @returns RecommendationDetails object.
 */
export function getRecommendationDetails(
  highestImpactCategory: "transport" | "food" | "energy" | "shopping" | "none"
): RecommendationDetails {
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
}
