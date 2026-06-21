import type { QuickStatsProps } from "../types";

/**
 * QuickStats component that renders a summary strip of activity logs.
 *
 * @param props Component properties containing stats.
 * @returns The rendered React element.
 */
export function QuickStats({ stats }: QuickStatsProps) {
  return (
    <div className="grid grid-cols-3 gap-2 bg-slate-950/40 border border-slate-850 rounded-2xl p-4 mb-5">
      <div className="text-center">
        <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">
          Total Logged
        </span>
        <p className="text-sm font-extrabold text-white font-mono">
          {stats.totalLogged}
        </p>
      </div>
      <div className="text-center border-x border-slate-850 px-1">
        <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">
          Most Logged
        </span>
        <p className="text-xs font-bold text-emerald-400 truncate">
          {stats.mostLoggedCategory}
        </p>
      </div>
      <div className="text-center">
        <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">
          Avg CO2 / Act
        </span>
        <p className="text-sm font-extrabold text-white font-mono truncate">
          {stats.avgCO2PerActivity}
        </p>
      </div>
    </div>
  );
}
