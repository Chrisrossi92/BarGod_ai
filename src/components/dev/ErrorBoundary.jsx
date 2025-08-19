import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props){ super(props); this.state = { error: null }; }
  static getDerivedStateFromError(error){ return { error }; }
  componentDidCatch(error, info){ console.error("Render error:", error, info); }
  render(){
    if (this.state.error) {
      return (
        <div style={{ padding: 24, color: "#fff", background: "#111", minHeight: "100vh" }}>
          <h2>Something broke in this screen.</h2>
          <pre style={{ whiteSpace: "pre-wrap" }}>{String(this.state.error.stack || this.state.error)}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}
