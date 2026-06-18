import { useFootprint } from "./hooks/useFootprint";
import { useInsights } from "./hooks/useInsights";
import { ActivityForm } from "./components/ActivityForm";
import { InsightsCard } from "./components/InsightsCard";
import { HistoryList } from "./components/HistoryList";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { calculateCircumference, calculateStrokeOffset } from "./lib/svgUtils";
import {
  SVG_RADIUS,
  SVG_STROKE_WIDTH,
  MAX_WEEKLY_BUDGET,
} from "./constants/uiConstants";

/**
 * Main application component that coordinates the layout, State hooks,
 * Carbon footprint calculator widget, Insights card display, and Activity log timeline.
 *
 * @returns The rendered React element.
 */
function App() {
  const { activities, addActivity, clearAllActivities } = useFootprint();
  const insights = useInsights(activities);

  // SVG progress ring math
  const maxWeeklyBudget = MAX_WEEKLY_BUDGET; // max weekly budget in kg
  const weeklyEmissions = insights.totalWeeklyCO2;
  const progressPercent = Math.min(
    100,
    (weeklyEmissions / maxWeeklyBudget) * 100
  );
  const radius = SVG_RADIUS;
  const circumference = calculateCircumference(radius); // ~263.89
  const strokeOffset = calculateStrokeOffset(progressPercent, circumference);

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-100">
      {/* Header / Nav */}
      <header className="border-b border-emerald-950/20 bg-slate-950/40 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl" role="img" aria-label="Leaves Logo">
              🌱
            </span>
            <span className="text-lg font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              Carbon footprint
            </span>
          </div>
          <nav className="flex items-center gap-6">
            <a
              href="#dashboard"
              className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              Dashboard
            </a>
            <a
              href="https://github.com/vitejs/vite"
              target="_blank"
              rel="noreferrer"
              aria-label="Docs (opens in a new tab)"
              className="text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors"
            >
              Docs
            </a>
          </nav>
        </div>
      </header>

      {/* Main Container */}
      <main
        id="dashboard"
        className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8"
      >
        {/* Full-width Hero section with circular CO2 gauge */}
        <header className="bg-slate-900/40 border border-emerald-900/10 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 hover:border-emerald-500/10 transition-all duration-300">
          <div className="space-y-3 text-center md:text-left">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">
              Personal Eco Dashboard
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-none">
              Track & Reduce Carbon
            </h1>
            <p className="text-slate-400 text-sm sm:text-base max-w-xl leading-relaxed">
              Log your habits, understand your emissions impact, and get
              personalized actions to lower your carbon footprint.
            </p>
          </div>

          {/* Circular CO2 Gauge / Meter */}
          <div
            className="flex items-center gap-5 bg-slate-950/40 border border-slate-900 rounded-2xl p-4 shadow-inner min-w-[240px] justify-center"
            role="img"
            aria-label="Weekly carbon footprint progress gauge"
          >
            <div className="relative w-24 h-24 flex items-center justify-center">
              <svg
                className="w-full h-full transform -rotate-90"
                aria-hidden="true"
              >
                {/* Track circle */}
                <circle
                  cx="48"
                  cy="48"
                  r={radius}
                  className="stroke-slate-800"
                  strokeWidth={SVG_STROKE_WIDTH}
                  fill="transparent"
                />
                {/* Progress circle */}
                <circle
                  cx="48"
                  cy="48"
                  r={radius}
                  className="stroke-emerald-500 transition-all duration-500"
                  strokeWidth={SVG_STROKE_WIDTH}
                  fill="transparent"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeOffset}
                  strokeLinecap="round"
                />
              </svg>
              {/* Inner Monospace Value */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-base font-extrabold text-white font-mono leading-none">
                  {weeklyEmissions.toFixed(1)}
                </span>
                <span className="text-[10px] text-slate-400 uppercase font-bold leading-none mt-1">
                  kg CO2
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Weekly Total
              </span>
              <p className="text-sm font-bold text-slate-200">
                {weeklyEmissions.toFixed(2)} kg CO2e
              </p>
              <span className="block text-[10px] text-slate-400">
                Budget: {maxWeeklyBudget} kg CO2e
              </span>
            </div>
          </div>
        </header>

        {/* Three-Column Card Layout (stacked on mobile) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {/* Column 1: Log Activity form */}
          <section aria-label="Activity logger" className="h-full">
            <ErrorBoundary fallbackTitle="Activity Logger Unavailable">
              <ActivityForm onLogActivity={addActivity} />
            </ErrorBoundary>
          </section>

          {/* Column 2: Insights panel */}
          <section aria-label="Carbon insights" className="h-full">
            <ErrorBoundary fallbackTitle="Insights Panel Unavailable">
              <InsightsCard insights={insights} />
            </ErrorBoundary>
          </section>

          {/* Column 3: Activity History */}
          <section aria-label="Logged activity history" className="h-full">
            <ErrorBoundary fallbackTitle="History Log Unavailable">
              <HistoryList
                activities={activities}
                onClearActivities={clearAllActivities}
              />
            </ErrorBoundary>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-950 bg-slate-950/40 py-6 text-center">
        <p className="text-xs text-slate-400 font-medium">
          Powered by IPCC & EPA Greenhouse Gas Sourced Emission Factors.
        </p>
      </footer>
    </div>
  );
}

export default App;
