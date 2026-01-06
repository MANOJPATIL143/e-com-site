import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import ProductRow from "./ProductRow";
import "../style/AddProducts.css";

export default function ProductList({ products, setProducts, onEdit }) {
  const onDragEnd = (result) => {
    if (!result.destination) return;

    if (result.type === "PRODUCT") {
      const items = [...products];
      const [moved] = items.splice(result.source.index, 1);
      items.splice(result.destination.index, 0, moved);
      setProducts(items);
    }

    if (result.type === "VARIANT") {
      const productIndex = products.findIndex(
        (p) => `variants-${p.uiId}` === result.source.droppableId
      );
      if (productIndex === -1) return;

      const variants = [...products[productIndex].variants];
      const [moved] = variants.splice(result.source.index, 1);
      variants.splice(result.destination.index, 0, moved);

      const copy = [...products];
      copy[productIndex].variants = variants;
      setProducts(copy);
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="products" type="PRODUCT">
        {(p) => (
          <div ref={p.innerRef} {...p.droppableProps} className="product-list">
            {products.map((product, index) => (
              <Draggable
                key={product.uiId}
                draggableId={product.uiId}
                index={index}
              >
                {(d) => (
                  <div ref={d.innerRef} {...d.draggableProps}>
                    <ProductRow
                      product={product}
                      index={index}
                      products={products}
                      setProducts={setProducts}
                      onEdit={onEdit}
                      dragHandleProps={d.dragHandleProps}
                      renderVariants={
                        <Droppable
                          droppableId={`variants-${product.uiId}`}
                          type="VARIANT"
                        >
                          {(v) => (
                            <div ref={v.innerRef} {...v.droppableProps}>
                              {product.variants.map((variant, vi) => (
                                <Draggable
                                  key={variant.uiId}
                                  draggableId={variant.uiId}
                                  index={vi}
                                >
                                  {(vd) => (
                                    <div
                                      ref={vd.innerRef}
                                      {...vd.draggableProps}
                                      className="variant-row"
                                    >
                                      <span
                                        {...vd.dragHandleProps}
                                        className="drag"
                                      >
                                        ⋮⋮
                                      </span>

                                      <span className="variant-pill">
                                        {variant.title}
                                      </span>

                                      <div className="right">
                                        <input
                                          className="discount-input"
                                          type="number"
                                          value={variant.discount.value}
                                          onChange={(e) => {
                                            const copy = [...products];
                                            copy[index].variants[
                                              vi
                                            ].discount.value = +e.target.value;
                                            setProducts(copy);
                                          }}
                                        />

                                        <select
                                          className="discount-select"
                                          value={variant.discount.type}
                                          onChange={(e) => {
                                            const copy = [...products];
                                            copy[index].variants[
                                              vi
                                            ].discount.type = e.target.value;
                                            setProducts(copy);
                                          }}
                                        >
                                          <option value="percent">% Off</option>
                                          <option value="flat">Flat</option>
                                        </select>
                                      </div>
                                    </div>
                                  )}
                                </Draggable>
                              ))}
                              {v.placeholder}
                            </div>
                          )}
                        </Droppable>
                      }
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {p.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}
