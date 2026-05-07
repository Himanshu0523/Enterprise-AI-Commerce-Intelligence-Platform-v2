import { Component } from "react";

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: "40px",
          maxWidth: "800px",
          margin: "40px auto",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}>
          <div style={{
            background: "#FEF2F2",
            border: "1px solid #FECACA",
            borderRadius: "12px",
            padding: "24px",
          }}>
            <h2 style={{ color: "#DC2626", margin: "0 0 12px 0", fontSize: "20px" }}>
              ⚠️ Something went wrong
            </h2>
            <p style={{ color: "#7F1D1D", margin: "0 0 16px 0" }}>
              {this.state.error?.message || "An unexpected error occurred"}
            </p>
            <details style={{ color: "#991B1B" }}>
              <summary style={{ cursor: "pointer", fontWeight: "600" }}>
                Error Details
              </summary>
              <pre style={{
                marginTop: "8px",
                padding: "12px",
                background: "#FFF",
                borderRadius: "8px",
                overflow: "auto",
                fontSize: "12px",
                lineHeight: "1.5",
              }}>
                {this.state.error?.stack}
              </pre>
            </details>
            <button
              onClick={() => window.location.reload()}
              style={{
                marginTop: "16px",
                padding: "8px 20px",
                background: "#DC2626",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "600",
              }}
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
