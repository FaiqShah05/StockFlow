import { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";

function Header({ totalProducts, onResetDemo }) {
  const { theme, toggleTheme } = useContext(ThemeContext);
  return (
    <header className="header">
      <a className="brand" href="#main-content" aria-label="Inventory dashboard home">
        <span className="brand-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M4 7.5 12 3l8 4.5v9L12 21l-8-4.5v-9Z" />
            <path d="m4.5 7.8 7.5 4.3 7.5-4.3M12 12v8.5M8 5.3l8 4.6" />
          </svg>
        </span>
        <span className="brand-copy">
          <span className="brand-name">Stockwise</span>
          <span className="brand-caption">Inventory management</span>
        </span>
      </a>
      <div className="header-actions">
        <span className="product-count">{totalProducts} products</span>
        <button className="button button-quiet reset-button" onClick={onResetDemo}>
          Reset demo data
        </button>
        <button
          className="button button-quiet theme-button"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
          title={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
        >
        {theme === "light" ? "🌙 Dark" : "☀️ Light"}
        </button>
      </div>
    </header>
  );
}
export default Header;