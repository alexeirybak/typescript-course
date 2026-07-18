// const users = [
//   { id: 1, name: "Alice", active: true },
//   { id: 2, name: "Bob", active: false },
//   { id: 3, name: "Charlie", active: true },
// ];

// function getValue(key: "id"): number[];
// function getValue(key: "name"): string[];
// function getValue(key: "active"): boolean[];

// function getValue(key: string): (string | number | boolean)[] {
//   return users.map((user) => user[key as keyof typeof user]);
// }

// const ids: number[] = getValue("id"); 
// const names: string[] = getValue("name"); 
// const actives: boolean[] = getValue("active"); 

// console.log("=== Коллекция пользователей ===");
// console.log("ID:", ids);
// console.log("Имена:", names);
// console.log("Активны:", actives);

// ============================================
// ГДЕ ПЕРЕГРУЗКИ ДЕЙСТВИТЕЛЬНО НУЖНЫ
// ============================================

// Представьте, что у нас есть API, который возвращает РАЗНЫЕ ТИПЫ
// в зависимости от того, что мы запрашиваем

// function fetchData(endpoint: "/users"): Promise<User[]>;
// function fetchData(endpoint: "/user/:id"): Promise<User>;
// function fetchData(endpoint: "/posts"): Promise<Post[]>;

// async function fetchData(endpoint: string): Promise<unknown> {
//   const response = await fetch(`https://api.example.com${endpoint}`);
//   return response.json();
// }

// // Теперь TypeScript знает ТОЧНЫЙ ТИП!
// const usersData = await fetchData("/users");     // Promise<User[]> ✅
// const userData = await fetchData("/user/1");     // Promise<User> ✅
// const postsData = await fetchData("/posts");     // Promise<Post[]> ✅

// // ❌ БЕЗ ПЕРЕГРУЗОК было бы:
// // const usersData = await fetchData("/users"); // Promise<unknown> 
// // (TypeScript не знает, что там внутри)