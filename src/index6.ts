// enum OrderStatus {
//   Draft = 0,
//   Paid = 1,
//   Shipped = 2,
// }

// const status = OrderStatus.Shipped;

// console.log(status);

enum HttpStatus {
  Ok = 200,
  NotFound = 404,
  ServerError = 500,
}

let status;

// if (status === 200) {
//   console.log("Запрос выполнен успешно");
// }

// if (status === 404) {
//   console.log("Страница не найдена");
// }

// if (status === 500) {
//   console.log("Внутренняя ошибка сервера");
// }

// if (status === HttpStatus.Ok) {
//   console.log("Запрос выполнен успешно");
// }

// if (status === HttpStatus.NotFound) {
//   console.log("Страница не найдена");
// }

// if (status === HttpStatus.ServerError) {
//   console.log("Внутренняя ошибка сервера");
// }

console.log(HttpStatus);
