import { describe, it, expect, vi } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { InsightsCard } from "../../src/components/InsightsCard";
import type { InsightsResult } from "../../src/hooks/useInsights";

describe("InsightsCard Component", () => {
  const baseInsights: InsightsResult = {
    totalWeeklyCO2: 0,
    highestImpactCategory: "none",
    topRecommendation:
      "Log your activities to receive personalized carbon reduction recommendations.",
    recommendation: {
      headline: "Log First Activity",
      saving: "0.0 kg",
      action:
        "Log your activities to receive personalized carbon reduction recommendations.",
    },
    comparisonToIndianAverage: {
      userAnnualEstimateKg: 0,
      indianAverageAnnualKg: 1900,
      differencePercentage: -100,
      comparisonText: "No activities logged this week.",
    },
  };

  it("renders correctly with default/empty insights", () => {
    render(<InsightsCard insights={baseInsights} />);
    expect(screen.getByText("Weekly Insights")).toBeInTheDocument();
    expect(
      screen.getByText("No activities logged this week.")
    ).toBeInTheDocument();
    expect(screen.getByText("Log First Activity")).toBeInTheDocument();
    expect(screen.getByText("~0.0 kg CO2e")).toBeInTheDocument();
  });

  describe("Countup animation", () => {
    it("completes countup animation and clears timer", () => {
      vi.useFakeTimers();
      const insights: InsightsResult = {
        ...baseInsights,
        totalWeeklyCO2: 10,
      };
      render(<InsightsCard insights={insights} />);

      // Advance timers by COUNTUP_DURATION_MS (800ms) plus a bit extra
      act(() => {
        vi.advanceTimersByTime(1000);
      });

      expect(screen.getByText(/10\.00/i)).toBeInTheDocument();
      vi.useRealTimers();
    });
  });

  describe("Percentage of average boundaries", () => {
    const indianWeeklyAverageKg = 36.54;

    it("evaluates Below Average correctly when percentage is just under 85%", () => {
      // 84.99% of 36.54 = 31.054346
      const insights: InsightsResult = {
        ...baseInsights,
        totalWeeklyCO2: indianWeeklyAverageKg * 0.8499,
      };
      render(<InsightsCard insights={insights} />);
      expect(screen.getByText("Below Average")).toBeInTheDocument();
    });

    it("evaluates Near Average correctly when percentage is exactly 85%", () => {
      const insights: InsightsResult = {
        ...baseInsights,
        totalWeeklyCO2: indianWeeklyAverageKg * 0.85,
      };
      render(<InsightsCard insights={insights} />);
      expect(screen.getByText("Near Average")).toBeInTheDocument();
    });

    it("evaluates Near Average correctly when percentage is exactly 115%", () => {
      const insights: InsightsResult = {
        ...baseInsights,
        totalWeeklyCO2: indianWeeklyAverageKg * 1.15,
      };
      render(<InsightsCard insights={insights} />);
      expect(screen.getByText("Near Average")).toBeInTheDocument();
    });

    it("evaluates Above Average correctly when percentage is just over 115%", () => {
      // 115.01% of 36.54 = 42.024654
      const insights: InsightsResult = {
        ...baseInsights,
        totalWeeklyCO2: indianWeeklyAverageKg * 1.1501,
      };
      render(<InsightsCard insights={insights} />);
      expect(screen.getByText("Above Average")).toBeInTheDocument();
    });
  });

  describe("Recommendation cards and details for each category", () => {
    it("renders transport recommendation details correctly", () => {
      const insights: InsightsResult = {
        ...baseInsights,
        totalWeeklyCO2: 10,
        highestImpactCategory: "transport",
        topRecommendation: "Consider using public transit...",
        recommendation: {
          headline: "Commute Green",
          saving: "15.0 kg",
          action: "Consider using public transit...",
        },
      };
      render(<InsightsCard insights={insights} />);
      expect(screen.getByText("Commute Green")).toBeInTheDocument();
      expect(screen.getByText("~15.0 kg CO2e")).toBeInTheDocument();
      expect(
        screen.getByText("Consider using public transit...")
      ).toBeInTheDocument();
    });

    it("renders food recommendation details correctly", () => {
      const insights: InsightsResult = {
        ...baseInsights,
        totalWeeklyCO2: 10,
        highestImpactCategory: "food",
        topRecommendation: "Reduce beef and dairy consumption...",
        recommendation: {
          headline: "Plant-Based Eating",
          saving: "53.5 kg",
          action: "Reduce beef and dairy consumption...",
        },
      };
      render(<InsightsCard insights={insights} />);
      expect(screen.getByText("Plant-Based Eating")).toBeInTheDocument();
      expect(screen.getByText("~53.5 kg CO2e")).toBeInTheDocument();
      expect(
        screen.getByText("Reduce beef and dairy consumption...")
      ).toBeInTheDocument();
    });

    it("renders energy recommendation details correctly", () => {
      const insights: InsightsResult = {
        ...baseInsights,
        totalWeeklyCO2: 10,
        highestImpactCategory: "energy",
        topRecommendation: "Improve energy efficiency...",
        recommendation: {
          headline: "Efficient Power",
          saving: "5.0 kg",
          action: "Improve energy efficiency...",
        },
      };
      render(<InsightsCard insights={insights} />);
      expect(screen.getByText("Efficient Power")).toBeInTheDocument();
      expect(screen.getByText("~5.0 kg CO2e")).toBeInTheDocument();
      expect(
        screen.getByText("Improve energy efficiency...")
      ).toBeInTheDocument();
    });

    it("renders shopping recommendation details correctly", () => {
      const insights: InsightsResult = {
        ...baseInsights,
        totalWeeklyCO2: 10,
        highestImpactCategory: "shopping",
        topRecommendation: "Opt for second-hand clothing...",
        recommendation: {
          headline: "Extend Device Lifespans",
          saving: "300.0 kg",
          action: "Opt for second-hand clothing...",
        },
      };
      render(<InsightsCard insights={insights} />);
      expect(screen.getByText("Extend Device Lifespans")).toBeInTheDocument();
      expect(screen.getByText("~300.0 kg CO2e")).toBeInTheDocument();
      expect(
        screen.getByText("Opt for second-hand clothing...")
      ).toBeInTheDocument();
    });
  });
});
