import { nanoid } from "nanoid";

export const normalizeProducts = (apiProducts) =>
  apiProducts.map((p) => ({
    uiId: nanoid(),
    productId: p.id,
    title: p.title,
    image: p.image?.src || null,

    discount: { type: "percent", value: 0 },
    showVariants: p.variants.length > 1,

    variants: p.variants.map((v) => ({
      uiId: nanoid(),
      variantId: v.id,
      title: v.title,
      price: v.price,
      discount: { type: "percent", value: 0 },
    })),
  }));
