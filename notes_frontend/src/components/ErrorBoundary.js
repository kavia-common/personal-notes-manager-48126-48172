import React from "react";

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error: error ? String(error) : "Unknown error" };
  }

  componentDidCatch(error, info) {
    // Could log to an error reporting service
    // eslint-disable-next-line no-console
    console.error("ErrorBoundary caught:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div role="alert" style={{ padding: 24 }}>
          <h2>Something went wrong.</h2>
          <p style={{ color: "#EF4444" }}>{this.state.error}</p>
          <button
            onClick={() => window.location.reload()}
            style={{
              background: "#2563EB",
              color: "white",
              border: 0,
              padding: "10px 14px",
              borderRadius: 8,
              cursor: "pointer",
            }}
          >
            Reload
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
