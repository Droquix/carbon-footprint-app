import { EMISSIONS_DATA } from "../constants/emissionsData";
import type {
  TransportFactors,
  FoodFactors,
  EnergyFactors,
  ShoppingFactors,
} from "../types";

/**
 * Calculates the CO2 emissions for a transport activity.
 *
 * @param type The type of transport (car, bus, flight, bike).
 * @param distanceKm The distance traveled in kilometers.
 * @returns The emissions in kg CO2e.
 * @throws Error if the transport type is invalid.
 */
export function calculateTransportEmissions(
  type: keyof TransportFactors,
  distanceKm: number
): number {
  if (
    typeof distanceKm !== "number" ||
    isNaN(distanceKm) ||
    !isFinite(distanceKm) ||
    distanceKm < 0
  ) {
    return 0;
  }

  const factor = EMISSIONS_DATA.transport[type];
  if (!factor) {
    throw new Error(`Invalid transport type: ${type}`);
  }

  return distanceKm * factor.value;
}

/**
 * Calculates the CO2 emissions for food consumption.
 *
 * @param type The type of food (beef, chicken, vegetables, dairy).
 * @param weightKg The weight of food consumed in kilograms.
 * @returns The emissions in kg CO2e.
 * @throws Error if the food type is invalid.
 */
export function calculateFoodEmissions(
  type: keyof FoodFactors,
  weightKg: number
): number {
  if (
    typeof weightKg !== "number" ||
    isNaN(weightKg) ||
    !isFinite(weightKg) ||
    weightKg < 0
  ) {
    return 0;
  }

  const factor = EMISSIONS_DATA.food[type];
  if (!factor) {
    throw new Error(`Invalid food type: ${type}`);
  }

  return weightKg * factor.value;
}

/**
 * Calculates the CO2 emissions for energy usage.
 *
 * @param type The type of energy (electricity, naturalGas).
 * @param amount The quantity consumed (kWh for electricity, m³ for natural gas).
 * @returns The emissions in kg CO2e.
 * @throws Error if the energy type is invalid.
 */
export function calculateEnergyEmissions(
  type: keyof EnergyFactors,
  amount: number
): number {
  if (
    typeof amount !== "number" ||
    isNaN(amount) ||
    !isFinite(amount) ||
    amount < 0
  ) {
    return 0;
  }

  const factor = EMISSIONS_DATA.energy[type];
  if (!factor) {
    throw new Error(`Invalid energy type: ${type}`);
  }

  return amount * factor.value;
}

/**
 * Calculates the CO2 emissions for shopping items.
 *
 * @param type The type of shopping item (clothing, electronics).
 * @param count The number of items purchased.
 * @returns The emissions in kg CO2e.
 * @throws Error if the shopping type is invalid.
 */
export function calculateShoppingEmissions(
  type: keyof ShoppingFactors,
  count: number
): number {
  if (
    typeof count !== "number" ||
    isNaN(count) ||
    !isFinite(count) ||
    count < 0
  ) {
    return 0;
  }

  const factor = EMISSIONS_DATA.shopping[type];
  if (!factor) {
    throw new Error(`Invalid shopping type: ${type}`);
  }

  return count * factor.value;
}
