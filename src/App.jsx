import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { ThemeContext } from "./context/ThemeContext";
import useLocalStorage from "./hooks/useLocalStorage";
import AuditLogger from "./components/class/AuditLogger";
import ConfirmDialog from "./components/functional/ConfirmDialog";
import FilterBar from "./components/functional/FilterBar";
import Header from "./components/functional/Header";
import InventoryMetrics from "./components/functional/InventoryMetrics";
import ProductForm from "./components/functional/ProductForm";
import ProductList from "./components/functional/ProductList";
import { getStatus } from "./components/functional/inventoryUtils";

const CATEGORIES = ["Books", "Clothing", "Electronics", "Grocery", "Home"];
const DEMO_PRODUCTS = [
  { id: "demo-headphones", name: "Studio Wireless Headphones", category: "Electronics", price: 129.99, stock: 18, createdAt: "2026-10-16T10:00:00.000Z" },
  { id: "demo-keyboard", name: "Compact Mechanical Keyboard", category: "Electronics", price: 89, stock: 5, createdAt: "2026-10-17T10:00:00.000Z" },
  { id: "demo-webcam", name: "HD Streaming Webcam", category: "Electronics", price: 74.5, stock: 11, createdAt: "2026-10-18T10:00:00.000Z" },
  { id: "demo-notebook", name: "Hardcover Notebook Set", category: "Books", price: 19.95, stock: 32, createdAt: "2026-10-19T10:00:00.000Z" },
  { id: "demo-cookbook", name: "Everyday Kitchen Cookbook", category: "Books", price: 27, stock: 8, createdAt: "2026-10-20T10:00:00.000Z" },
  { id: "demo-paperback", name: "Modern Fiction Paperback", category: "Books", price: 14.99, stock: 0, createdAt: "2026-10-21T10:00:00.000Z" },
  { id: "demo-backpack", name: "Everyday Canvas Backpack", category: "Clothing", price: 64, stock: 7, createdAt: "2026-10-22T10:00:00.000Z" },
  { id: "demo-tshirt", name: "Organic Cotton T-Shirt", category: "Clothing", price: 24, stock: 21, createdAt: "2026-10-23T10:00:00.000Z" },
  { id: "demo-jacket", name: "Lightweight Rain Jacket", category: "Clothing", price: 79, stock: 3, createdAt: "2026-10-24T10:00:00.000Z" },
  { id: "demo-coffee", name: "Single-Origin Coffee Beans", category: "Grocery", price: 16.75, stock: 0, createdAt: "2026-10-25T10:00:00.000Z" },
  { id: "demo-olive-oil", name: "Extra Virgin Olive Oil", category: "Grocery", price: 18.5, stock: 14, createdAt: "2026-10-26T10:00:00.000Z" },
  { id: "demo-granola", name: "Honey Almond Granola", category: "Grocery", price: 8.25, stock: 4, createdAt: "2026-10-27T10:00:00.000Z" },
  { id: "demo-bottle", name: "Insulated Steel Bottle", category: "Home", price: 28.5, stock: 4, createdAt: "2026-10-28T10:00:00.000Z" },
  { id: "demo-lamp", name: "Ceramic Table Lamp", category: "Home", price: 56, stock: 9, createdAt: "2026-10-29T10:00:00.000Z" },
  { id: "demo-towels", name: "Cotton Bath Towel Set", category: "Home", price: 34.99, stock: 16, createdAt: "2026-10-30T10:00:00.000Z" },
];

function createAction(type, message) {
  return { id: globalThis.crypto?.randomUUID?.() || `action-${Date.now()}-${Math.random()}`, type, message };
}

function App() {
  const { theme } = useContext(ThemeContext);
  const [products, setProducts] = useLocalStorage("products", () =>
    DEMO_PRODUCTS.map((product) => ({ ...product }))
  );
  const [lastAction, setLastAction] = useState(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");
  const [sort, setSort] = useState("newest");
  const [productToEdit, setProductToEdit] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);

  useEffect(() => {
    document.title = `Inventory (${products.length} products)`;
  }, [products.length]);

  const categories = useMemo(
    () => [...new Set([...CATEGORIES, ...products.map((product) => product.category)])].sort(),
    [products]
  );

  const metrics = useMemo(
    () => ({
      products: products.length,
      units: products.reduce((sum, product) => sum + Number(product.stock || 0), 0),
      low: products.filter((product) => product.stock > 0 && product.stock <= 5).length,
      out: products.filter((product) => product.stock === 0).length,
    }),
    [products]
  );

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLocaleLowerCase();
    const matches = products.filter((product) => {
      const matchesName = product.name.toLocaleLowerCase().includes(query);
      const matchesCategory = category === "all" || product.category === category;
      const matchesStatus = status === "all" || getStatus(product.stock).cls === status;
      return matchesName && matchesCategory && matchesStatus;
    });

    return matches.sort((first, second) => {
      if (sort === "name") return first.name.localeCompare(second.name);
      if (sort === "price-low") return first.price - second.price;
      if (sort === "price-high") return second.price - first.price;
      if (sort === "stock-low") return first.stock - second.stock;
      const firstDate = Date.parse(first.createdAt) || Number(first.id) || 0;
      const secondDate = Date.parse(second.createdAt) || Number(second.id) || 0;
      return secondDate - firstDate;
    });
  }, [products, search, category, status, sort]);

  const hasActiveFilters = Boolean(search.trim()) || category !== "all" || status !== "all";

  const addProduct = useCallback((product) => {
    setProducts((current) => [...current, product]);
    setLastAction(createAction("added", `Product added: ${product.name}`));
  }, [setProducts]);

  const updateProduct = useCallback((updatedProduct) => {
    setProducts((current) =>
      current.map((product) => product.id === updatedProduct.id ? updatedProduct : product)
    );
    setLastAction(createAction("updated", `Product updated: ${updatedProduct.name}`));
  }, [setProducts]);

  const requestDelete = useCallback((product) => {
    setProductToDelete(product);
  }, []);

  const cancelDelete = useCallback(() => {
    setProductToDelete(null);
  }, []);

  const confirmDelete = useCallback(() => {
    if (!productToDelete) return;
    setProducts((current) => current.filter((product) => product.id !== productToDelete.id));
    setLastAction(createAction("deleted", `Product deleted: ${productToDelete.name}`));
    setProductToDelete(null);
  }, [productToDelete, setProducts]);

  const changeStock = useCallback((id, name, change) => {
    setProducts((current) =>
      current.map((product) =>
        product.id === id
          ? { ...product, stock: Math.max(0, product.stock + change) }
          : product
      )
    );
    setLastAction(createAction("stock", `Stock ${change > 0 ? "increased" : "decreased"}: ${name}`));
  }, [setProducts]);

  const clearFilters = useCallback(() => {
    setSearch("");
    setCategory("all");
    setStatus("all");
    setSort("newest");
  }, []);

  const resetDemo = useCallback(() => {
    setProducts(DEMO_PRODUCTS.map((product) => ({ ...product })));
    setProductToEdit(null);
    clearFilters();
    setLastAction(createAction("updated", "Demo inventory restored"));
  }, [clearFilters, setProducts]);

  const startEdit = useCallback((product) => {
    setProductToEdit(product);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const cancelEdit = useCallback(() => {
    setProductToEdit(null);
  }, []);

  return (
    <div className={`app ${theme}`}>
      <Header totalProducts={products.length} onResetDemo={resetDemo} />
      <main className="dashboard" id="main-content">
        <div className="page-intro">
          <div>
            <p className="eyebrow">OVERVIEW</p>
            <h1>Inventory dashboard</h1>
            <p className="page-description">Keep your products and stock levels in sync.</p>
          </div>
        </div>
        <InventoryMetrics values={metrics} />

        <div className="workspace">
          <aside className="sidebar">
            <ProductForm
              key={productToEdit?.id ?? "new-product-form"}
              categories={categories}
              onAdd={addProduct}
              onUpdate={updateProduct}
              productToEdit={productToEdit}
              onCancelEdit={cancelEdit}
            />
            <AuditLogger action={lastAction} />
          </aside>

          <section className="inventory-section" aria-labelledby="inventory-title">
            <div className="section-heading">
              <div>
                <p className="eyebrow">CATALOG</p>
                <h2 id="inventory-title">Products</h2>
              </div>
            </div>
            <FilterBar
              search={search}
              category={category}
              status={status}
              sort={sort}
              categories={categories}
              visibleCount={filteredProducts.length}
              totalCount={products.length}
              hasActiveFilters={hasActiveFilters}
              onSearchChange={setSearch}
              onCategoryChange={setCategory}
              onStatusChange={setStatus}
              onSortChange={setSort}
              onClearFilters={clearFilters}
            />
            <ProductList
              products={filteredProducts}
              totalProducts={products.length}
              hasActiveFilters={hasActiveFilters}
              onDelete={requestDelete}
              onEdit={startEdit}
              onStockChange={changeStock}
              onClearFilters={clearFilters}
            />
          </section>
        </div>
      </main>
      {productToDelete && (
        <ConfirmDialog
          product={productToDelete}
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}
    </div>
  );
}

export default App;
