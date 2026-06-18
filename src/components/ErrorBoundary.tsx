import { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallbackTitle?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

/**
 * A robust Error Boundary component to catch rendering errors and display a safe fallback UI.
 */
// prettier-ignore
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = { hasError: false };

  public static getDerivedStateFromError(_error: Error): ErrorBoundaryState {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="bg-slate-900/50 border border-rose-500/20 rounded-3xl p-6 text-center text-slate-300">
          <span className="text-3xl block mb-2" role="img" aria-label="Warning">⚠️</span>
          <h3 className="font-bold text-slate-100 mb-1">{this.props.fallbackTitle || "Section Unavailable"}</h3>
          <p className="text-xs text-slate-400">An unexpected error occurred while loading this section.</p>
        </div>
      );
    }
    return this.props.children;
  }
}
