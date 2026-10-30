export function getStatus(stock) {
  if (stock === 0) return { label: "Out of Stock", cls: "out", icon: "○" };
  if (stock <= 5) return { label: "Low Stock", cls: "low", icon: "!" };
  return { label: "In Stock", cls: "in", icon: "✓" };
}
