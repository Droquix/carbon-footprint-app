import { describe, it, expect } from "vitest";
import {
  getDefaultTypeForCategory,
  validateActivityInput,
  getTypesOptionsForCategory,
} from "../../src/lib/formUtils";

describe("formUtils", () => {
  describe("getDefaultTypeForCategory", () => {
    it("should return correct default types for valid categories", () => {
      expect(getDefaultTypeForCategory("transport")).toBe("car");
      expect(getDefaultTypeForCategory("food")).toBe("beef");
      expect(getDefaultTypeForCategory("energy")).toBe("electricity");
      expect(getDefaultTypeForCategory("shopping")).toBe("clothing");
    });

    it("should return empty string for invalid category", () => {
      expect(
        getDefaultTypeForCategory("unknown" as unknown as "transport")
      ).toBe("");
    });
  });

  describe("validateActivityInput", () => {
    it("should reject non-positive amounts", () => {
      const res = validateActivityInput("transport", "car", "-5");
      expect(res.isValid).toBe(false);
      expect(res.error).toBe("Please enter a valid positive quantity.");
    });

    it("should validate correct energy category inputs", () => {
      const res = validateActivityInput("energy", "electricity", "100");
      expect(res.isValid).toBe(true);
      expect(res.sanitizedAmount).toBe(100);
    });

    it("should validate correct shopping category inputs", () => {
      const res = validateActivityInput("shopping", "clothing", "2");
      expect(res.isValid).toBe(true);
      expect(res.sanitizedAmount).toBe(2);
    });

    it("should validate correct transport category inputs", () => {
      const res = validateActivityInput("transport", "car", "20");
      expect(res.isValid).toBe(true);
      expect(res.sanitizedAmount).toBe(20);
    });

    it("should validate correct food category inputs", () => {
      const res = validateActivityInput("food", "beef", "1.5");
      expect(res.isValid).toBe(true);
      expect(res.sanitizedAmount).toBe(1.5);
    });

    it("should reject invalid activity types", () => {
      const res = validateActivityInput("transport", "beef", "10");
      expect(res.isValid).toBe(false);
      expect(res.error).toBe("Invalid activity selection.");
    });
  });

  describe("getTypesOptionsForCategory", () => {
    it("should return options for valid categories", () => {
      expect(getTypesOptionsForCategory("transport")).toHaveLength(4);
      expect(getTypesOptionsForCategory("food")).toHaveLength(4);
      expect(getTypesOptionsForCategory("energy")).toHaveLength(2);
      expect(getTypesOptionsForCategory("shopping")).toHaveLength(2);
    });

    it("should return empty array for invalid category", () => {
      expect(
        getTypesOptionsForCategory("unknown" as unknown as "transport")
      ).toEqual([]);
    });
  });
});
