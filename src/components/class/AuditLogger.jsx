import { Component } from "react";

/* oxlint-disable react/no-did-mount-set-state, react/no-did-update-set-state -- Required lifecycle-based log persistence and toast handling. */
const LOG_ICONS = {
  added: "+",
  updated: "↻",
  deleted: "−",
  stock: "↕",
};

class AuditLogger extends Component {
  state = { logs: [], toast: null };
  timer = null;

  componentDidMount() {
    const saved = JSON.parse(localStorage.getItem("auditLogs")) || [];
    this.setState({ logs: Array.isArray(saved) ? saved.slice(0, 50) : [] });
  }

  componentDidUpdate(prevProps, prevState) {
    const action = this.props.action;
    if (action && action !== prevProps.action) {
      const entry = {
        id: action.id,
        type: action.type,
        message: action.message,
        time: new Date().toLocaleString(),
      };
      this.setState((state) => ({
        logs: [entry, ...state.logs].slice(0, 50),
        toast: entry,
      }));
    }

    if (prevState.logs !== this.state.logs) {
      localStorage.setItem("auditLogs", JSON.stringify(this.state.logs));
    }

    if (this.state.toast && this.state.toast.id !== prevState.toast?.id) {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => this.setState({ toast: null }), 3000);
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  clearLogs = () => {
    this.setState({ logs: [] });
    localStorage.setItem("auditLogs", JSON.stringify([]));
  };

  dismissToast = () => {
    clearTimeout(this.timer);
    this.setState({ toast: null });
  };

  render() {
    const { logs, toast } = this.state;
    return (
      <section className="card audit-card" aria-labelledby="audit-title">
        <div className="audit-heading">
          <div>
            <p className="eyebrow">RECENT ACTIVITY</p>
            <h2 className="card-title" id="audit-title">Audit log</h2>
          </div>
          <button
            className="text-button"
            onClick={this.clearLogs}
            disabled={logs.length === 0}
          >
            Clear logs
          </button>
        </div>
        {logs.length === 0 ? (
          <p className="audit-empty">Your inventory activity will appear here.</p>
        ) : (
          <ul className="audit-list">
            {logs.map((log) => (
              <li key={log.id} className="audit-entry">
                <span className={`audit-icon ${log.type || "updated"}`} aria-hidden="true">
                  {LOG_ICONS[log.type] || "•"}
                </span>
                <div className="audit-entry-copy">
                  <span>{log.message}</span>
                  <time>{log.time}</time>
                </div>
              </li>
            ))}
          </ul>
        )}
        {toast && (
          <div className="toast" role="status" aria-live="polite">
            <span className="toast-icon" aria-hidden="true">{LOG_ICONS[toast.type] || "✓"}</span>
            <span>{toast.message}</span>
            <button
              className="toast-dismiss"
              onClick={this.dismissToast}
              aria-label="Dismiss notification"
            >
              ×
            </button>
          </div>
        )}
      </section>
    );
  }
}
export default AuditLogger;