import { useEffect, useState } from "react";
import { fetchProducts } from "../api/products";
import "../style/AddProducts.css";

export default function ProductPicker({ open, onClose, onAdd }) {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [hasMore, setHasMore] = useState(true);

  // selected variants
  const [selected, setSelected] = useState({});

  useEffect(() => {
    if (!open) return;
    loadProducts();
  }, [page, search, open]);

  const loadProducts = async () => {
    if (!hasMore) return;
    const data = await fetchProducts({ search, page });
    if (data.length === 0) {
      setHasMore(false);
      return;
    }
    setProducts((prev) => [...prev, ...data]);
  };

  const toggleProduct = (product) => {
    const allVariantKeys = product.variants.map(v => `${product.id}-${v.id}`);
    const allSelected = allVariantKeys.every(key => selected[key]);
    
    setSelected((prev) => {
      const copy = { ...prev };
      if (allSelected) {
        // Deselect all variants
        allVariantKeys.forEach(key => delete copy[key]);
      } else {
        // Select all variants
        allVariantKeys.forEach(key => {
          copy[key] = { product, variant: product.variants.find(v => `${product.id}-${v.id}` === key) };
        });
      }
      return copy;
    });
  };

  const toggleVariant = (product, variant) => {
    const key = `${product.id}-${variant.id}`;
    setSelected((prev) => {
      const copy = { ...prev };
      if (copy[key]) delete copy[key];
      else copy[key] = { product, variant };
      return copy;
    });
  };

  const handleAdd = () => {
    const grouped = {};

    Object.values(selected).forEach(({ product, variant }) => {
      if (!grouped[product.id]) {
        grouped[product.id] = {
          id: product.id,
          title: product.title,
          image: product.image?.src,
          discount: { type: "percent", value: 0 },
          showVariants: false, // Will be set based on variant count
          variants: [],
        };
      }

      grouped[product.id].variants.push({
        ...variant,
        discount: { type: "percent", value: 0 },
      });
    });

    // Set showVariants based on variant count
    Object.values(grouped).forEach(product => {
      product.showVariants = product.variants.length > 1;
    });

    onAdd(Object.values(grouped));
    onClose();
  };

  if (!open) return null;

  return (
    <div className="overlay">
      <div className="picker-modal">
        {/* HEADER */}
        <div className="picker-header">
          <span>Select Products</span>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        {/* SEARCH */}
        <div className="picker-search">
          <input
            placeholder="Search product"
            value={search}
            onChange={(e) => {
              setProducts([]);
              setPage(0);
              setHasMore(true);
              setSearch(e.target.value);
            }}
          />
        </div>

        {/* LIST */}
        <div
          className="picker-list"
          onScroll={(e) => {
            if (
              e.target.scrollTop + e.target.clientHeight >=
              e.target.scrollHeight
            ) {
              setPage((p) => p + 1);
            }
          }}
        >
          {products.map((product) => (
            <div key={product.id} className="picker-product">
              {/* PRODUCT ROW */}
              <label className="picker-product-row">
                <input
                  type="checkbox"
                  checked={product.variants.every(v => selected[`${product.id}-${v.id}`])}
                  onChange={() => toggleProduct(product)}
                />
                <img src={product.image?.src} alt="" className="picker-thumb" />
                <span className="picker-title">{product.title}</span>
              </label>

              {/* VARIANTS */}
              {product.variants.map((variant) => {
                const key = `${product.id}-${variant.id}`;
                return (
                  <label key={variant.id} className="picker-variant-row">
                    <input
                      type="checkbox"
                      checked={!!selected[key]}
                      onChange={() => toggleVariant(product, variant)}
                    />
                    <span>{variant.title}</span>
                    <span className="muted">99 available</span>
                    <span className="price">${variant.price}</span>
                  </label>
                );
              })}
            </div>
          ))}
        </div>

        {/* FOOTER */}
        <div className="picker-footer">
          <span>{Object.keys(selected).length} product selected</span>
          <div>
            <button className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button
              className="btn-primary"
              disabled={Object.keys(selected).length === 0}
              onClick={handleAdd}
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
