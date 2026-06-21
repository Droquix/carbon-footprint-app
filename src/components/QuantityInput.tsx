import type { QuantityInputProps } from "../types";
import { MIN_BUTTON_HEIGHT } from "../constants/uiConstants";

/**
 * QuantityInput sub-component.
 * Renders quantity input field with attached unit badge label.
 */
export function QuantityInput({
  amountInput,
  onChangeAmountInput,
  unitLabel,
}: QuantityInputProps) {
  return (
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
          onChange={(event) => onChangeAmountInput(event.target.value)}
          placeholder="e.g. 15.5"
          aria-describedby="unit-badge"
          className="flex-grow bg-slate-950 border border-slate-800 border-r-0 rounded-l-xl px-4 py-3 text-slate-200 placeholder-slate-600 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200"
          style={{ minHeight: MIN_BUTTON_HEIGHT }}
          required
        />
        <span
          id="unit-badge"
          className="inline-flex items-center px-4 rounded-r-xl border border-l-0 border-slate-800 bg-slate-900 text-xs font-bold text-slate-400"
          style={{ minHeight: MIN_BUTTON_HEIGHT }}
        >
          {unitLabel}
        </span>
      </div>
    </div>
  );
}
