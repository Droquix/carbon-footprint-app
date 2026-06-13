import { useFootprint } from "./hooks/useFootprint";
import { useInsights } from "./hooks/useInsights";
import { ActivityForm } from "./components/ActivityForm";
import { InsightsCard } from "./components/InsightsCard";
import { HistoryList } from "./components/HistoryList";
import { ErrorBoundary } from "./components/ErrorBoundary";

function App() {
  const { activities, addActivity, clearAllActivities } = useFootprint();
  const insights = useInsights(activities);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-violet-500/30">
      {/* Premium Header and Nav bar */}
      <header className="border-b border-slate-800/80 bg-slate-900/40 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl" role="img" aria-label="Leaves Logo">
              🌱
            </span>
            <span className="text-lg font-bold bg-gradient-to-r from-violet-400 via-indigo-400 to-emerald-400 bg-clip-text text-transparent">
              Carbon Footprint Tracker
            </span>
          </div>
          <nav className="flex items-center gap-6">
            <a
              href="#dashboard"
              className="text-xs font-semibold text-violet-400 hover:text-violet-300 transition-colors"
            >
              Dashboard
            </a>
            <a
              href="https://github.com/vitejs/vite"
              target="_blank"
              rel="noreferrer"
              className="text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors"
            >
              Docs
            </a>
          </nav>
        </div>
      </header>

      {/* Main Dashboard Layout */}
      <main
        id="dashboard"
        className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8"
      >
        {/* Title and Hero Section */}
        <section className="mb-10 text-center md:text-left">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Track & Reduce Your Carbon Impact
          </h1>
          <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-2xl leading-relaxed">
            Log your daily activities to calculate your greenhouse gas footprint
            and discover tailored actionable steps to reduce your environmental
            impact.
          </p>
        </section>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Side: Logging Form & Insights */}
          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Log form section */}
            <section aria-label="Activity logger">
              <ErrorBoundary fallbackTitle="Activity Logger Unavailable">
                <ActivityForm onLogActivity={addActivity} />
              </ErrorBoundary>
            </section>

            {/* Insights panel section */}
            <section aria-label="Carbon insights">
              <ErrorBoundary fallbackTitle="Insights Panel Unavailable">
                <InsightsCard insights={insights} />
              </ErrorBoundary>
            </section>
          </div>

          {/* Right Side: Log History */}
          <section
            className="lg:col-span-4"
            aria-label="Logged activity history"
          >
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
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center">
        <p className="text-xs text-slate-600 font-medium">
          Powered by IPCC & EPA Greenhouse Gas Sourced Emission Factors.
        </p>
      </footer>
    </div>
  );
}

export default App;
