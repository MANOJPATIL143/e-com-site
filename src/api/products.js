export async function fetchProducts({ search = "", page = 0 }) {
  const res = await fetch(
    `https://stageapi.monkcommerce.app/task/products/search?search=${search}&page=${page}&limit=10`,
    {
      headers: {
        "x-api-key": "72njgfa948d9aS7gs5",
      },
    }
  );
  return res.json();
}
