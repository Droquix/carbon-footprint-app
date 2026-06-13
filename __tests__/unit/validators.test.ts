import { describe, it, expect } from "vitest";
import {
  sanitizeNumberInput,
  isValidTransportType,
  isValidFoodType,
  isValidEnergyType,
  isValidShoppingType,
} from "../../src/lib/validators";

describe("Sanitize Number Input", () => {
  it("should parse valid numbers and numeric strings", () => {
    expect(sanitizeNumberInput(42)).toBe(42);
    expect(sanitizeNumberInput("123.45")).toBe(123.45);
    expect(sanitizeNumberInput("  9.99  ")).toBe(9.99);
  });

  it("should return 0 for negative numbers and numeric strings", () => {
    expect(sanitizeNumberInput(-1)).toBe(0);
    expect(sanitizeNumberInput("-10.5")).toBe(0);
  });

  it("should return 0 for empty or whitespace-only inputs", () => {
    expect(sanitizeNumberInput("")).toBe(0);
    expect(sanitizeNumberInput("   ")).toBe(0);
  });

  it("should return 0 for non-numeric or invalid inputs", () => {
    expect(sanitizeNumberInput("abc")).toBe(0);
    expect(sanitizeNumberInput("12a3")).toBe(12); // parseFloat parses prefix
    expect(sanitizeNumberInput("a123")).toBe(0);
    expect(sanitizeNumberInput(null as unknown as string)).toBe(0);
    expect(sanitizeNumberInput(undefined as unknown as string)).toBe(0);
  });
});

describe("Category Key Validators", () => {
  it("should validate transport keys", () => {
    expect(isValidTransportType("car")).toBe(true);
    expect(isValidTransportType("bike")).toBe(true);
    expect(isValidTransportType("train")).toBe(false);
  });

  it("should validate food keys", () => {
    expect(isValidFoodType("beef")).toBe(true);
    expect(isValidFoodType("vegetables")).toBe(true);
    expect(isValidFoodType("pork")).toBe(false);
  });

  it("should validate energy keys", () => {
    expect(isValidEnergyType("electricity")).toBe(true);
    expect(isValidEnergyType("naturalGas")).toBe(true);
    expect(isValidEnergyType("solar")).toBe(false);
  });

  it("should validate shopping keys", () => {
    expect(isValidShoppingType("clothing")).toBe(true);
    expect(isValidShoppingType("electronics")).toBe(true);
    expect(isValidShoppingType("books")).toBe(false);
  });
});
