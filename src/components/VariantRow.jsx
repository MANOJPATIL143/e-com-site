export default function VariantRow({ variant, dragHandleProps, onChange, onRemove }) {
  // console.log("variant render", variant);
  
  return (
    <div className="variant-row">
      <span {...dragHandleProps} className="drag">⋮⋮</span>
      <span className="variant-pill">{variant.title}</span>

      <div className="right">
        <input
          className="discount-input"
          type="number"
          value={variant.discount.value}
          onChange={(e) =>
            onChange(+e.target.value, variant.discount.type)
          }
        />

        <select
          className="discount-select"
          value={variant.discount.type}
          onChange={(e) =>
            onChange(variant.discount.value, e.target.value)
          }
        >
          <option value="percent">% Off</option>
          <option value="flat">Flat</option>
        </select>

        <span className="remove" onClick={onRemove}>
          ×
        </span>
      </div>
    </div>
  );
}
