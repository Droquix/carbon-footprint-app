import {
  isValidTransportType,
  isValidFoodType,
  isValidEnergyType,
  isValidShoppingType,
  sanitizeNumberInput,
} from "./validators";

/**
 * Resolves the default activity type for a given category.
 *
 * @param category The activity category.
 * @returns The default activity type identifier.
 */
export function getDefaultTypeForCategory(
  category: "transport" | "food" | "energy" | "shopping"
): string {
  switch (category) {
    case "transport":
      return "car";
    case "food":
      return "beef";
    case "energy":
      return "electricity";
    case "shopping":
      return "clothing";
    default:
      return "";
  }
}

/**
 * Validates the input values for an activity log.
 *
 * @param category The selected category.
 * @param activityType The selected activity subcategory type.
 * @param amountInput The raw input string for amount.
 * @returns An object containing the validation status, sanitized amount, and error message if invalid.
 */
export function validateActivityInput(
  category: "transport" | "food" | "energy" | "shopping",
  activityType: string,
  amountInput: string
): { isValid: boolean; sanitizedAmount: number; error?: string } {
  const sanitizedAmount = sanitizeNumberInput(amountInput);
  if (sanitizedAmount <= 0) {
    return {
      isValid: false,
      sanitizedAmount: 0,
      error: "Please enter a valid positive quantity.",
    };
  }

  let isValidType = false;
  if (category === "transport" && isValidTransportType(activityType)) {
    isValidType = true;
  } else if (category === "food" && isValidFoodType(activityType)) {
    isValidType = true;
  } else if (category === "energy" && isValidEnergyType(activityType)) {
    isValidType = true;
  } else if (category === "shopping" && isValidShoppingType(activityType)) {
    isValidType = true;
  }

  if (!isValidType) {
    return {
      isValid: false,
      sanitizedAmount: 0,
      error: "Invalid activity selection.",
    };
  }

  return { isValid: true, sanitizedAmount };
}
