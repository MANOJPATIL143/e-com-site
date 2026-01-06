import { useEffect } from "react";

export default function ProductRow({
  product,
  index,
  products,
  setProducts,
  onEdit,
  dragHandleProps,
  renderVariants,
}) {
  const isEmpty = product.variants.length === 0;

  // ✅ Initialize showVariants ONCE if missing
  useEffect(() => {
    if (
      product.variants.length > 0 &&
      typeof product.showVariants === "undefined"
    ) {
      const copy = [...products];
      copy[index].showVariants = true;
      setProducts(copy);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ✅ Decide visibility
  const shouldShowVariants =
    product.variants.length === 1 || product.showVariants === true;

  //   console.log(renderVariants, shouldShowVariants);
  // console.log(products);

  return (
    <div className="product-block">
      {/* PRODUCT ROW */}
      <div className="product-row">
        <div className="left">
          <span {...dragHandleProps} className="drag">
            ⋮⋮
          </span>
          <span className="index">{index + 1}.</span>

          <div className="input-wrapper" onClick={() => onEdit(index)}>
            <input
              className={`product-pill ${isEmpty ? "placeholder" : ""}`}
              value={isEmpty ? "Select Product" : product.title}
              readOnly
            />
            <span className="edit-inside">✎</span>
          </div>
        </div>

        <div className="right">
          {isEmpty ? (
            <button
              className="add-discount-btn"
              onClick={() => onEdit(index)}
              // onClick={() => {
              //   // Add discount logic here, e.g., apply discount or toggle
              //   const copy = [...products];
              //   // Example: toggle discount on/off
              //   if (copy[index].discount.value > 0) {
              //     copy[index].discount.value = 0;
              //   } else {
              //     copy[index].discount.value = 10; // default 10%
              //   }
              //   setProducts(copy);
              // }}
            >
              Add Discount
              {/* {product.discount.value > 0 ? "Remove" : "Add"} Discount */}
            </button> // Empty space for placeholder products
          ) : (
            <>
              <input
                className="discount-input"
                type="number"
                value={product.discount.value}
                onChange={(e) => {
                  const copy = [...products];
                  copy[index].discount.value = +e.target.value;
                  setProducts(copy);
                }}
              />

              <select
                className="discount-select"
                value={product.discount.type}
                onChange={(e) => {
                  const copy = [...products];
                  copy[index].discount.type = e.target.value;
                  setProducts(copy);
                }}
              >
                <option value="percent">% Off</option>
                <option value="flat">Flat</option>
              </select>

              {products.length > 1 && (
                <span
                  className="remove"
                  onClick={() =>
                    setProducts(products.filter((_, i) => i !== index))
                  }
                >
                  ×
                </span>
              )}
            </>
          )}
        </div>
      </div>

      {/* TOGGLE (ONLY WHEN MULTIPLE VARIANTS) */}
      {product.variants.length > 1 && (
        <div
          className="toggle"
          onClick={() => {
            const copy = [...products];
            copy[index].showVariants = !copy[index].showVariants;
            setProducts(copy);
          }}
        >
          {product.showVariants ? "Hide variants ▲" : "Show variants ▼"}
        </div>
      )}

      {/* ✅ VARIANTS */}
      {shouldShowVariants && renderVariants}
    </div>
  );
}
