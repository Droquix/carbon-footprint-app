import {
  LOW_IMPACT_THRESHOLD,
  MEDIUM_IMPACT_THRESHOLD,
} from "../constants/calculationConstants";

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
