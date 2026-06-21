import { describe, it, expect } from "vitest";
import {
  getActivityTypeLabel,
  getUnit,
  getImpactPill,
  getCategoryAndEmissions,
  calculateQuickStats,
} from "../../src/lib/displayUtils";
import type { Activity } from "../../src/types";

describe("displayUtils", () => {
  describe("getActivityTypeLabel", () => {
    it("should return correct label for valid types", () => {
      expect(getActivityTypeLabel("car")).toBe("Car Trip");
      expect(getActivityTypeLabel("beef")).toBe("Beef Consumption");
      expect(getActivityTypeLabel("electricity")).toBe("Electricity Usage");
      expect(getActivityTypeLabel("clothing")).toBe("Clothing Purchase");
      expect(getActivityTypeLabel("unknown")).toBe("unknown");
    });
  });

  describe("getUnit", () => {
    it("should return correct units", () => {
      expect(getUnit("car")).toBe("km");
      expect(getUnit("beef")).toBe("kg");
      expect(getUnit("electricity")).toBe("kWh");
      expect(getUnit("naturalGas")).toBe("m³");
      expect(getUnit("clothing")).toBe("item(s)");
    });
  });

  describe("getImpactPill", () => {
    it("should return low impact pill details", () => {
      const res = getImpactPill(2);
      expect(res.label).toBe("Low Impact");
      expect(res.classes).toContain("text-emerald-400");
    });

    it("should return medium impact pill details", () => {
      const res = getImpactPill(15);
      expect(res.label).toBe("Medium Impact");
      expect(res.classes).toContain("text-amber-400");
    });

    it("should return high impact pill details", () => {
      const res = getImpactPill(50);
      expect(res.label).toBe("High Impact");
      expect(res.classes).toContain("text-rose-400");
    });
  });

  describe("getCategoryAndEmissions", () => {
    it("should resolve transport activity emissions", () => {
      const act: Activity = {
        id: "1",
        type: "car",
        amount: 10,
        timestamp: Date.now(),
      };
      const res = getCategoryAndEmissions(act);
      expect(res.category).toBe("Transport");
      expect(res.label).toBe("🚗 Transport");
      expect(res.co2).toBeGreaterThan(0);
    });

    it("should resolve food activity emissions", () => {
      const act: Activity = {
        id: "2",
        type: "beef",
        amount: 2,
        timestamp: Date.now(),
      };
      const res = getCategoryAndEmissions(act);
      expect(res.category).toBe("Food");
      expect(res.label).toBe("🥗 Food");
      expect(res.co2).toBeGreaterThan(0);
    });

    it("should resolve energy activity emissions", () => {
      const act: Activity = {
        id: "3",
        type: "electricity",
        amount: 50,
        timestamp: Date.now(),
      };
      const res = getCategoryAndEmissions(act);
      expect(res.category).toBe("Energy");
      expect(res.label).toBe("🔌 Energy");
      expect(res.co2).toBeGreaterThan(0);
    });

    it("should resolve shopping activity emissions", () => {
      const act: Activity = {
        id: "4",
        type: "clothing",
        amount: 3,
        timestamp: Date.now(),
      };
      const res = getCategoryAndEmissions(act);
      expect(res.category).toBe("Shopping");
      expect(res.label).toBe("🛍️ Shopping");
      expect(res.co2).toBeGreaterThan(0);
    });

    it("should fallback for unknown activity type", () => {
      const act: Activity = {
        id: "5",
        type: "unknown",
        amount: 5,
        timestamp: Date.now(),
      };
      const res = getCategoryAndEmissions(act);
      expect(res.category).toBe("Unknown");
      expect(res.label).toBe("❓ Other");
      expect(res.co2).toBe(0);
    });
  });

  describe("calculateQuickStats", () => {
    it("should handle empty activities list gracefully", () => {
      const stats = calculateQuickStats([]);
      expect(stats.totalLogged).toBe(0);
      expect(stats.mostLoggedCategory).toBe("N/A");
      expect(stats.avgCO2PerActivity).toBe("0.00 kg");
    });

    it("should calculate correct stats for a single activity", () => {
      const activities: Activity[] = [
        { id: "1", type: "car", amount: 100, timestamp: Date.now() }, // co2: 17 kg
      ];
      const stats = calculateQuickStats(activities);
      expect(stats.totalLogged).toBe(1);
      expect(stats.mostLoggedCategory).toBe("Transport");
      expect(stats.avgCO2PerActivity).toBe("17.00 kg");
    });

    it("should calculate correct stats for multiple activities across different categories", () => {
      const activities: Activity[] = [
        { id: "1", type: "car", amount: 100, timestamp: Date.now() }, // Transport, co2: 17 kg
        { id: "2", type: "beef", amount: 1, timestamp: Date.now() }, // Food, co2: 59.6 kg
        { id: "3", type: "beef", amount: 1, timestamp: Date.now() }, // Food, co2: 59.6 kg
      ];
      // Total co2 = 17 + 59.6 + 59.6 = 136.2 kg
      // Average = 136.2 / 3 = 45.40 kg
      const stats = calculateQuickStats(activities);
      expect(stats.totalLogged).toBe(3);
      expect(stats.mostLoggedCategory).toBe("Food");
      expect(stats.avgCO2PerActivity).toBe("45.40 kg");
    });

    it("should break ties alphabetically when multiple categories have equal counts", () => {
      const activities: Activity[] = [
        { id: "1", type: "car", amount: 10, timestamp: Date.now() }, // Transport, count 1
        { id: "2", type: "beef", amount: 1, timestamp: Date.now() }, // Food, count 1
      ];
      // Food and Transport are tied (both count 1). Alphabetically "Food" < "Transport".
      const stats = calculateQuickStats(activities);
      expect(stats.totalLogged).toBe(2);
      expect(stats.mostLoggedCategory).toBe("Food");
    });
  });
});
