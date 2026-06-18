import { describe, it, expect } from "vitest";
import {
  getComparisonDetails,
  getRecommendationDetails,
} from "../../src/lib/insightUtils";

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
    it("should return recommendation details for each category", () => {
      expect(getRecommendationDetails("transport").headline).toBe(
        "Commute Green"
      );
      expect(getRecommendationDetails("food").headline).toBe(
        "Plant-Based Eating"
      );
      expect(getRecommendationDetails("energy").headline).toBe(
        "Efficient Power"
      );
      expect(getRecommendationDetails("shopping").headline).toBe(
        "Extend Device Lifespans"
      );
      expect(getRecommendationDetails("none").headline).toBe(
        "Log First Activity"
      );
    });
  });
});
