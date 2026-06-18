import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ActivityForm } from "../../src/components/ActivityForm";

describe("ActivityForm Component", () => {
  it("renders correctly with default category (Transport) and type (Car)", () => {
    render(<ActivityForm onLogActivity={() => {}} />);
    expect(screen.getByLabelText(/activity type/i)).toHaveValue("car");
    expect(screen.getByText("km")).toBeInTheDocument();
  });

  it("handles category selection UI interactions and updates types and units", async () => {
    render(<ActivityForm onLogActivity={() => {}} />);

    // Select Food category button
    const foodButton = screen.getByRole("button", { name: /food/i });
    await userEvent.click(foodButton);

    expect(screen.getByLabelText(/activity type/i)).toHaveValue("beef");
    expect(screen.getByText("kg")).toBeInTheDocument();

    // Select Energy category button
    const energyButton = screen.getByRole("button", { name: /energy/i });
    await userEvent.click(energyButton);

    expect(screen.getByLabelText(/activity type/i)).toHaveValue("electricity");
    expect(screen.getByText("kWh")).toBeInTheDocument();

    // Change subcategory type to Natural Gas
    const typeSelect = screen.getByLabelText(/activity type/i);
    fireEvent.change(typeSelect, { target: { value: "naturalGas" } });
    expect(screen.getByText("m³")).toBeInTheDocument();

    // Select Shopping category button
    const shoppingButton = screen.getByRole("button", { name: /shopping/i });
    await userEvent.click(shoppingButton);

    expect(screen.getByLabelText(/activity type/i)).toHaveValue("clothing");
    expect(screen.getByText("item(s)")).toBeInTheDocument();
  });

  it("resets type selection to defaults when category is switched", async () => {
    render(<ActivityForm onLogActivity={() => {}} />);

    // Select energy
    const energyButton = screen.getByRole("button", { name: /energy/i });
    await userEvent.click(energyButton);
    expect(screen.getByLabelText(/activity type/i)).toHaveValue("electricity");

    // Select transport again
    const transportButton = screen.getByRole("button", { name: /transport/i });
    await userEvent.click(transportButton);
    expect(screen.getByLabelText(/activity type/i)).toHaveValue("car");
  });

  it("rejects invalid inputs on form submission", async () => {
    const logSpy = vi.fn();
    const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});

    render(<ActivityForm onLogActivity={logSpy} />);

    const amountInput = screen.getByLabelText(/quantity \/ amount/i);
    const submitButton = screen.getByRole("button", { name: /log activity/i });

    // Submit with empty / negative amount
    await userEvent.type(amountInput, "-5");
    await userEvent.click(submitButton);

    expect(alertSpy).toHaveBeenCalledWith(
      "Please enter a valid positive quantity."
    );
    expect(logSpy).not.toHaveBeenCalled();

    // Submit with 0
    await userEvent.clear(amountInput);
    await userEvent.type(amountInput, "0");
    await userEvent.click(submitButton);

    expect(alertSpy).toHaveBeenCalledWith(
      "Please enter a valid positive quantity."
    );
    expect(logSpy).not.toHaveBeenCalled();

    alertSpy.mockRestore();
  });

  it("rejects invalid activity type on form submission", async () => {
    const logSpy = vi.fn();
    const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});

    render(<ActivityForm onLogActivity={logSpy} />);

    const amountInput = screen.getByLabelText(/quantity \/ amount/i);
    const typeSelect = screen.getByLabelText(/activity type/i);
    const submitButton = screen.getByRole("button", { name: /log activity/i });

    // Enter valid amount
    await userEvent.type(amountInput, "10");

    // Force an invalid option value (e.g. bypass validation checks via direct value change)
    fireEvent.change(typeSelect, { target: { value: "invalid-type" } });

    await userEvent.click(submitButton);

    expect(alertSpy).toHaveBeenCalledWith("Invalid activity selection.");
    expect(logSpy).not.toHaveBeenCalled();

    alertSpy.mockRestore();
  });
});
