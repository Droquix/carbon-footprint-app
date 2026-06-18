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

  it("should handle JSON parsing errors gracefully when retrieved data is malformed", () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    localStorage.setItem("carbon_footprint_activities", "{invalidjson}");
    expect(getActivities()).toEqual([]);
    expect(errorSpy).toHaveBeenCalled();
    errorSpy.mockRestore();
  });

  it("should handle error when setItem throws during saveActivity", () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const setItemSpy = vi
      .spyOn(Storage.prototype, "setItem")
      .mockImplementation((key) => {
        if (key === "__storage_test__") {
          return;
        }
        throw new Error("Quota exceeded");
      });

    saveActivity(sampleActivity);
    expect(errorSpy).toHaveBeenCalled();

    setItemSpy.mockRestore();
    errorSpy.mockRestore();
  });

  it("should handle error when removeItem throws during clearActivities", () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const removeItemSpy = vi
      .spyOn(Storage.prototype, "removeItem")
      .mockImplementation((key) => {
        if (key === "__storage_test__") {
          return;
        }
        throw new Error("Failed to remove");
      });

    clearActivities();
    expect(errorSpy).toHaveBeenCalled();

    removeItemSpy.mockRestore();
    errorSpy.mockRestore();
  });
});
