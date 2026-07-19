type User = {
  id: number;
  name: string;
  active: boolean;
};

type UserName = User["name"];

const name: UserName = "Алексей";

//type UserIdentity = User["id" | "name"];

type UserIdentity = number | string;

type ApiResponse = {
  users: Array<{
    id: number;
    name: string;
    email: string;
  }>;
};

// type ApiUser = {
//   id: number;
//   name: string;
// };

type ApiUser = ApiResponse["users"][number];
