import { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
}

interface State {
  hasError: boolean;
}

/**
 * A robust Error Boundary component to catch rendering errors and display a safe fallback UI.
 * This ensures that errors in one section do not crash the entire app and do not expose internal code/stack traces.
 */
export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(_error: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log details internally for debugging, but never display stack details to the user
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="bg-slate-900/50 border border-rose-500/20 rounded-3xl p-6 text-center text-slate-300">
          <span className="text-3xl block mb-2" role="img" aria-label="Warning">
            ⚠️
          </span>
          <h3 className="font-bold text-slate-100 mb-1">
            {this.props.fallbackTitle || "Section Unavailable"}
          </h3>
          <p className="text-xs text-slate-400">
            An unexpected error occurred while loading this section.
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}
