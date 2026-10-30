import { useState, useRef, useEffect } from "react";
import CardWrapper from "./CardWrapper";

function ProductForm({ categories, onAdd, onUpdate, productToEdit, onCancelEdit }) {
  const [name, setName] = useState(productToEdit?.name ?? "");
  const [category, setCategory] = useState(productToEdit?.category ?? categories[0]);
  const [price, setPrice] = useState(productToEdit ? String(productToEdit.price) : "");
  const [stock, setStock] = useState(productToEdit ? String(productToEdit.stock) : "");
  const [touched, setTouched] = useState({});
  const titleRef = useRef(null);

  useEffect(() => {
    titleRef.current?.focus();
  }, []);

  const errors = {
    name: name.trim() ? "" : "Enter a product title.",
    price:
      price === "" || Number(price) <= 0 || !Number.isFinite(Number(price))
        ? "Enter a price greater than 0."
        : "",
    stock:
      stock === "" || !Number.isInteger(Number(stock)) || Number(stock) < 0
        ? "Enter a whole number of 0 or more."
        : "",
  };
  const isValid = !errors.name && !errors.price && !errors.stock;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isValid) return;

    const product = {
      ...(productToEdit || {}),
      name: name.trim(),
      category,
      price: Number(price),
      stock: Number(stock),
    };

    if (productToEdit) {
      onUpdate(product);
      onCancelEdit();
    } else {
      onAdd({
        ...product,
        id: globalThis.crypto?.randomUUID?.() || `product-${Date.now()}`,
        createdAt: new Date().toISOString(),
      });
      setName("");
      setPrice("");
      setStock("");
      setTouched({});
      titleRef.current?.focus();
    }
  };

  return (
    <CardWrapper title={productToEdit ? "Edit product" : "Add a product"}>
      <form onSubmit={handleSubmit} className="form" noValidate>
        <label htmlFor="product-title">Product title</label>
        <input
          ref={titleRef}
          id="product-title"
          placeholder="e.g. Wireless headphones"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={() => setTouched((current) => ({ ...current, name: true }))}
          aria-invalid={Boolean(touched.name && errors.name)}
          aria-describedby={touched.name && errors.name ? "title-error" : undefined}
        />
        {touched.name && errors.name && (
          <span className="field-error" id="title-error">{errors.name}</span>
        )}

        <label htmlFor="product-category">Category</label>
        <select
          id="product-category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {categories.map((c) => <option key={c}>{c}</option>)}
        </select>

        <label htmlFor="product-price">Price (USD)</label>
        <input
          id="product-price"
          type="number"
          min="0.01"
          step="0.01"
          placeholder="0.00"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          onBlur={() => setTouched((current) => ({ ...current, price: true }))}
          aria-invalid={Boolean(touched.price && errors.price)}
          aria-describedby={touched.price && errors.price ? "price-error" : undefined}
        />
        {touched.price && errors.price && (
          <span className="field-error" id="price-error">{errors.price}</span>
        )}

        <label htmlFor="product-stock">Stock quantity</label>
        <input
          id="product-stock"
          type="number"
          min="0"
          step="1"
          placeholder="0"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          onBlur={() => setTouched((current) => ({ ...current, stock: true }))}
          aria-invalid={Boolean(touched.stock && errors.stock)}
          aria-describedby={touched.stock && errors.stock ? "stock-error" : undefined}
        />
        {touched.stock && errors.stock && (
          <span className="field-error" id="stock-error">{errors.stock}</span>
        )}

        <div className="form-actions">
          <button className="button button-primary" type="submit" disabled={!isValid}>
            {productToEdit ? "Save changes" : "Add product"}
          </button>
          {productToEdit && (
            <button className="button button-quiet" type="button" onClick={onCancelEdit}>
              Cancel
            </button>
          )}
        </div>
      </form>
    </CardWrapper>
  );
}
export default ProductForm;