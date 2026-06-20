import { describe, it, expect } from "vitest";
import {
  getComparisonDetails,
  getRecommendationDetails,
} from "../../src/lib/insightUtils";
import type { Activity } from "../../src/types";

describe("insightUtils", () => {
  describe("getComparisonDetails", () => {
    it("should return correct details when totalWeeklyCO2 is 0", () => {
      const res = getComparisonDetails(0);
      expect(res.statusLabel).toBe("No Data");
      expect(res.ratingLabelText).toBe("No activities logged this week.");
    });

    it("should return below average standing", () => {
      const res = getComparisonDetails(10);
      expect(res.statusLabel).toBe("Below Average");
      expect(res.barColorClass).toBe("bg-emerald-500");
    });

    it("should return near average standing", () => {
      const res = getComparisonDetails(35); // Benchmark is 36.54. 35/36.54 = ~95%
      expect(res.statusLabel).toBe("Near Average");
      expect(res.barColorClass).toBe("bg-amber-500");
    });

    it("should return above average standing", () => {
      const res = getComparisonDetails(60); // 60/36.54 = ~164%
      expect(res.statusLabel).toBe("Above Average");
      expect(res.barColorClass).toBe("bg-rose-500");
    });
  });

  describe("getRecommendationDetails", () => {
    const refTime = 1625097600000; // Fixed timestamp (July 1, 2021)

    it("should handle single high-frequency activity (habit recommendation & swapping calculation)", () => {
      // 3 car trips of 15 km each => count = 3, total = 45 km, avg = 15 km
      // Swapping 2 trips: 2 * 15 * 0.074 (savings factor) = 2.22 kg => "2.2 kg"
      const activities: Activity[] = [
        { id: "1", type: "car", amount: 15, timestamp: refTime - 1000 },
        { id: "2", type: "car", amount: 15, timestamp: refTime - 2000 },
        { id: "3", type: "car", amount: 15, timestamp: refTime - 3000 },
      ];

      const rec = getRecommendationDetails(activities, "transport", refTime);
      expect(rec.headline).toBe("Commute Green");
      expect(rec.saving).toBe("2.2 kg");
      expect(rec.action).toBe(
        "Swap 2 of your 3 car trips for bus rides this week to save 2.2 kg CO2e."
      );
    });

    it("should handle multiple different activities in same category (determining highest contributor)", () => {
      // 1 flight of 1000 km => 1000 * 0.15 = 150 kg (highest contribution)
      // 2 car trips of 100 km => 200 * 0.17 = 34 kg
      // Highest type is flight. One-off swap (since flight count is 1 < 3)
      // Swapping 1 trip: 1 * 1000 * 0.054 (flight-to-bus savings factor) = 54 kg => "54.0 kg"
      const activities: Activity[] = [
        { id: "1", type: "flight", amount: 1000, timestamp: refTime - 1000 },
        { id: "2", type: "car", amount: 100, timestamp: refTime - 2000 },
        { id: "3", type: "car", amount: 100, timestamp: refTime - 3000 },
      ];

      const rec = getRecommendationDetails(activities, "transport", refTime);
      expect(rec.headline).toBe("Fly Less");
      expect(rec.saving).toBe("54.0 kg");
      expect(rec.action).toBe(
        "Swap 1 of your flights for a train or bus alternative to save 54.0 kg CO2e."
      );
    });

    it("should handle no activities gracefully (handling the fallback case)", () => {
      const rec = getRecommendationDetails([], "none", refTime);
      expect(rec.headline).toBe("Log First Activity");
      expect(rec.saving).toBe("0.0 kg");
      expect(rec.action).toBe(
        "Log your activities to receive personalized carbon reduction recommendations."
      );
    });

    it("should handle mixed categories with close values and target specific category sub-emissions", () => {
      // 1 car trip of 200 km => 34 kg CO2e (Transport)
      // 1 beef meal of 1 kg => 59.6 kg CO2e (Food)
      const activities: Activity[] = [
        { id: "1", type: "car", amount: 200, timestamp: refTime - 1000 },
        { id: "2", type: "beef", amount: 1, timestamp: refTime - 2000 },
      ];

      // If Transport is the highest impact category:
      const recTransport = getRecommendationDetails(
        activities,
        "transport",
        refTime
      );
      expect(recTransport.headline).toBe("Commute Green");
      expect(recTransport.saving).toBe("14.8 kg"); // 1 * 200 * 0.074 = 14.8
      expect(recTransport.action).toContain("Swap 1 of your car trips");

      // If Food is the highest impact category:
      const recFood = getRecommendationDetails(activities, "food", refTime);
      expect(recFood.headline).toBe("Reduce Red Meat");
      expect(recFood.saving).toBe("53.5 kg"); // 1 * 1 * 53.5 = 53.5
      expect(recFood.action).toContain("Replace beef in 1 of your meals");
    });
  });
});
