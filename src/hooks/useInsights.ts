import { useMemo } from "react";
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

export interface InsightsResult {
  totalWeeklyCO2: number;
  highestImpactCategory: "transport" | "food" | "energy" | "shopping" | "none";
  topRecommendation: string;
  comparisonToIndianAverage: {
    userAnnualEstimateKg: number;
    indianAverageAnnualKg: number;
    differencePercentage: number;
    comparisonText: string;
  };
}

// Normalized weekly budgets in kg CO2e for category impact normalization
const CATEGORY_BUDGETS = {
  transport: 30, // kg CO2e / week
  food: 40, // kg CO2e / week
  energy: 50, // kg CO2e / week
  shopping: 20, // kg CO2e / week
};

/**
 * Custom hook to generate carbon insights, calculations, and recommendations based on activity history.
 *
 * @param activities The list of logged activities.
 * @returns The calculated carbon insights.
 */
export function useInsights(activities: Activity[]): InsightsResult {
  return useMemo(() => {
    const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const weeklyActivities = activities.filter(
      (act) => act.timestamp >= oneWeekAgo
    );

    let transportCO2 = 0;
    let foodCO2 = 0;
    let energyCO2 = 0;
    let shoppingCO2 = 0;

    weeklyActivities.forEach((act) => {
      if (isValidTransportType(act.type)) {
        transportCO2 += calculateTransportEmissions(act.type, act.amount);
      } else if (isValidFoodType(act.type)) {
        foodCO2 += calculateFoodEmissions(act.type, act.amount);
      } else if (isValidEnergyType(act.type)) {
        energyCO2 += calculateEnergyEmissions(act.type, act.amount);
      } else if (isValidShoppingType(act.type)) {
        shoppingCO2 += calculateShoppingEmissions(act.type, act.amount);
      }
    });

    const totalWeeklyCO2 = transportCO2 + foodCO2 + energyCO2 + shoppingCO2;

    // Normalizing by typical budgets to find relative highest impact
    const normalizedTransport = transportCO2 / CATEGORY_BUDGETS.transport;
    const normalizedFood = foodCO2 / CATEGORY_BUDGETS.food;
    const normalizedEnergy = energyCO2 / CATEGORY_BUDGETS.energy;
    const normalizedShopping = shoppingCO2 / CATEGORY_BUDGETS.shopping;

    const scores = [
      {
        category: "transport" as const,
        score: normalizedTransport,
        value: transportCO2,
      },
      { category: "food" as const, score: normalizedFood, value: foodCO2 },
      {
        category: "energy" as const,
        score: normalizedEnergy,
        value: energyCO2,
      },
      {
        category: "shopping" as const,
        score: normalizedShopping,
        value: shoppingCO2,
      },
    ];

    // Find the category with the highest normalized score (excluding categories with 0 emissions)
    const activeScores = scores.filter((s) => s.value > 0);
    let highestImpactCategory:
      | "transport"
      | "food"
      | "energy"
      | "shopping"
      | "none" = "none";
    if (activeScores.length > 0) {
      const highest = activeScores.reduce((max, current) =>
        current.score > max.score ? current : max
      );
      highestImpactCategory = highest.category;
    }

    // Recommendation logic
    let topRecommendation =
      "Log your activities to receive personalized carbon reduction recommendations.";
    if (highestImpactCategory === "transport") {
      topRecommendation =
        "Consider using public transit (bus) or biking instead of driving to lower your transport footprint.";
    } else if (highestImpactCategory === "food") {
      topRecommendation =
        "Reduce beef and dairy consumption by incorporating more plant-based meals into your diet.";
    } else if (highestImpactCategory === "energy") {
      topRecommendation =
        "Improve energy efficiency by turning off idle appliances and switching to LED lighting.";
    } else if (highestImpactCategory === "shopping") {
      topRecommendation =
        "Opt for second-hand clothing or extend the lifespan of your electronics before upgrading.";
    }

    // Comparison to Indian average (1.9 tons/year = 1900 kg/year)
    const userAnnualEstimateKg = totalWeeklyCO2 * 52;
    const indianAverageAnnualKg = 1900;
    const differenceKg = userAnnualEstimateKg - indianAverageAnnualKg;
    const differencePercentage = (differenceKg / indianAverageAnnualKg) * 100;

    let comparisonText = "";
    if (totalWeeklyCO2 === 0) {
      comparisonText = "No activities logged this week.";
    } else {
      const relWord = differencePercentage > 0 ? "higher" : "lower";
      comparisonText = `Your estimated annual footprint (${userAnnualEstimateKg.toFixed(
        1
      )} kg) is ${Math.abs(differencePercentage).toFixed(
        1
      )}% ${relWord} than the Indian national average (1,900 kg/year).`;
    }

    return {
      totalWeeklyCO2,
      highestImpactCategory,
      topRecommendation,
      comparisonToIndianAverage: {
        userAnnualEstimateKg,
        indianAverageAnnualKg,
        differencePercentage,
        comparisonText,
      },
    };
  }, [activities]);
}
