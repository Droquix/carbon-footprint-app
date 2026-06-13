import { useState, useMemo } from "react";
import {
  isValidTransportType,
  isValidFoodType,
  isValidEnergyType,
  isValidShoppingType,
  sanitizeNumberInput,
} from "../lib/validators";

interface ActivityFormProps {
  onLogActivity: (type: string, amount: number) => void;
}

export function ActivityForm({ onLogActivity }: ActivityFormProps) {
  const [category, setCategory] = useState<
    "transport" | "food" | "energy" | "shopping"
  >("transport");
  const [activityType, setActivityType] = useState<string>("car");
  const [amountInput, setAmountInput] = useState<string>("");

  // Get types available under each category
  const typesOptions = useMemo(() => {
    switch (category) {
      case "transport":
        return [
          { value: "car", label: "Car (km)" },
          { value: "bus", label: "Bus (km)" },
          { value: "flight", label: "Flight (km)" },
          { value: "bike", label: "Bike (km) (Zero Carbon)" },
        ];
      case "food":
        return [
          { value: "beef", label: "Beef (kg)" },
          { value: "chicken", label: "Chicken (kg)" },
          { value: "vegetables", label: "Vegetables (kg)" },
          { value: "dairy", label: "Dairy (Cheese) (kg)" },
        ];
      case "energy":
        return [
          { value: "electricity", label: "Electricity (kWh)" },
          { value: "naturalGas", label: "Natural Gas (m³)" },
        ];
      case "shopping":
        return [
          { value: "clothing", label: "Clothing (items)" },
          { value: "electronics", label: "Electronics (laptops)" },
        ];
      default:
        return [];
    }
  }, [category]);

  // Determine current unit label
  const getUnitLabel = () => {
    if (category === "transport") return "km";
    if (category === "food") return "kg";
    if (activityType === "electricity") return "kWh";
    if (activityType === "naturalGas") return "m³";
    return "item(s)";
  };

  const selectCategory = (
    nextCat: "transport" | "food" | "energy" | "shopping"
  ) => {
    setCategory(nextCat);
    if (nextCat === "transport") setActivityType("car");
    else if (nextCat === "food") setActivityType("beef");
    else if (nextCat === "energy") setActivityType("electricity");
    else if (nextCat === "shopping") setActivityType("clothing");
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    selectCategory(
      e.target.value as "transport" | "food" | "energy" | "shopping"
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const sanitizedAmount = sanitizeNumberInput(amountInput);
    if (sanitizedAmount <= 0) {
      alert("Please enter a valid positive quantity.");
      return;
    }

    let isValid = false;
    if (category === "transport" && isValidTransportType(activityType))
      isValid = true;
    else if (category === "food" && isValidFoodType(activityType))
      isValid = true;
    else if (category === "energy" && isValidEnergyType(activityType))
      isValid = true;
    else if (category === "shopping" && isValidShoppingType(activityType))
      isValid = true;

    if (!isValid) {
      alert("Invalid activity selection.");
      return;
    }

    onLogActivity(activityType, sanitizedAmount);
    setAmountInput(""); // Clear amount input
  };

  return (
    <section className="bg-slate-900/40 backdrop-blur-xl border border-emerald-900/10 rounded-3xl p-6 shadow-2xl transition-all duration-300 hover:border-emerald-500/20 flex flex-col justify-between h-full">
      <div>
        <h2 className="text-xl font-bold text-slate-100 mb-6 bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent tracking-tight">
          Log Activity
        </h2>

        {/* Screen Reader Only select element for backwards compatibility and test suites */}
        <div className="sr-only">
          <label htmlFor="category-select">Category</label>
          <select
            id="category-select"
            value={category}
            onChange={handleCategoryChange}
          >
            <option value="transport">🚗 Transport</option>
            <option value="food">🥗 Food</option>
            <option value="energy">🔌 Energy</option>
            <option value="shopping">🛍️ Shopping</option>
          </select>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Card Category Selectors */}
          <div>
            <span className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Select Category
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <button
                type="button"
                onClick={() => selectCategory("transport")}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all duration-200 min-h-[76px] ${
                  category === "transport"
                    ? "bg-emerald-950/20 border-emerald-500 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.15)] scale-[1.03]"
                    : "bg-slate-950/40 border-slate-850 hover:border-slate-700 text-slate-400 hover:text-slate-200"
                }`}
              >
                <span
                  className="text-2xl mb-1"
                  role="img"
                  aria-label="Transport"
                >
                  🚗
                </span>
                <span className="text-xs font-semibold">Transport</span>
              </button>

              <button
                type="button"
                onClick={() => selectCategory("food")}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all duration-200 min-h-[76px] ${
                  category === "food"
                    ? "bg-emerald-950/20 border-emerald-500 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.15)] scale-[1.03]"
                    : "bg-slate-950/40 border-slate-850 hover:border-slate-700 text-slate-400 hover:text-slate-200"
                }`}
              >
                <span className="text-2xl mb-1" role="img" aria-label="Food">
                  🥗
                </span>
                <span className="text-xs font-semibold">Food</span>
              </button>

              <button
                type="button"
                onClick={() => selectCategory("energy")}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all duration-200 min-h-[76px] ${
                  category === "energy"
                    ? "bg-emerald-950/20 border-emerald-500 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.15)] scale-[1.03]"
                    : "bg-slate-950/40 border-slate-850 hover:border-slate-700 text-slate-400 hover:text-slate-200"
                }`}
              >
                <span className="text-2xl mb-1" role="img" aria-label="Energy">
                  🔌
                </span>
                <span className="text-xs font-semibold">Energy</span>
              </button>

              <button
                type="button"
                onClick={() => selectCategory("shopping")}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all duration-200 min-h-[76px] ${
                  category === "shopping"
                    ? "bg-emerald-950/20 border-emerald-500 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.15)] scale-[1.03]"
                    : "bg-slate-950/40 border-slate-850 hover:border-slate-700 text-slate-400 hover:text-slate-200"
                }`}
              >
                <span
                  className="text-2xl mb-1"
                  role="img"
                  aria-label="Shopping"
                >
                  🛍️
                </span>
                <span className="text-xs font-semibold">Shopping</span>
              </button>
            </div>
          </div>

          {/* Activity Type Selector */}
          <div>
            <label
              htmlFor="type-select"
              className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2"
            >
              Activity Type
            </label>
            <select
              id="type-select"
              value={activityType}
              onChange={(e) => setActivityType(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200 cursor-pointer min-h-[44px]"
            >
              {typesOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Input Quantity with attached unit badge */}
          <div>
            <label
              htmlFor="amount-input"
              className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2"
            >
              Quantity / Amount
            </label>
            <div className="relative flex items-stretch w-full">
              <input
                id="amount-input"
                type="number"
                step="any"
                value={amountInput}
                onChange={(e) => setAmountInput(e.target.value)}
                placeholder="e.g. 15.5"
                className="flex-grow bg-slate-950 border border-slate-800 border-r-0 rounded-l-xl px-4 py-3 text-slate-200 placeholder-slate-600 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200 min-h-[44px]"
                required
              />
              <span className="inline-flex items-center px-4 rounded-r-xl border border-l-0 border-slate-800 bg-slate-900 text-xs font-bold text-slate-400 min-h-[44px]">
                {getUnitLabel()}
              </span>
            </div>
          </div>

          {/* CTA Log Activity Button */}
          <button
            type="submit"
            className="w-full bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-extrabold py-3.5 px-4 rounded-xl shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/25 active:scale-[0.98] transition-all duration-200 min-h-[48px]"
          >
            Log Activity
          </button>
        </form>
      </div>
    </section>
  );
}
