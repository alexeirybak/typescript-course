function createOrder(userId: number, productIds: number[]) {
  return {
    id: crypto.randomUUID(),
    userId,
    productIds,
    status: "draft" as const,
    createdAt: new Date(),
  };
}

type CreateOrderParameters = Parameters<typeof createOrder>;

type CreatedOrder = ReturnType<typeof createOrder>;

const orderArguments: CreateOrderParameters = [15, [101, 102, 103]];
const order = createOrder(...orderArguments);

const savedOrder: CreatedOrder = {
  id: "123e4567-e89b-12d3-a456-426614174000",
  userId: 15,
  productIds: [101, 102],
  status: "draft",
  createdAt: new Date(1755000000000),
};
