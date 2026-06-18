import type { ActivityTypeSelectorProps } from "../types";
import { MIN_BUTTON_HEIGHT } from "../constants/uiConstants";

/**
 * ActivityTypeSelector sub-component.
 * Renders select dropdown for subcategory activity types.
 */
export function ActivityTypeSelector({
  activityType,
  onChangeActivityType,
  typesOptions,
}: ActivityTypeSelectorProps) {
  return (
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
        onChange={(e) => onChangeActivityType(e.target.value)}
        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200 cursor-pointer"
        style={{ minHeight: MIN_BUTTON_HEIGHT }}
      >
        {typesOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
