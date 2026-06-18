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
 * This ensures that errors in one section do not crash the entire app and do not expose internal code/stack traces.
 */
export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  public state: ErrorBoundaryState = {
    hasError: false,
  };

  /**
   * Derives state from a thrown rendering error, setting hasError to true.
   *
   * @param _error The error that was thrown.
   * @returns The updated State object.
   */
  public static getDerivedStateFromError(_error: Error): ErrorBoundaryState {
    return { hasError: true };
  }

  /**
   * Catches errors thrown by children components and logs them for debugging.
   *
   * @param error The error that was thrown.
   * @param errorInfo Metadata containing the component stack trace.
   * @returns void
   */
  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log details internally for debugging, but never display stack details to the user
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  /**
   * Renders the children components or a fallback UI if an error occurred.
   *
   * @returns The ReactNode to be rendered.
   */
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
