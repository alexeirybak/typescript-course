type Order = {
  readonly id: string;
  readonly createdAt: Date;
  userId: number;
  status: "draft" | "paid" | "cancelled";
  items: Array<{
    productId: number;
    quantity: number;
    unitPrice: number;
  }>;
};

type OrderListItem = Pick<Order, "id" | "createdAt" | "status"> & {
  total: number;
};

const orderListItem: OrderListItem = {
  id: "order-1",
  createdAt: new Date(),
  status: "paid",
  total: 6500,
};

type CreateOrderCommand = {
  userId: Order["userId"];
  items: Array<{
    productId: number;
    quantity: number;
  }>;
};

const createCommand: CreateOrderCommand = {
  userId: 15,
  items: [
    {
      productId: 101,
      quantity: 2,
    },
  ],
};

type ChangeOrderStatusCommand = {
  orderId: Order["id"];
  status: Exclude<Order["status"], "draft">;
};

const changeStatusCommand: ChangeOrderStatusCommand = {
  orderId: "order-1",
  status: "paid",
};

// const wrongCommand: ChangeOrderStatusCommand = {
//   orderId: "order-1",
//   status: "draft",
// };
