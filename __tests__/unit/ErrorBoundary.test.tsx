import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ErrorBoundary } from "../../src/components/ErrorBoundary";

// A dummy component that throws an error when the shouldThrow prop is set to true
function ThrowingComponent({ shouldThrow }: { shouldThrow: boolean }) {
  if (shouldThrow) {
    throw new Error("Test render error");
  }
  return <div>No Error</div>;
}

describe("ErrorBoundary Component", () => {
  it("renders children when no error is thrown", () => {
    render(
      <ErrorBoundary>
        <ThrowingComponent shouldThrow={false} />
      </ErrorBoundary>
    );
    expect(screen.getByText("No Error")).toBeInTheDocument();
  });

  it("catches errors and renders fallback UI", () => {
    // Mock console.error to keep the test output clean
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    render(
      <ErrorBoundary fallbackTitle="Custom Fallback Title">
        <ThrowingComponent shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText("Custom Fallback Title")).toBeInTheDocument();
    expect(
      screen.getByText(/An unexpected error occurred/i)
    ).toBeInTheDocument();

    consoleSpy.mockRestore();
  });
});
