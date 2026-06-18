import type { CategorySelectorProps } from "../types";

/**
 * HiddenCategorySelect sub-component for screen reader accessibility and integration tests.
 *
 * @param props Component properties.
 * @returns The rendered React element.
 */
export function HiddenCategorySelect({
  category,
  onSelectCategory,
}: CategorySelectorProps) {
  return (
    <div className="sr-only">
      <label htmlFor="category-select">Category</label>
      <select
        id="category-select"
        value={category}
        onChange={(e) =>
          onSelectCategory(
            e.target.value as "transport" | "food" | "energy" | "shopping"
          )
        }
      >
        <option value="transport">🚗 Transport</option>
        <option value="food">🥗 Food</option>
        <option value="energy">🔌 Energy</option>
        <option value="shopping">🛍️ Shopping</option>
      </select>
    </div>
  );
}
