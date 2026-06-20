import { describe, it, expect } from "vitest";
import { calculateCategoryPercentages } from "../../src/lib/categoryBreakdown";
import type { Activity } from "../../src/types";

describe("calculateCategoryPercentages", () => {
  const refTime = 1625097600000; // Fixed reference timestamp (July 1, 2021)

  it("should handle zero activities correctly", () => {
    const percentages = calculateCategoryPercentages([], refTime);
    expect(percentages).toEqual({
      transport: 0,
      food: 0,
      energy: 0,
      shopping: 0,
    });
  });

  it("should handle single category contribution correctly", () => {
    const activities: Activity[] = [
      {
        id: "1",
        type: "car",
        amount: 100, // 100 km * 0.12 kg/km = 12 kg CO2
        timestamp: refTime - 1000,
      },
    ];

    const percentages = calculateCategoryPercentages(activities, refTime);
    expect(percentages).toEqual({
      transport: 100,
      food: 0,
      energy: 0,
      shopping: 0,
    });
  });

  it("should handle normal distribution of activities correctly", () => {
    // Transport: car 50 km => 50 * 0.17 = 8.5 kg CO2
    // Food: beef 2 kg => 2 * 59.6 = 119.2 kg CO2
    // Total CO2 = 127.7 kg
    // transport: (8.5/127.7) * 100 = ~6.66%
    // food: (119.2/127.7) * 100 = ~93.34%
    const activities: Activity[] = [
      { id: "1", type: "car", amount: 50, timestamp: refTime - 5000 },
      { id: "2", type: "beef", amount: 2, timestamp: refTime - 10000 },
    ];

    const percentages = calculateCategoryPercentages(activities, refTime);
    expect(percentages.transport).toBeCloseTo(6.656, 1);
    expect(percentages.food).toBeCloseTo(93.344, 1);
    expect(percentages.energy).toBe(0);
    expect(percentages.shopping).toBe(0);
  });

  it("should handle equal distribution across categories correctly", () => {
    // Transport: car with amount = 15 / 0.17 => 15 kg
    // Food: chicken with amount = 15 / 6.1 => 15 kg
    // Energy: electricity with amount = 15 / 0.371 => 15 kg
    // Shopping: clothing with amount = 1 => 15 kg
    // Total = 60 kg, each category represents exactly 15 kg (25%)
    const activities: Activity[] = [
      {
        id: "1",
        type: "car",
        amount: 88.23529411764706,
        timestamp: refTime - 1000,
      },
      {
        id: "2",
        type: "chicken",
        amount: 2.459016393442623,
        timestamp: refTime - 2000,
      },
      {
        id: "3",
        type: "electricity",
        amount: 40.43126684636118,
        timestamp: refTime - 3000,
      },
      { id: "4", type: "clothing", amount: 1, timestamp: refTime - 4005 },
    ];

    const percentages = calculateCategoryPercentages(activities, refTime);
    expect(percentages.transport).toBeCloseTo(25, 2);
    expect(percentages.food).toBeCloseTo(25, 2);
    expect(percentages.energy).toBeCloseTo(25, 2);
    expect(percentages.shopping).toBeCloseTo(25, 2);
  });

  it("should ignore activities older than 7 days", () => {
    const oneWeekAndOneHourAgo = refTime - (7 * 24 * 60 * 60 * 1000 + 3600000);
    const activities: Activity[] = [
      { id: "1", type: "car", amount: 100, timestamp: refTime - 1000 },
      { id: "2", type: "beef", amount: 2, timestamp: oneWeekAndOneHourAgo },
    ];

    const percentages = calculateCategoryPercentages(activities, refTime);
    expect(percentages).toEqual({
      transport: 100,
      food: 0,
      energy: 0,
      shopping: 0,
    });
  });

  it("should handle unknown activity categories gracefully", () => {
    const activities: Activity[] = [
      { id: "1", type: "unknown", amount: 10, timestamp: refTime - 1000 },
    ];

    const percentages = calculateCategoryPercentages(activities, refTime);
    expect(percentages).toEqual({
      transport: 0,
      food: 0,
      energy: 0,
      shopping: 0,
    });
  });
});
