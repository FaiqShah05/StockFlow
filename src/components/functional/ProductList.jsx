import ProductCard from "./ProductCard";

function ProductList({
  products,
  totalProducts,
  hasActiveFilters,
  onDelete,
  onEdit,
  onStockChange,
  onClearFilters,
}) {
  if (totalProducts === 0) {
    return (
      <section className="empty-state" aria-live="polite">
        <span className="empty-icon" aria-hidden="true">📦</span>
        <h2>Your inventory is ready to grow</h2>
        <p>Add your first product using the form to get started.</p>
      </section>
    );
  }

  if (products.length === 0) {
    return (
      <section className="empty-state" aria-live="polite">
        <span className="empty-icon" aria-hidden="true">⌕</span>
        <h2>No matching products</h2>
        <p>Try adjusting your search or filters to find what you need.</p>
        {hasActiveFilters && (
          <button className="button button-primary" onClick={onClearFilters}>
            Clear filters
          </button>
        )}
      </section>
    );
  }

  return (
    <div className="grid">
      {products.map((p) => (
        <ProductCard
          key={p.id}
          product={p}
          onDelete={onDelete}
          onEdit={onEdit}
          onStockChange={onStockChange}
        />
      ))}
    </div>
  );
}
export default ProductList;