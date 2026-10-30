function FilterBar({
  search,
  category,
  status,
  sort,
  categories,
  visibleCount,
  totalCount,
  hasActiveFilters,
  onSearchChange,
  onCategoryChange,
  onStatusChange,
  onSortChange,
  onClearFilters,
}) {
  return (
    <section className="toolbar" aria-label="Product controls">
      <div className="toolbar-fields">
        <div className="search-field">
          <label className="visually-hidden" htmlFor="product-search">
            Search products
          </label>
          <span className="search-icon" aria-hidden="true">⌕</span>
          <input
            id="product-search"
            type="search"
            placeholder="Search products..."
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
          />
          {search && (
            <button
              className="search-clear"
              onClick={() => onSearchChange("")}
              aria-label="Clear search"
              type="button"
            >
              ×
            </button>
          )}
        </div>
        <div className="filter-field">
          <label className="visually-hidden" htmlFor="category-filter">Category</label>
          <select
            id="category-filter"
            value={category}
            onChange={(event) => onCategoryChange(event.target.value)}
          >
            <option value="all">All categories</option>
            {categories.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </div>
        <div className="filter-field">
          <label className="visually-hidden" htmlFor="status-filter">Stock status</label>
          <select
            id="status-filter"
            value={status}
            onChange={(event) => onStatusChange(event.target.value)}
          >
            <option value="all">All status</option>
            <option value="in">In stock</option>
            <option value="low">Low stock</option>
            <option value="out">Out of stock</option>
          </select>
        </div>
        <div className="filter-field sort-field">
          <label className="visually-hidden" htmlFor="sort-products">Sort products</label>
          <select
            id="sort-products"
            value={sort}
            onChange={(event) => onSortChange(event.target.value)}
          >
            <option value="newest">Newest</option>
            <option value="name">Name A–Z</option>
            <option value="price-low">Price: low to high</option>
            <option value="price-high">Price: high to low</option>
            <option value="stock-low">Stock: low to high</option>
          </select>
        </div>
      </div>
      <div className="toolbar-summary">
        <span>Showing <strong>{visibleCount}</strong> of <strong>{totalCount}</strong> products</span>
        {hasActiveFilters && (
          <button className="text-button" onClick={onClearFilters}>
            Clear filters
          </button>
        )}
      </div>
    </section>
  );
}

export default FilterBar;
