import type { CategorySelectorProps } from "../types";

/**
 * CategorySelector sub-component.
 * Renders select buttons for each carbon footprint activity category.
 */
export function CategorySelector({
  category,
  onSelectCategory,
}: CategorySelectorProps) {
  const categories: {
    id: "transport" | "food" | "energy" | "shopping";
    emoji: string;
    label: string;
  }[] = [
    { id: "transport", emoji: "🚗", label: "Transport" },
    { id: "food", emoji: "🥗", label: "Food" },
    { id: "energy", emoji: "🔌", label: "Energy" },
    { id: "shopping", emoji: "🛍️", label: "Shopping" },
  ];

  return (
    <div>
      <span className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
        Select Category
      </span>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => onSelectCategory(cat.id)}
            className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all duration-200 min-h-[76px] ${
              category === cat.id
                ? "bg-emerald-950/20 border-emerald-500 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.15)] scale-[1.03]"
                : "bg-slate-950/40 border-slate-850 hover:border-slate-700 text-slate-400 hover:text-slate-200"
            }`}
          >
            <span className="text-2xl mb-1" role="img" aria-label={cat.label}>
              {cat.emoji}
            </span>
            <span className="text-xs font-semibold">{cat.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
