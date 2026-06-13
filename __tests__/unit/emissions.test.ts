import { describe, it, expect } from "vitest";
import {
  calculateTransportEmissions,
  calculateFoodEmissions,
  calculateEnergyEmissions,
  calculateShoppingEmissions,
} from "../../src/lib/emissions";
import type { TransportFactors, FoodFactors } from "../../src/types";

describe("Transport Emissions", () => {
  // 1. Normal valid inputs
  it("calculates emissions for car, bus, flight with normal values", () => {
    // Car: 15.5 km * 0.170 = 2.635
    expect(calculateTransportEmissions("car", 15.5)).toBeCloseTo(2.635);
    // Bus: 8.2 km * 0.096 = 0.7872
    expect(calculateTransportEmissions("bus", 8.2)).toBeCloseTo(0.7872);
    // Flight: 1200.5 km * 0.150 = 180.075
    expect(calculateTransportEmissions("flight", 1200.5)).toBeCloseTo(180.075);
  });

  // 2. Bike is zero
  it("returns zero emissions for bike regardless of distance", () => {
    expect(calculateTransportEmissions("bike", 100)).toBe(0);
    expect(calculateTransportEmissions("bike", 12345.67)).toBe(0);
  });

  // 3. Zero values
  it("returns zero emissions for zero distance", () => {
    expect(calculateTransportEmissions("car", 0)).toBe(0);
  });

  // 4. Negative values
  it("returns zero emissions for negative distance", () => {
    expect(calculateTransportEmissions("car", -15.5)).toBe(0);
  });

  // 5. Missing / undefined / null / NaN inputs
  it("returns zero for invalid numeric inputs (undefined, null, NaN, infinity)", () => {
    expect(
      calculateTransportEmissions("car", undefined as unknown as number)
    ).toBe(0);
    expect(calculateTransportEmissions("car", null as unknown as number)).toBe(
      0
    );
    expect(calculateTransportEmissions("car", NaN)).toBe(0);
    expect(calculateTransportEmissions("car", Infinity)).toBe(0);
  });

  // 6. Boundary values (Large numbers)
  it("handles large boundary distances correctly", () => {
    // 100,000,000 km * 0.170 = 17,000,000
    expect(calculateTransportEmissions("car", 100000000)).toBe(17000000);
  });

  // 7. Invalid type throws
  it("throws error for invalid transport type", () => {
    expect(() =>
      calculateTransportEmissions(
        "spaceship" as unknown as keyof TransportFactors,
        100
      )
    ).toThrowError();
  });
});

describe("Food Emissions", () => {
  // 8. Normal valid inputs
  it("calculates emissions for beef, chicken, vegetables, dairy", () => {
    // Beef: 2.5 kg * 59.6 = 149
    expect(calculateFoodEmissions("beef", 2.5)).toBeCloseTo(149);
    // Chicken: 1.2 kg * 6.1 = 7.32
    expect(calculateFoodEmissions("chicken", 1.2)).toBeCloseTo(7.32);
    // Vegetables: 5.0 kg * 0.4 = 2.0
    expect(calculateFoodEmissions("vegetables", 5.0)).toBeCloseTo(2.0);
    // Dairy: 0.75 kg * 21.2 = 15.9
    expect(calculateFoodEmissions("dairy", 0.75)).toBeCloseTo(15.9);
  });

  // 9. Zero and negative weights
  it("returns zero for zero or negative weights", () => {
    expect(calculateFoodEmissions("beef", 0)).toBe(0);
    expect(calculateFoodEmissions("beef", -1.5)).toBe(0);
  });

  // 10. Missing / invalid types
  it("returns zero for invalid weight inputs and throws for invalid type", () => {
    expect(calculateFoodEmissions("beef", null as unknown as number)).toBe(0);
    expect(calculateFoodEmissions("beef", NaN)).toBe(0);
    expect(() =>
      calculateFoodEmissions("pork" as unknown as keyof FoodFactors, 2)
    ).toThrowError();
  });
});

describe("Energy Emissions", () => {
  // 11. Normal valid inputs
  it("calculates emissions for electricity and natural gas", () => {
    // Electricity: 350 kWh * 0.371 = 129.85
    expect(calculateEnergyEmissions("electricity", 350)).toBeCloseTo(129.85);
    // Natural gas: 80 m³ * 1.93 = 154.4
    expect(calculateEnergyEmissions("naturalGas", 80)).toBeCloseTo(154.4);
  });

  // 12. Zero, negative, invalid numeric values
  it("returns zero for zero, negative, or invalid energy amounts", () => {
    expect(calculateEnergyEmissions("electricity", 0)).toBe(0);
    expect(calculateEnergyEmissions("electricity", -100)).toBe(0);
    expect(
      calculateEnergyEmissions("electricity", undefined as unknown as number)
    ).toBe(0);
    expect(calculateEnergyEmissions("electricity", NaN)).toBe(0);
  });

  // 13. Boundary checks (very small/large values)
  it("handles boundary values correctly", () => {
    // Small value: 0.0001 kWh * 0.371 = 0.0000371
    expect(calculateEnergyEmissions("electricity", 0.0001)).toBeCloseTo(
      0.0000371,
      7
    );
  });
});

describe("Shopping Emissions", () => {
  // 14. Normal valid inputs
  it("calculates emissions for clothing and electronics", () => {
    // Clothing: 4 items * 15.0 = 60
    expect(calculateShoppingEmissions("clothing", 4)).toBeCloseTo(60);
    // Electronics: 2 items * 300.0 = 600
    expect(calculateShoppingEmissions("electronics", 2)).toBeCloseTo(600);
  });

  // 15. Zero, negative, invalid counts
  it("returns zero for zero, negative, or invalid counts", () => {
    expect(calculateShoppingEmissions("clothing", 0)).toBe(0);
    expect(calculateShoppingEmissions("clothing", -2)).toBe(0);
    expect(
      calculateShoppingEmissions("clothing", null as unknown as number)
    ).toBe(0);
    expect(calculateShoppingEmissions("clothing", NaN)).toBe(0);
  });
});
