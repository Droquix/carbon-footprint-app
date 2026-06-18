import { useState, useMemo } from "react";
import type { ActivityFormProps } from "../types";
import { CategorySelector } from "./CategorySelector";
import { ActivityTypeSelector } from "./ActivityTypeSelector";
import { QuantityInput } from "./QuantityInput";
import { HiddenCategorySelect } from "./HiddenCategorySelect";
import { getUnit } from "../lib/displayUtils";
// prettier-ignore
import { getDefaultTypeForCategory, validateActivityInput, getTypesOptionsForCategory } from "../lib/formUtils";

/**
 * ActivityForm component for logging carbon footprint activities.
 */
// prettier-ignore
export function ActivityForm({ onLogActivity }: ActivityFormProps) {
  const [category, setCategory] = useState<"transport" | "food" | "energy" | "shopping">("transport");
  const [activityType, setActivityType] = useState<string>("car");
  const [amountInput, setAmountInput] = useState<string>("");
  const typesOptions = useMemo(() => getTypesOptionsForCategory(category), [category]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = validateActivityInput(category, activityType, amountInput);
    if (!val.isValid) return alert(val.error);
    onLogActivity(activityType, val.sanitizedAmount);
    setAmountInput("");
  };

  const handleSelectCategory = (cat: typeof category) => {
    setCategory(cat);
    setActivityType(getDefaultTypeForCategory(cat));
  };

  return (
    <section className="bg-slate-900/40 backdrop-blur-xl border border-emerald-900/10 rounded-3xl p-6 shadow-2xl transition-all duration-300 hover:border-emerald-500/20 flex flex-col justify-between h-full">
      <div>
        <h2 className="text-xl font-bold text-slate-100 mb-6 bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent tracking-tight">Log Activity</h2>
        <HiddenCategorySelect category={category} onSelectCategory={handleSelectCategory} />
        <form onSubmit={handleSubmit} className="space-y-6">
          <CategorySelector category={category} onSelectCategory={handleSelectCategory} />
          <ActivityTypeSelector activityType={activityType} onChangeActivityType={setActivityType} typesOptions={typesOptions} />
          <QuantityInput amountInput={amountInput} onChangeAmountInput={setAmountInput} unitLabel={getUnit(activityType)} />
          <button type="submit" className="w-full bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-extrabold py-3.5 px-4 rounded-xl shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/25 active:scale-[0.98] transition-all duration-200 min-h-[48px]">Log Activity</button>
        </form>
      </div>
    </section>
  );
}
