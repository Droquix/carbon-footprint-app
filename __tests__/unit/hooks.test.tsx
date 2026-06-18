import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useFootprint } from "../../src/hooks/useFootprint";
import { useInsights } from "../../src/hooks/useInsights";
import type { Activity } from "../../src/types";

describe("useFootprint Hook", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it("should initialize with empty activities", () => {
    const { result } = renderHook(() => useFootprint());
    expect(result.current.activities).toEqual([]);
  });

  it("should add and persist activities", () => {
    const { result } = renderHook(() => useFootprint());

    act(() => {
      result.current.addActivity("car", 25);
    });

    expect(result.current.activities).toHaveLength(1);
    expect(result.current.activities[0].type).toBe("car");
    expect(result.current.activities[0].amount).toBe(25);
    expect(result.current.activities[0].timestamp).toBeLessThanOrEqual(
      Date.now()
    );
  });

  it("should clear activities from state and storage", () => {
    const { result } = renderHook(() => useFootprint());

    act(() => {
      result.current.addActivity("beef", 1.5);
    });
    expect(result.current.activities).toHaveLength(1);

    act(() => {
      result.current.clearAllActivities();
    });
    expect(result.current.activities).toEqual([]);
  });
});

describe("useInsights Hook", () => {
  it("returns default values when no activities are provided", () => {
    const { result } = renderHook(() => useInsights([]));
    expect(result.current.totalWeeklyCO2).toBe(0);
    expect(result.current.highestImpactCategory).toBe("none");
    expect(result.current.topRecommendation).toMatch(/log your activities/i);
    expect(result.current.comparisonToIndianAverage.comparisonText).toMatch(
      /no activities logged/i
    );
  });

  it("calculates weekly emissions and category impact, and suggests recommendation", () => {
    const now = Date.now();
    const mockActivities: Activity[] = [
      // 100km * 0.17 = 17 kg CO2e (Transport)
      { id: "1", type: "car", amount: 100, timestamp: now - 1000 },
      // 2kg * 59.6 = 119.2 kg CO2e (Food) -> normalized is 119.2 / 40 = 2.98 (highest normalized impact)
      { id: "2", type: "beef", amount: 2, timestamp: now - 2000 },
      // 200kWh * 0.371 = 74.2 kg CO2e (Energy) -> normalized is 74.2 / 50 = 1.48
      { id: "3", type: "electricity", amount: 200, timestamp: now - 3000 },
    ];

    const { result } = renderHook(() => useInsights(mockActivities));

    // Total: 17 + 119.2 + 74.2 = 210.4 kg CO2e
    expect(result.current.totalWeeklyCO2).toBeCloseTo(210.4);
    expect(result.current.highestImpactCategory).toBe("food");
    expect(result.current.topRecommendation).toMatch(/reduce beef and dairy/i);

    // Annual estimate: 210.4 * 52 = 10940.8 kg
    // Indian average: 1900 kg
    // Diff %: ((10940.8 - 1900) / 1900) * 100 = 475.8% higher
    expect(
      result.current.comparisonToIndianAverage.userAnnualEstimateKg
    ).toBeCloseTo(10940.8);
    expect(
      result.current.comparisonToIndianAverage.differencePercentage
    ).toBeCloseTo(475.83, 1);
    expect(result.current.comparisonToIndianAverage.comparisonText).toMatch(
      /475.8% higher/i
    );
  });

  it("excludes activities older than 7 days from weekly calculations", () => {
    const now = Date.now();
    const tenDaysAgo = now - 10 * 24 * 60 * 60 * 1000;
    const mockActivities: Activity[] = [
      { id: "1", type: "car", amount: 100, timestamp: now - 1000 }, // in weekly scope
      { id: "2", type: "beef", amount: 2, timestamp: tenDaysAgo }, // out of weekly scope
    ];

    const { result } = renderHook(() => useInsights(mockActivities));

    expect(result.current.totalWeeklyCO2).toBeCloseTo(17);
    expect(result.current.highestImpactCategory).toBe("transport");
  });

  it("handles energy emissions as the highest impact category", () => {
    const now = Date.now();
    const mockActivities: Activity[] = [
      { id: "1", type: "electricity", amount: 100, timestamp: now - 1000 },
    ];
    const { result } = renderHook(() => useInsights(mockActivities));
    expect(result.current.highestImpactCategory).toBe("energy");
    expect(result.current.topRecommendation).toMatch(
      /Improve energy efficiency/i
    );
  });

  it("handles shopping emissions as the highest impact category", () => {
    const now = Date.now();
    const mockActivities: Activity[] = [
      { id: "1", type: "clothing", amount: 10, timestamp: now - 1000 },
    ];
    const { result } = renderHook(() => useInsights(mockActivities));
    expect(result.current.highestImpactCategory).toBe("shopping");
    expect(result.current.topRecommendation).toMatch(
      /Opt for second-hand clothing/i
    );
  });

  it("calculates comparison correctly when user matches the Indian average", () => {
    const now = Date.now();
    // Indian average is 1900 kg/year.
    // Over 52 weeks, this is 1900 / 52 = 36.5384615 kg/week.
    // Let's create an activity that yields exactly 1900 / 52 kg CO2.
    // Beef emissions is 59.6 kg CO2 per kg of beef.
    // So amount of beef to consume = (1900 / 52) / 59.6.
    const weeklyTarget = 1900 / 52;
    const beefAmount = weeklyTarget / 59.6;
    const mockActivities: Activity[] = [
      { id: "1", type: "beef", amount: beefAmount, timestamp: now - 1000 },
    ];
    const { result } = renderHook(() => useInsights(mockActivities));
    expect(
      result.current.comparisonToIndianAverage.differencePercentage
    ).toBeCloseTo(0, 5);
    expect(result.current.comparisonToIndianAverage.comparisonText).toMatch(
      /0\.0% lower|0\.0% higher/i
    );
  });
});
