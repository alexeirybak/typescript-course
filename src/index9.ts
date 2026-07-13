// // type Order = {
// //   status: "draft" | "paid" | "shipped";
// //   paymentDate?: Date;
// //   trackingNumber?: string;
// // };

// const order: Order = {
//   status: "shipped",
//   paymentDate: new Date(),
//   trackingNumber: "RU123456",
// };

// type Order =
//   | { status: "draft" }
//   | { status: "paid"; paymentDate: Date }
//   | { status: "shipped"; trackingNumber: string };

// function printOrder(order: Order) {
//   switch (order.status) {
//     case "draft":
//       console.log("Черновик");
//       break;

//     case "paid":
//       console.log(order.paymentDate);
//       break;

//     case "shipped":
//       console.log(order.trackingNumber);
//       break;
//   }
// }
