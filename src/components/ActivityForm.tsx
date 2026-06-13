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

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nextCat = e.target.value as
      | "transport"
      | "food"
      | "energy"
      | "shopping";
    setCategory(nextCat);
    // Reset type selection based on category
    if (nextCat === "transport") setActivityType("car");
    else if (nextCat === "food") setActivityType("beef");
    else if (nextCat === "energy") setActivityType("electricity");
    else if (nextCat === "shopping") setActivityType("clothing");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const sanitizedAmount = sanitizeNumberInput(amountInput);
    if (sanitizedAmount <= 0) {
      alert("Please enter a valid positive quantity.");
      return;
    }

    // Verify type matches category
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
    <section className="bg-slate-800/60 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-6 shadow-2xl transition-all duration-300 hover:border-violet-500/30">
      <h2 className="text-xl font-bold text-slate-100 mb-6 bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
        Log New Activity
      </h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label
            htmlFor="category-select"
            className="block text-sm font-medium text-slate-300 mb-2"
          >
            Category
          </label>
          <select
            id="category-select"
            value={category}
            onChange={handleCategoryChange}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all duration-200 cursor-pointer"
          >
            <option value="transport">🚗 Transport</option>
            <option value="food">🥗 Food</option>
            <option value="energy">🔌 Energy</option>
            <option value="shopping">🛍️ Shopping</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="type-select"
            className="block text-sm font-medium text-slate-300 mb-2"
          >
            Activity Type
          </label>
          <select
            id="type-select"
            value={activityType}
            onChange={(e) => setActivityType(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all duration-200 cursor-pointer"
          >
            {typesOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="amount-input"
            className="block text-sm font-medium text-slate-300 mb-2"
          >
            Quantity / Amount
          </label>
          <input
            id="amount-input"
            type="number"
            step="any"
            value={amountInput}
            onChange={(e) => setAmountInput(e.target.value)}
            placeholder="e.g. 15.5"
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 placeholder-slate-500 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all duration-200"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold py-3.5 px-4 rounded-xl shadow-lg shadow-violet-500/20 hover:shadow-violet-500/35 active:scale-[0.98] transition-all duration-200 mt-2"
        >
          Log Activity
        </button>
      </form>
    </section>
  );
}
