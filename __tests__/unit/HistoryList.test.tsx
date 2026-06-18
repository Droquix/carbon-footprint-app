import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { HistoryList } from "../../src/components/HistoryList";
import type { Activity } from "../../src/types";

describe("HistoryList Component", () => {
  it("renders empty history state correctly", () => {
    render(<HistoryList activities={[]} onClearActivities={() => {}} />);
    expect(screen.getByText(/no activities logged yet/i)).toBeInTheDocument();
  });

  it("renders activity labels, units, and impact ratings correctly for various types", () => {
    const mockActivities: Activity[] = [
      { id: "1", type: "car", amount: 10, timestamp: Date.now() - 1000 },
      { id: "2", type: "bus", amount: 15, timestamp: Date.now() - 2000 },
      { id: "3", type: "flight", amount: 100, timestamp: Date.now() - 3000 },
      { id: "4", type: "bike", amount: 5, timestamp: Date.now() - 4000 },
      { id: "5", type: "beef", amount: 1, timestamp: Date.now() - 5000 },
      { id: "6", type: "chicken", amount: 2, timestamp: Date.now() - 6000 },
      { id: "7", type: "vegetables", amount: 3, timestamp: Date.now() - 7000 },
      { id: "8", type: "dairy", amount: 4, timestamp: Date.now() - 8000 },
      {
        id: "9",
        type: "electricity",
        amount: 50,
        timestamp: Date.now() - 9000,
      },
      {
        id: "10",
        type: "naturalGas",
        amount: 20,
        timestamp: Date.now() - 10000,
      },
      { id: "11", type: "clothing", amount: 2, timestamp: Date.now() - 11000 },
      {
        id: "12",
        type: "electronics",
        amount: 1,
        timestamp: Date.now() - 12000,
      },
      {
        id: "13",
        type: "unknown-type",
        amount: 5,
        timestamp: Date.now() - 13000,
      },
    ];

    render(
      <HistoryList activities={mockActivities} onClearActivities={() => {}} />
    );

    // Verify labels
    expect(screen.getByText("Car Trip")).toBeInTheDocument();
    expect(screen.getByText("Bus Ride")).toBeInTheDocument();
    expect(screen.getByText("Flight")).toBeInTheDocument();
    expect(screen.getByText("Bicycle")).toBeInTheDocument();
    expect(screen.getByText("Beef Consumption")).toBeInTheDocument();
    expect(screen.getByText("Poultry Consumption")).toBeInTheDocument();
    expect(screen.getByText("Vegetables Consumption")).toBeInTheDocument();
    expect(screen.getByText("Dairy/Cheese Consumption")).toBeInTheDocument();
    expect(screen.getByText("Electricity Usage")).toBeInTheDocument();
    expect(screen.getByText("Natural Gas Usage")).toBeInTheDocument();
    expect(screen.getByText("Clothing Purchase")).toBeInTheDocument();
    expect(screen.getByText("Electronics Purchase")).toBeInTheDocument();
    expect(screen.getByText("unknown-type")).toBeInTheDocument();

    // Verify units/amounts (using anchored regex to ignore spacing differences and prevent substring collision)
    expect(screen.getByText(/^\s*10\s+km/i)).toBeInTheDocument();
    expect(screen.getByText(/^\s*15\s+km/i)).toBeInTheDocument();
    expect(screen.getByText(/^\s*100\s+km/i)).toBeInTheDocument();
    expect(screen.getByText(/^\s*5\s+km/i)).toBeInTheDocument();
    expect(screen.getByText(/^\s*1\s+kg/i)).toBeInTheDocument();
    expect(screen.getByText(/^\s*50\s+kWh/i)).toBeInTheDocument();
    expect(screen.getByText(/^\s*20\s+m³/i)).toBeInTheDocument();
    expect(screen.getByText(/^\s*2\s+item\(s\)/i)).toBeInTheDocument();
  });

  it("assigns correct impact ratings based on CO2 thresholds", () => {
    const mockActivities: Activity[] = [
      // Low impact: 5km bike = 0 kg CO2 (< 5)
      { id: "1", type: "bike", amount: 5, timestamp: Date.now() - 1000 },
      // Medium impact: 100km car = 17 kg CO2 (5 <= 17 <= 30)
      { id: "2", type: "car", amount: 100, timestamp: Date.now() - 2000 },
      // High impact: 1000km flight = 245 kg CO2 (> 30)
      { id: "3", type: "flight", amount: 1000, timestamp: Date.now() - 3000 },
    ];

    render(
      <HistoryList activities={mockActivities} onClearActivities={() => {}} />
    );

    expect(screen.getByText(/Low Impact/i)).toBeInTheDocument();
    expect(screen.getByText(/Medium Impact/i)).toBeInTheDocument();
    expect(screen.getByText(/High Impact/i)).toBeInTheDocument();
  });
});
