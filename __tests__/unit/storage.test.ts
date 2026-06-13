import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  saveActivity,
  getActivities,
  clearActivities,
} from "../../src/lib/storage";
import type { Activity } from "../../src/types";

describe("Storage Abstraction", () => {
  const sampleActivity: Activity = {
    id: "act-1",
    type: "car",
    amount: 15,
    timestamp: 1623589800000,
  };

  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it("should return empty array when no activities are stored", () => {
    expect(getActivities()).toEqual([]);
  });

  it("should save and retrieve activities", () => {
    saveActivity(sampleActivity);
    expect(getActivities()).toEqual([sampleActivity]);

    const anotherActivity: Activity = {
      id: "act-2",
      type: "beef",
      amount: 1.5,
      timestamp: 1623590000000,
    };
    saveActivity(anotherActivity);
    expect(getActivities()).toEqual([sampleActivity, anotherActivity]);
  });

  it("should clear activities", () => {
    saveActivity(sampleActivity);
    expect(getActivities()).toHaveLength(1);

    clearActivities();
    expect(getActivities()).toEqual([]);
  });

  it("should handle localStorage being unavailable (private browsing)", () => {
    // Mock localStorage to throw error on setItem/getItem/removeItem
    const setItemSpy = vi
      .spyOn(Storage.prototype, "setItem")
      .mockImplementation(() => {
        throw new Error("QuotaExceededError or SecurityError in private mode");
      });
    const getItemSpy = vi
      .spyOn(Storage.prototype, "getItem")
      .mockImplementation(() => {
        throw new Error("SecurityError");
      });
    const removeItemSpy = vi
      .spyOn(Storage.prototype, "removeItem")
      .mockImplementation(() => {
        throw new Error("SecurityError");
      });

    // Test that functions run without throwing errors and return safe defaults
    expect(() => saveActivity(sampleActivity)).not.toThrow();
    expect(getActivities()).toEqual([]);
    expect(() => clearActivities()).not.toThrow();

    setItemSpy.mockRestore();
    getItemSpy.mockRestore();
    removeItemSpy.mockRestore();
  });
});
