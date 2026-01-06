import { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import ProductRow from "./ProductRow";
import ProductPicker from "./ProductPicker";
import VariantRow from "./VariantRow";
import "../style/AddProducts.css";

export default function AddProducts() {
  const [products, setProducts] = useState([
    {
      id: Date.now(),
      title: "",
      image: null,
      discount: { type: "percent", value: 0 },
      variants: [],        // 👈 empty = initial screen
      showVariants: false,
    },
  ]);

  const [pickerOpen, setPickerOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  const replaceProducts = (newProducts) => {
    setProducts((prev) => [
      ...prev.slice(0, editIndex),
      ...newProducts,
      ...prev.slice(editIndex + 1),
    ]);
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const { source, destination, type } = result;

    if (type === "product") {
      // Reorder products
      const reorderedProducts = Array.from(products);
      const [removed] = reorderedProducts.splice(source.index, 1);
      reorderedProducts.splice(destination.index, 0, removed);
      setProducts(reorderedProducts);
    } else if (type.startsWith("variant-")) {
      // Reorder variants within a product
      const productIndex = parseInt(type.split("-")[1]);
      const product = products[productIndex];
      
      const reorderedVariants = Array.from(product.variants);
      const [removed] = reorderedVariants.splice(source.index, 1);
      reorderedVariants.splice(destination.index, 0, removed);
      
      const updatedProducts = [...products];
      updatedProducts[productIndex] = {
        ...product,
        variants: reorderedVariants,
      };
      setProducts(updatedProducts);
    }
  };

  const updateVariantDiscount = (productIndex, variantIndex, value, type) => {
    const updatedProducts = [...products];
    updatedProducts[productIndex].variants[variantIndex].discount = { value, type };
    setProducts(updatedProducts);
  };

  const removeVariant = (productIndex, variantIndex) => {
    const updatedProducts = [...products];
    updatedProducts[productIndex].variants.splice(variantIndex, 1);
    
    // If no variants left, remove the product or reset to empty state
    if (updatedProducts[productIndex].variants.length === 0) {
      updatedProducts[productIndex] = {
        id: Date.now(),
        title: "",
        image: null,
        discount: { type: "percent", value: 0 },
        variants: [],
        showVariants: false,
      };
    } else {
      // Update showVariants if needed
      updatedProducts[productIndex].showVariants = updatedProducts[productIndex].variants.length > 1;
    }
    
    setProducts(updatedProducts);
  };

  return (
    <div className="container">
      <h3 className="title">Add Products</h3>

      {/* HEADER */}
      <div className="list-header">
        <span>Product</span>
        <span>Discount</span>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="products" type="product">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {/* PRODUCT ROWS */}
              {products.map((product, index) => (
                <Draggable key={product.id} draggableId={`product-${product.id}`} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      style={{
                        ...provided.draggableProps.style,
                        opacity: snapshot.isDragging ? 0.5 : 1,
                      }}
                    >
                      <ProductRow
                        product={product}
                        index={index}
                        products={products}
                        setProducts={setProducts}
                        dragHandleProps={provided.dragHandleProps}
                        onEdit={(i) => {
                          setEditIndex(i);
                          setPickerOpen(true);
                        }}
                        renderVariants={
                          product.variants.length > 0 && (
                            <Droppable droppableId={`variants-${index}`} type={`variant-${index}`}>
                              {(variantProvided) => (
                                <div {...variantProvided.droppableProps} ref={variantProvided.innerRef}>
                                  {product.variants.map((variant, vIndex) => (
                                    <Draggable
                                      key={variant.id}
                                      draggableId={`variant-${product.id}-${variant.id}`}
                                      index={vIndex}
                                    >
                                      {(variantProvided, variantSnapshot) => (
                                        <div
                                          ref={variantProvided.innerRef}
                                          {...variantProvided.draggableProps}
                                          style={{
                                            ...variantProvided.draggableProps.style,
                                            opacity: variantSnapshot.isDragging ? 0.5 : 1,
                                          }}
                                        >
                                          <VariantRow
                                            variant={variant}
                                            dragHandleProps={variantProvided.dragHandleProps}
                                            onChange={(value, type) =>
                                              updateVariantDiscount(index, vIndex, value, type)
                                            }
                                            onRemove={() => removeVariant(index, vIndex)}
                                          />
                                        </div>
                                      )}
                                    </Draggable>
                                  ))}
                                  {variantProvided.placeholder}
                                </div>
                              )}
                            </Droppable>
                          )
                        }
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {/* ADD PRODUCT BUTTON */}
      <button
        className="add-product-btn"
        onClick={() =>
          setProducts((prev) => [
            ...prev,
            {
              id: Date.now(),
              title: "",
              image: null,
              discount: { type: "percent", value: 0 },
              variants: [],
              showVariants: false,
            },
          ])
        }
      >
        Add Product
      </button>

      {/* PRODUCT PICKER */}
      <ProductPicker
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onAdd={replaceProducts}
      />
    </div>
  );
}
