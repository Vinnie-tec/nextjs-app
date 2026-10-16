"use client";

import { Component } from "react";

// ErrorBoundary is a React class component used to catch JavaScript errors
// in its child component tree and display a fallback UI instead of crashing the entire app.
export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    // Initialize state to track whether an error has occurred and store the error object
    this.state = { hasError: false, error: null };
  }

  // This lifecycle method is called when a child component throws an error.
  // It updates the state so that the next render shows the fallback UI.
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  // This lifecycle method is called after an error has been thrown by a child component.
  // It is useful for logging error information to an external service or the console.
  componentDidCatch(error, errorInfo) {
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
  }

  // Render method determines what the UI should display
  render() {
    // If an error occurred, render a fallback UI
    if (this.state.hasError) {
      return (
        <div className="p-6 text-center text-red-600">
          <h2 className="text-xl font-bold mb-2">Something went wrong.</h2>
          {/* Display the error message if available, otherwise show "Unknown error" */}
          <p>{this.state.error?.message || "Unknown error"}</p>
        </div>
      );
    }

    // If no error, render the child components normally
    return this.props.children;
  }
}