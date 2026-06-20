import type { Activity } from "../types";
import { getCategoryAndEmissions } from "./displayUtils";
import { WEEKLY_MS_DURATION } from "../constants/calculationConstants";

export interface CategoryPercentages {
  transport: number;
  food: number;
  energy: number;
  shopping: number;
}

/**
 * Calculates the percentage contribution of each carbon footprint category
 * to the total emissions within the last week.
 *
 * @param activities List of logged activities.
 * @param referenceTime The reference time to calculate weekly bounds (defaults to Date.now()).
 * @returns An object containing percentages for each category.
 */
export function calculateCategoryPercentages(
  activities: Activity[],
  referenceTime: number = Date.now()
): CategoryPercentages {
  const oneWeekAgo = referenceTime - WEEKLY_MS_DURATION;
  const weeklyActivities = activities.filter(
    (act) => act.timestamp >= oneWeekAgo && act.timestamp <= referenceTime
  );

  let transportSum = 0;
  let foodSum = 0;
  let energySum = 0;
  let shoppingSum = 0;

  for (const act of weeklyActivities) {
    const { category, co2 } = getCategoryAndEmissions(act);
    if (category === "Transport") {
      transportSum += co2;
    } else if (category === "Food") {
      foodSum += co2;
    } else if (category === "Energy") {
      energySum += co2;
    } else if (category === "Shopping") {
      shoppingSum += co2;
    }
  }

  const totalSum = transportSum + foodSum + energySum + shoppingSum;
  if (totalSum === 0) {
    return { transport: 0, food: 0, energy: 0, shopping: 0 };
  }

  return {
    transport: (transportSum / totalSum) * 100,
    food: (foodSum / totalSum) * 100,
    energy: (energySum / totalSum) * 100,
    shopping: (shoppingSum / totalSum) * 100,
  };
}
