// type Identified = {
//   id: number;
// };

// type Timestamped = {
//   createdAt: Date;
//   updatedAt: Date;
// };

// type Article = Identified &
//   Timestamped & {
//     title: string;
//   };

// type Article = {
//   id: number;
//   createdAt: Date;
//   updatedAt: Date;
//   title: string;
// };

// const article: Article = {
//   id: 1,
//   createdAt: new Date(),
//   updatedAt: new Date(),
//   title: "Объектные типы в TypeScript",
// };

// type Product = Identified &
//   Timestamped &
//   SoftDeleted &
//   Publishable &
//   Searchable &
//   Trackable & {
//     title: string;
//     price: number;
//   };

// type NumericId = { id: number };
// type StringId = { id: string };
// type Impossible = NumericId & StringId;

// function printImpossible(value: Impossible): void {
//   console.log(value.id);
// }

// const value: Impossible = {
//   id: 1,
// };

type ApiUser = {
  id: string;
  name: string;
};

type DbRecord = {
  id: number;
  createdAt: Date;
};

// type UserRecord = ApiUser & DbRecord;

type UserRecord = {
  apiId: string;
  databaseId: number;
  name: string;
  createdAt: Date;
};
