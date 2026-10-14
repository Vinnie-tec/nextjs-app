export default async function Cart() {
  // Simulate server data fetching
  const items = [
    { id: 1, name: "React Mastery Course", price: 49 },
    { id: 2, name: "Next.js Essentials", price: 59 },
  ];

  const total = items.reduce((sum, item) => sum + item.price, 0);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">🛍️ Your Cart</h2>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item.id} className="flex justify-between">
            <span>{item.name}</span>
            <span>${item.price}</span>
          </li>
        ))}
      </ul>
      <hr className="my-4" />
      <p className="font-bold text-lg text-right">Total: ${total}</p>
    </div>
  );
}
