import type {
  TransportFactors,
  FoodFactors,
  EnergyFactors,
  ShoppingFactors,
} from "../types";

/**
 * Validates and parses a numeric input.
 * Sanitizes input by removing whitespace and parsing to a float.
 * If the input is empty or invalid, returns a default value of 0.
 * If the parsed value is negative, returns 0.
 *
 * @param input The raw input value (string or number).
 * @returns A validated, non-negative number.
 */
export function sanitizeNumberInput(input: string | number): number {
  if (input === undefined || input === null) {
    return 0;
  }
  const cleanStr = typeof input === "string" ? input.trim() : String(input);
  if (cleanStr === "") {
    return 0;
  }
  const parsed = parseFloat(cleanStr);
  if (isNaN(parsed) || !isFinite(parsed) || parsed < 0) {
    return 0;
  }
  return parsed;
}

/**
 * Validates if a key is a valid transport type.
 *
 * @param key The key to validate.
 * @returns True if key is valid transport type, false otherwise.
 */
export function isValidTransportType(
  key: string
): key is keyof TransportFactors {
  return ["car", "bus", "flight", "bike"].includes(key);
}

/**
 * Validates if a key is a valid food type.
 *
 * @param key The key to validate.
 * @returns True if key is valid food type, false otherwise.
 */
export function isValidFoodType(key: string): key is keyof FoodFactors {
  return ["beef", "chicken", "vegetables", "dairy"].includes(key);
}

/**
 * Validates if a key is a valid energy type.
 *
 * @param key The key to validate.
 * @returns True if key is valid energy type, false otherwise.
 */
export function isValidEnergyType(key: string): key is keyof EnergyFactors {
  return ["electricity", "naturalGas"].includes(key);
}

/**
 * Validates if a key is a valid shopping type.
 *
 * @param key The key to validate.
 * @returns True if key is valid shopping type, false otherwise.
 */
export function isValidShoppingType(key: string): key is keyof ShoppingFactors {
  return ["clothing", "electronics"].includes(key);
}
