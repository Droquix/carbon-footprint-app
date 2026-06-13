import { useState, useCallback } from "react";
import type { Activity } from "../types";
import { getActivities, saveActivity, clearActivities } from "../lib/storage";

/**
 * Custom hook to manage carbon footprint activity logs in state and localStorage.
 */
export function useFootprint() {
  const [activities, setActivities] = useState<Activity[]>(() =>
    getActivities()
  );

  /**
   * Logs a new activity. Appends it to state and persists it to localStorage.
   *
   * @param type The type of activity (e.g. 'car', 'beef', 'electricity').
   * @param amount The numeric amount of the activity.
   */
  const addActivity = useCallback((type: string, amount: number) => {
    const newActivity: Activity = {
      id: `act-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      type,
      amount,
      timestamp: Date.now(),
    };
    saveActivity(newActivity);
    setActivities((prev) => [...prev, newActivity]);
  }, []);

  /**
   * Clears all logged activities from both state and localStorage.
   */
  const clearAllActivities = useCallback(() => {
    clearActivities();
    setActivities([]);
  }, []);

  return {
    activities,
    addActivity,
    clearAllActivities,
  };
}
