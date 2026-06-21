import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../../src/App";

describe("Carbon Footprint App Integration", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  // 1. User logs a transport activity → total CO2 updates correctly
  it("should update total CO2 correctly when a user logs a transport activity", async () => {
    render(<App />);

    // Get inputs
    const categorySelect = screen.getByLabelText(/category/i);
    const typeSelect = screen.getByLabelText(/activity type/i);
    const amountInput = screen.getByLabelText(/quantity \/ amount/i);
    const submitButton = screen.getByRole("button", { name: /log activity/i });

    // Select Transport -> Car
    fireEvent.change(categorySelect, { target: { value: "transport" } });
    fireEvent.change(typeSelect, { target: { value: "car" } });

    // Enter 30 km distance
    await userEvent.type(amountInput, "30");

    // Click Log
    await userEvent.click(submitButton);

    // Verify CO2 updates correctly in insights (30 km * 0.17 = 5.1 kg CO2e)
    expect(screen.getAllByText(/5.10/i).length).toBeGreaterThanOrEqual(2);
    expect(screen.getAllByText("5.10 kg").length).toBeGreaterThan(0);
  });

  // 2. User with highest food emissions sees food-specific recommendation
  it("should display a food-specific recommendation when food has the highest emissions", async () => {
    render(<App />);

    const categorySelect = screen.getByLabelText(/category/i);
    const typeSelect = screen.getByLabelText(/activity type/i);
    const amountInput = screen.getByLabelText(/quantity \/ amount/i);
    const submitButton = screen.getByRole("button", { name: /log activity/i });

    // Log a minor transport activity: 10 km Car (1.7 kg CO2e)
    fireEvent.change(categorySelect, { target: { value: "transport" } });
    fireEvent.change(typeSelect, { target: { value: "car" } });
    await userEvent.type(amountInput, "10");
    await userEvent.click(submitButton);

    // Clear input for the next entry
    await userEvent.clear(amountInput);

    // Log a major food activity: 5 kg Beef (298.0 kg CO2e)
    fireEvent.change(categorySelect, { target: { value: "food" } });
    fireEvent.change(typeSelect, { target: { value: "beef" } });
    await userEvent.type(amountInput, "5");
    await userEvent.click(submitButton);

    // Verify highest impact is Food
    expect(screen.getAllByText("🥗 Food")).toHaveLength(2);

    // Verify food-specific recommendation is shown
    expect(screen.getByText(/Replace beef/i)).toBeInTheDocument();
  });

  // 3. History shows logged entries in reverse chronological order
  it("should render logged entries in history in reverse chronological order", async () => {
    render(<App />);

    const categorySelect = screen.getByLabelText(/category/i);
    const typeSelect = screen.getByLabelText(/activity type/i);
    const amountInput = screen.getByLabelText(/quantity \/ amount/i);
    const submitButton = screen.getByRole("button", { name: /log activity/i });

    // Log first activity: Car trip (Transport)
    fireEvent.change(categorySelect, { target: { value: "transport" } });
    fireEvent.change(typeSelect, { target: { value: "car" } });
    await userEvent.type(amountInput, "20");
    await userEvent.click(submitButton);

    // Clear amount input
    await userEvent.clear(amountInput);

    // Log second activity: Beef (Food)
    fireEvent.change(categorySelect, { target: { value: "food" } });
    fireEvent.change(typeSelect, { target: { value: "beef" } });
    await userEvent.type(amountInput, "2");
    await userEvent.click(submitButton);

    // Retrieve all activity list headers from the history list
    const historyHeadings = screen.getAllByText(/Beef Consumption|Car Trip/i);

    // Verify reverse chronological order (second logged activity must be first in list)
    expect(historyHeadings[0]).toHaveTextContent("Beef Consumption");
    expect(historyHeadings[1]).toHaveTextContent("Car Trip");
  });

  // Clear All verification
  it("should clear the history when Clear All is clicked", async () => {
    render(<App />);

    const amountInput = screen.getByLabelText(/quantity \/ amount/i);
    const submitButton = screen.getByRole("button", { name: /log activity/i });

    await userEvent.type(amountInput, "15");
    await userEvent.click(submitButton);

    expect(screen.getByText("Car Trip")).toBeInTheDocument();

    const clearButton = screen.getByRole("button", {
      name: /clear all activity history/i,
    });
    await userEvent.click(clearButton);

    expect(screen.getByText(/no activities logged yet/i)).toBeInTheDocument();
  });

  // 5. Category breakdown updates when a new activity is logged
  it("should update the category breakdown chart when a new activity is logged", async () => {
    render(<App />);

    expect(screen.getByText("Category Breakdown")).toBeInTheDocument();

    const categorySelect = screen.getByLabelText(/category/i);
    const typeSelect = screen.getByLabelText(/activity type/i);
    const amountInput = screen.getByLabelText(/quantity \/ amount/i);
    const submitButton = screen.getByRole("button", { name: /log activity/i });

    // Log a transport activity: 100 km Car
    fireEvent.change(categorySelect, { target: { value: "transport" } });
    fireEvent.change(typeSelect, { target: { value: "car" } });
    await userEvent.type(amountInput, "100");
    await userEvent.click(submitButton);

    // Verify breakdown displays 100.0% for Transport and 0.0% for other categories
    expect(screen.getByText("100.0%")).toBeInTheDocument();
    expect(screen.getAllByText("0.0%")).toHaveLength(3);
  });

  // 6. Quick stats summary strip updates when a new activity is logged
  it("should update the quick stats summary strip when a new activity is logged", async () => {
    render(<App />);

    // Initially should show N/A and 0
    expect(screen.getByText("0")).toBeInTheDocument();
    expect(screen.getByText("N/A")).toBeInTheDocument();
    expect(screen.getByText("0.00 kg")).toBeInTheDocument();

    const categorySelect = screen.getByLabelText(/category/i);
    const typeSelect = screen.getByLabelText(/activity type/i);
    const amountInput = screen.getByLabelText(/quantity \/ amount/i);
    const submitButton = screen.getByRole("button", { name: /log activity/i });

    // Log Transport: 100 km Car (17 kg CO2e)
    fireEvent.change(categorySelect, { target: { value: "transport" } });
    fireEvent.change(typeSelect, { target: { value: "car" } });
    await userEvent.type(amountInput, "100");
    await userEvent.click(submitButton);

    // Verify Quick Stats has updated to: Total Logged: 1, Most Logged: Transport, Avg CO2: 17.00 kg
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getAllByText("Transport").length).toBeGreaterThan(0);
    expect(screen.getAllByText("17.00 kg").length).toBeGreaterThan(0);
  });
});
