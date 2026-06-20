import type { CategoryBreakdownProps } from "../types";
import {
  COLOR_TRANSPORT,
  COLOR_FOOD,
  COLOR_ENERGY,
  COLOR_SHOPPING,
} from "../constants/uiConstants";

/**
 * CategoryBreakdown component to render a horizontal bar chart showing category percentages.
 */
// prettier-ignore
export function CategoryBreakdown({ percentages }: CategoryBreakdownProps) {
  const categoriesList = [
    { key: "transport", label: "Transport", color: COLOR_TRANSPORT, percentage: percentages.transport, icon: "🚗" },
    { key: "food", label: "Food", color: COLOR_FOOD, percentage: percentages.food, icon: "🥗" },
    { key: "energy", label: "Energy", color: COLOR_ENERGY, percentage: percentages.energy, icon: "🔌" },
    { key: "shopping", label: "Shopping", color: COLOR_SHOPPING, percentage: percentages.shopping, icon: "🛍️" },
  ];

  return (
    <section aria-label="Emissions breakdown" className="bg-slate-900/40 backdrop-blur-xl border border-emerald-900/10 rounded-3xl p-6 shadow-2xl transition-all duration-300 hover:border-emerald-500/20">
      <h2 className="text-xl font-bold text-slate-100 mb-6 bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent tracking-tight">Category Breakdown</h2>
      <ul className="space-y-4">
        {categoriesList.map((cat) => (
          <li key={cat.key} className="space-y-1">
            <div className="flex justify-between items-center text-xs font-semibold">
              <span className="text-slate-300 flex items-center gap-1.5"><span aria-hidden="true">{cat.icon}</span> {cat.label}</span>
              <span className="text-slate-400 font-mono">{cat.percentage.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-slate-950/60 rounded-full h-3 overflow-hidden border border-slate-900">
              <div className={`h-full ${cat.color} rounded-full transition-all duration-500`} style={{ width: `${cat.percentage}%` }} role="img" aria-label={`${cat.label}: ${cat.percentage.toFixed(0)}% of weekly emissions`} />
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
