import React, { Component, ErrorInfo, ReactNode } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles.css";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught application error:", error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0a0a0a",
          color: "#e0e0e0",
          fontFamily: "system-ui, -apple-system, sans-serif",
          padding: "20px",
          textAlign: "center"
        }}>
          <div style={{
            maxWidth: "500px",
            backgroundColor: "#161616",
            border: "1px solid #333",
            borderRadius: "12px",
            padding: "24px",
            boxShadow: "0 8px 30px rgba(0,0,0,0.5)"
          }}>
            <h2 style={{ color: "#ef4444", marginBottom: "12px", fontSize: "1.25rem", fontWeight: "bold" }}>
              Application Encountered an Issue
            </h2>
            <p style={{ color: "#9ca3af", fontSize: "0.875rem", marginBottom: "20px", lineHeight: "1.5" }}>
              Your saved data in Firebase and storage is safe. Click below to refresh the application.
            </p>
            <button
              onClick={this.handleReload}
              style={{
                backgroundColor: "#2563eb",
                color: "#ffffff",
                border: "none",
                borderRadius: "8px",
                padding: "10px 24px",
                fontSize: "0.875rem",
                fontWeight: "bold",
                cursor: "pointer",
                transition: "background-color 0.2s"
              }}
            >
              Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const rootElement = document.getElementById("root")!;
const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
