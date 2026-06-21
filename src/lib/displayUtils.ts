import {
  LOW_IMPACT_THRESHOLD,
  MEDIUM_IMPACT_THRESHOLD,
} from "../constants/calculationConstants";
import type { Activity, QuickStatsData } from "../types";
import {
  calculateTransportEmissions,
  calculateFoodEmissions,
  calculateEnergyEmissions,
  calculateShoppingEmissions,
} from "./emissions";
import {
  isValidTransportType,
  isValidFoodType,
  isValidEnergyType,
  isValidShoppingType,
} from "./validators";

/**
 * Maps an activity type identifier to its human-readable label.
 *
 * @param type The activity type identifier (e.g., "car", "beef").
 * @returns The human-readable label string.
 */
export function getActivityTypeLabel(type: string): string {
  switch (type) {
    case "car":
      return "Car Trip";
    case "bus":
      return "Bus Ride";
    case "flight":
      return "Flight";
    case "bike":
      return "Bicycle";
    case "beef":
      return "Beef Consumption";
    case "chicken":
      return "Poultry Consumption";
    case "vegetables":
      return "Vegetables Consumption";
    case "dairy":
      return "Dairy/Cheese Consumption";
    case "electricity":
      return "Electricity Usage";
    case "naturalGas":
      return "Natural Gas Usage";
    case "clothing":
      return "Clothing Purchase";
    case "electronics":
      return "Electronics Purchase";
    default:
      return type;
  }
}

/**
 * Resolves the unit label for an activity type.
 *
 * @param type The activity type identifier.
 * @returns The unit label string (e.g., "km", "kg", "kWh", "m³", or "item(s)").
 */
export function getUnit(type: string): string {
  if (["car", "bus", "flight", "bike"].includes(type)) return "km";
  if (["beef", "chicken", "vegetables", "dairy"].includes(type)) return "kg";
  if (type === "electricity") return "kWh";
  if (type === "naturalGas") return "m³";
  return "item(s)";
}

/**
 * Returns styling classes and a text label for the carbon impact category.
 *
 * @param co2 The carbon dioxide emission amount in kg.
 * @returns An object with tailwind classes and a textual impact label.
 */
export function getImpactPill(co2: number): {
  classes: string;
  label: string;
} {
  if (co2 < LOW_IMPACT_THRESHOLD) {
    return {
      classes:
        "bg-emerald-950/20 text-emerald-400 border border-emerald-500/20",
      label: "Low Impact",
    };
  } else if (co2 >= LOW_IMPACT_THRESHOLD && co2 <= MEDIUM_IMPACT_THRESHOLD) {
    return {
      classes: "bg-amber-950/20 text-amber-400 border border-amber-500/20",
      label: "Medium Impact",
    };
  } else {
    return {
      classes: "bg-rose-950/20 text-rose-400 border border-rose-500/20",
      label: "High Impact",
    };
  }
}

/**
 * Resolves the activity category, display label, and calculated CO2 emissions.
 *
 * @param act The activity object.
 * @returns An object with category name, label, and calculated CO2 emissions.
 */
export function getCategoryAndEmissions(act: Activity): {
  category: string;
  label: string;
  co2: number;
} {
  if (isValidTransportType(act.type)) {
    const co2 = calculateTransportEmissions(act.type, act.amount);
    return { category: "Transport", label: "🚗 Transport", co2 };
  }
  if (isValidFoodType(act.type)) {
    const co2 = calculateFoodEmissions(act.type, act.amount);
    return { category: "Food", label: "🥗 Food", co2 };
  }
  if (isValidEnergyType(act.type)) {
    const co2 = calculateEnergyEmissions(act.type, act.amount);
    return { category: "Energy", label: "🔌 Energy", co2 };
  }
  if (isValidShoppingType(act.type)) {
    const co2 = calculateShoppingEmissions(act.type, act.amount);
    return { category: "Shopping", label: "🛍️ Shopping", co2 };
  }
  return { category: "Unknown", label: "❓ Other", co2: 0 };
}

/**
 * Calculates Quick Stats summary metrics from the activity list.
 *
 * @param activities List of logged activities.
 * @returns QuickStatsData object.
 */
export function calculateQuickStats(activities: Activity[]): QuickStatsData {
  const totalLogged = activities.length;

  if (totalLogged === 0) {
    return {
      totalLogged: 0,
      mostLoggedCategory: "N/A",
      avgCO2PerActivity: "0.00 kg",
    };
  }

  // Count occurrences of each category
  const categoryCounts: Record<string, number> = {};
  let totalCO2 = 0;

  for (const activity of activities) {
    const { category, co2 } = getCategoryAndEmissions(activity);
    totalCO2 += co2;
    categoryCounts[category] = (categoryCounts[category] || 0) + 1;
  }

  // Find the most logged category (with tie-breaking logic)
  let mostLoggedCategory = "N/A";
  let maxCount = -1;

  // We sort categories alphabetically for predictable tie-breaking
  const categories = Object.keys(categoryCounts).sort();
  for (const category of categories) {
    const count = categoryCounts[category];
    if (count !== undefined && count > maxCount) {
      maxCount = count;
      mostLoggedCategory = category;
    }
  }

  const avgCO2 = totalCO2 / totalLogged;

  return {
    totalLogged,
    mostLoggedCategory,
    avgCO2PerActivity: `${avgCO2.toFixed(2)} kg`,
  };
}
