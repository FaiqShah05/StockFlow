const metrics = [
  { key: "products", label: "Total products", icon: "▣", tone: "primary" },
  { key: "units", label: "Total stock units", icon: "▤", tone: "success" },
  { key: "low", label: "Low stock", icon: "!", tone: "warning" },
  { key: "out", label: "Out of stock", icon: "○", tone: "danger" },
];

function InventoryMetrics({ values }) {
  return (
    <section className="metrics-grid" aria-label="Inventory overview">
      {metrics.map((metric) => (
        <article className="metric-card" key={metric.key}>
          <div className={`metric-icon ${metric.tone}`} aria-hidden="true">
            {metric.icon}
          </div>
          <div className="metric-copy">
            <p>{metric.label}</p>
            <strong>{values[metric.key].toLocaleString()}</strong>
          </div>
        </article>
      ))}
    </section>
  );
}

export default InventoryMetrics;
