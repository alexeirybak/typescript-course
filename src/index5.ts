type ApiResponse<T> = ApiSuccess<T> | ApiFailure;

type ApiSuccess<T> = {
  status: "success";
  data: T;
};

type ApiFailure = {
  status: "error";
  message: string;
};

// type User = {
//   id: number;
//   name: string;
// };

// const response: ApiResponse<User[]> = {
//   status: "success",
//   data: [
//     {
//       id: 1,
//       name: "Анна",
//     },
//   ],
// };

// response.data[0]?.id;

// type ApiSuccess = {
//   status: "success";
//   data: User[];
// };

type Product = {
  id: number;
  title: string;
  price: number;
};

const response: ApiResponse<Product[]> = {
  status: "success",
  data: [{ id: 1, title: "Ноутбук", price: 50000 }],
};

if (response.status === "success") {
  response.data[0]?.price;
}

interface Repository<T> {
  getAll(): T[];
  save(item: T): void;
}

const userRepo: Repository<{ id: number; name: string }> = {
  getAll() {
    return [{ id: 1, name: "Анна" }];
  },
  save(item) {
    console.log("Сохранено:", item);
  },
};

userRepo.save({ id: 2, name: "Петр" });
const users = userRepo.getAll();

// Promise<T>
// Array<T>
// Map<K, V>
// Set<T>
