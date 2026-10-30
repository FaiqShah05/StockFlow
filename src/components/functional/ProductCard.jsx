import { memo } from "react";
import CardWrapper from "./CardWrapper";
import { getStatus } from "./inventoryUtils";

function ProductCard({ product, onDelete, onEdit, onStockChange }) {
  const status = getStatus(product.stock);
  const stockPercent = Math.min((product.stock / 20) * 100, 100);

  return (
    <CardWrapper className="product-card">
      <div className="product-heading">
        <span className="category-chip">{product.category}</span>
        <span className={`status-badge ${status.cls}`}>
          <span aria-hidden="true">{status.icon}</span>
          {status.label}
        </span>
      </div>
      <h3 className="product-name">{product.name}</h3>
      <p className="product-price">
        {Number(product.price).toLocaleString(undefined, {
          style: "currency",
          currency: "USD",
        })}
      </p>
      <div className="stock-summary">
        <div className="stock-label">
          <span>Stock level</span>
          <strong>{product.stock} units</strong>
        </div>
        <div
          className={`stock-track ${status.cls}`}
          role="progressbar"
          aria-label={`${product.name} stock level`}
          aria-valuemin="0"
          aria-valuemax="20"
          aria-valuenow={Math.min(product.stock, 20)}
        >
          <span style={{ width: `${stockPercent}%` }} />
        </div>
      </div>
      {status.cls === "low" && <p className="restock-hint">Restock soon</p>}
      <div className="product-actions">
        <div className="stock-controls" aria-label={`Adjust ${product.name} stock`}>
          <button
            className="button button-quiet stock-button"
              onClick={() => onStockChange(product.id, product.name, -1)}
            disabled={product.stock === 0}
            aria-label={`Decrease ${product.name} stock`}
          >
            −
          </button>
          <span aria-live="polite">{product.stock}</span>
          <button
            className="button button-quiet stock-button"
            onClick={() => onStockChange(product.id, product.name, 1)}
            aria-label={`Increase ${product.name} stock`}
          >
            +
          </button>
        </div>
        <div className="card-buttons">
          <button className="button button-quiet" onClick={() => onEdit(product)}>
            Edit
          </button>
          <button
            className="button button-danger"
            onClick={(event) => onDelete(product, event.currentTarget)}
          >
            Delete
          </button>
        </div>
      </div>
    </CardWrapper>
  );
}
export default memo(ProductCard);