import type { Activity } from "../types";

const STORAGE_KEY = "carbon_footprint_activities";

/**
 * Checks if localStorage is available and functional.
 * This handles private browsing modes or restricted environments safely.
 *
 * @returns A boolean indicating if localStorage is available.
 */
function isStorageAvailable(): boolean {
  try {
    const testKey = "__storage_test__";
    localStorage.setItem(testKey, testKey);
    localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

/**
 * Retrieves the list of logged activities from localStorage.
 *
 * @returns An array of Activity objects.
 */
export function getActivities(): Activity[] {
  if (!isStorageAvailable()) {
    console.warn("localStorage is not available.");
    return [];
  }

  try {
    const serializedActivities = localStorage.getItem(STORAGE_KEY);
    if (!serializedActivities) return [];

    const parsedActivities = JSON.parse(serializedActivities);
    return Array.isArray(parsedActivities) ? parsedActivities : [];
  } catch (error) {
    console.error("Failed to parse activities from localStorage:", error);
    return [];
  }
}

/**
 * Saves a new activity by appending it to the existing list in localStorage.
 * Handles localStorage quota errors or unavailability gracefully.
 *
 * @param activity The Activity object to save.
 */
export function saveActivity(activity: Activity): void {
  if (!isStorageAvailable()) {
    console.warn("localStorage is not available. Activity was not saved.");
    return;
  }

  try {
    const currentActivities = getActivities();
    currentActivities.push(activity);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(currentActivities));
  } catch (error) {
    console.error("Failed to save activity to localStorage:", error);
  }
}

/**
 * Clears all saved activities from localStorage.
 *
 * @returns void
 */
export function clearActivities(): void {
  if (!isStorageAvailable()) {
    console.warn("localStorage is not available.");
    return;
  }

  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Failed to clear activities from localStorage:", error);
  }
}
