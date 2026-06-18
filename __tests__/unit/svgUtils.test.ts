import { describe, it, expect } from "vitest";
import {
  calculateCircumference,
  calculateStrokeOffset,
} from "../../src/lib/svgUtils";

describe("svgUtils", () => {
  describe("calculateCircumference", () => {
    it("should calculate correct circumference for a given radius", () => {
      const radius = 10;
      expect(calculateCircumference(radius)).toBeCloseTo(2 * Math.PI * radius);
    });
  });

  describe("calculateStrokeOffset", () => {
    it("should calculate correct stroke offset for a progress percent", () => {
      const circumference = 100;
      expect(calculateStrokeOffset(0, circumference)).toBe(100);
      expect(calculateStrokeOffset(50, circumference)).toBe(50);
      expect(calculateStrokeOffset(100, circumference)).toBe(0);
    });
  });
});
