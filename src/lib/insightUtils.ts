import {
  INDIAN_WEEKLY_AVERAGE_KG,
  BELOW_AVERAGE_THRESHOLD,
  ABOVE_AVERAGE_THRESHOLD,
  WEEKLY_MS_DURATION,
} from "../constants/calculationConstants";
import type { RecommendationDetails, Activity } from "../types";
import { getCategoryAndEmissions } from "./displayUtils";

export interface ComparisonDetails {
  percentageOfAverage: number;
  statusLabel: string;
  statusTextDesc: string;
  barColorClass: string;
  textColorClass: string;
  ratingLabelText: string;
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

interface RecommendationSpec {
  headline: string;
  savingPerUnit: number;
  habitTemplate: (count: number, savedCO2: string) => string;
  oneOffTemplate: (savedCO2: string) => string;
}

const RECOMMENDATION_SPECS: Record<string, RecommendationSpec> = {
  car: {
    headline: "Commute Green",
    savingPerUnit: 0.074, // 0.17 (car) - 0.096 (bus)
    habitTemplate: (count, savedCO2) =>
      `Swap 2 of your ${count} car trips for bus rides this week to save ${savedCO2} kg CO2e.`,
    oneOffTemplate: (savedCO2) =>
      `Swap 1 of your car trips for public transit or cycling to save ${savedCO2} kg CO2e.`,
  },
  bus: {
    headline: "Active Transit",
    savingPerUnit: 0.096, // 0.096 (bus) - 0.0 (bike)
    habitTemplate: (count, savedCO2) =>
      `Swap 2 of your ${count} bus rides for cycling or walking this week to save ${savedCO2} kg CO2e.`,
    oneOffTemplate: (savedCO2) =>
      `Swap 1 of your bus rides for biking to save ${savedCO2} kg CO2e.`,
  },
  flight: {
    headline: "Fly Less",
    savingPerUnit: 0.054, // 0.15 (flight) - 0.096 (bus)
    habitTemplate: (count, savedCO2) =>
      `Swap 2 of your ${count} flights for train or bus journeys to save ${savedCO2} kg CO2e.`,
    oneOffTemplate: (savedCO2) =>
      `Swap 1 of your flights for a train or bus alternative to save ${savedCO2} kg CO2e.`,
  },
  bike: {
    headline: "Keep Cycling",
    savingPerUnit: 0.0,
    habitTemplate: (_count) =>
      `Great job! Keep using your bicycle for zero-emission travel.`,
    oneOffTemplate: () =>
      `Great job! Your biking trips have zero direct emissions.`,
  },
  beef: {
    headline: "Reduce Red Meat",
    savingPerUnit: 53.5, // 59.6 (beef) - 6.1 (chicken)
    habitTemplate: (count, savedCO2) =>
      `Replace beef in 2 of your ${count} meals with chicken or plant proteins to save ${savedCO2} kg CO2e.`,
    oneOffTemplate: (savedCO2) =>
      `Replace beef in 1 of your meals with chicken or veggies to save ${savedCO2} kg CO2e.`,
  },
  dairy: {
    headline: "Plant-Based Dairy",
    savingPerUnit: 20.8, // 21.2 (dairy cheese) - 0.4 (veggies)
    habitTemplate: (count, savedCO2) =>
      `Swap dairy for plant-based alternatives in 2 of your ${count} meals to save ${savedCO2} kg CO2e.`,
    oneOffTemplate: (savedCO2) =>
      `Swap dairy for a plant-based alternative in 1 of your meals to save ${savedCO2} kg CO2e.`,
  },
  chicken: {
    headline: "Low-Impact Poultry",
    savingPerUnit: 5.7, // 6.1 (chicken) - 0.4 (veggies)
    habitTemplate: (count, savedCO2) =>
      `Swap chicken for plant-based options in 2 of your ${count} meals to save ${savedCO2} kg CO2e.`,
    oneOffTemplate: (savedCO2) =>
      `Swap chicken for plant proteins in 1 of your meals to save ${savedCO2} kg CO2e.`,
  },
  vegetables: {
    headline: "Eco-Friendly Diet",
    savingPerUnit: 0.0,
    habitTemplate: (_count) =>
      `Excellent! Your vegetable-rich diet is very low carbon.`,
    oneOffTemplate: () => `Great! Vegetables have a minimal carbon footprint.`,
  },
  electricity: {
    headline: "Power Efficiency",
    savingPerUnit: 0.0742, // 0.371 * 0.20 (20% reduction)
    habitTemplate: (_count, savedCO2) =>
      `Adopt a habit of turning off standby electronics to cut electricity use by 20% and save ${savedCO2} kg CO2e.`,
    oneOffTemplate: (savedCO2) =>
      `Turn off unused appliances or switch to LED bulbs to save ${savedCO2} kg CO2e.`,
  },
  naturalGas: {
    headline: "Thermostat Control",
    savingPerUnit: 0.2895, // 1.93 * 0.15 (15% reduction)
    habitTemplate: (_count, savedCO2) =>
      `Lower your thermostat setting consistently to reduce natural gas use by 15% and save ${savedCO2} kg CO2e.`,
    oneOffTemplate: (savedCO2) =>
      `Optimize your heating or insulate windows to save ${savedCO2} kg CO2e.`,
  },
  clothing: {
    headline: "Sustainable Fashion",
    savingPerUnit: 12.0, // 15.0 (clothing) - 3.0 (thrift)
    habitTemplate: (count, savedCO2) =>
      `Buy second-hand or thrift clothing for 2 of your ${count} purchases to save ${savedCO2} kg CO2e.`,
    oneOffTemplate: (savedCO2) =>
      `Choose a high-quality second-hand clothing item instead of new to save ${savedCO2} kg CO2e.`,
  },
  electronics: {
    headline: "Extend Device Lifespans",
    savingPerUnit: 150.0,
    habitTemplate: (_count, savedCO2) =>
      `Choose refurbished electronics or extend current device lifespans to save ${savedCO2} kg CO2e.`,
    oneOffTemplate: (savedCO2) =>
      `Repair or opt for a refurbished device instead of buying new to save ${savedCO2} kg CO2e.`,
  },
};

/**
 * Resolves context-aware recommendation details based on weekly activity history.
 *
 * @param activities List of logged activities.
 * @param highestImpactCategory The highest impact category identifier.
 * @param referenceTime The reference time to calculate weekly bounds (defaults to Date.now()).
 * @returns RecommendationDetails object.
 */
export function getRecommendationDetails(
  activities: Activity[],
  highestImpactCategory: "transport" | "food" | "energy" | "shopping" | "none",
  referenceTime: number = Date.now()
): RecommendationDetails {
  if (highestImpactCategory === "none" || activities.length === 0) {
    return {
      headline: "Log First Activity",
      saving: "0.0 kg",
      action:
        "Log your activities to receive personalized carbon reduction recommendations.",
    };
  }

  const oneWeekAgo = referenceTime - WEEKLY_MS_DURATION;
  const weeklyActivities = activities.filter(
    (act) => act.timestamp >= oneWeekAgo && act.timestamp <= referenceTime
  );

  // Group emissions by activity type in the highestImpactCategory
  const typeEmissions: Record<string, number> = {};
  const typeCounts: Record<string, number> = {};
  const typeAmounts: Record<string, number> = {};

  for (const act of weeklyActivities) {
    const { category, co2 } = getCategoryAndEmissions(act);
    if (category.toLowerCase() === highestImpactCategory) {
      const type = act.type;
      typeEmissions[type] = (typeEmissions[type] || 0) + co2;
      typeCounts[type] = (typeCounts[type] || 0) + 1;
      typeAmounts[type] = (typeAmounts[type] || 0) + act.amount;
    }
  }

  // Find the highest impact specific type in the category
  let highestType = "";
  let highestTypeCO2 = -1;
  for (const type of Object.keys(typeEmissions)) {
    if (typeEmissions[type] > highestTypeCO2) {
      highestTypeCO2 = typeEmissions[type];
      highestType = type;
    }
  }

  const spec = highestType ? RECOMMENDATION_SPECS[highestType] : null;
  if (!spec) {
    return {
      headline: "Reduce Emissions",
      saving: "0.0 kg",
      action: `Lower your emissions in the ${highestImpactCategory} category by tracking your habits.`,
    };
  }

  const count = typeCounts[highestType] || 0;
  const totalAmount = typeAmounts[highestType] || 0;
  const averageAmount = count > 0 ? totalAmount / count : 0;

  const isHabit = count >= 3;
  const swapCount = isHabit ? 2 : 1;
  const swappedQuantity = swapCount * averageAmount;
  const savedCO2Val = swappedQuantity * spec.savingPerUnit;
  const savedCO2Str = savedCO2Val.toFixed(1);

  const action = isHabit
    ? spec.habitTemplate(count, savedCO2Str)
    : spec.oneOffTemplate(savedCO2Str);

  return {
    headline: spec.headline,
    saving: `${savedCO2Str} kg`,
    action,
  };
}
