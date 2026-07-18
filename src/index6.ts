type PaginatedResponse<
  TItem,
  TMeta = {
    page: number;
    total: number;
  },
> = {
  items: TItem[];
  meta: TMeta;
};

type User = {
  id: number;
  name: string;
};

type UserPage = PaginatedResponse<User>;

const userPage: UserPage = {
  items: [
    {
      id: 1,
      name: "Анна",
    },
    {
      id: 2,
      name: "Борис",
    },
  ],
  meta: {
    page: 1,
    total: 2,
  },
};

type CursorMeta = {
  nextCursor: string | null;
};

type CursorUserPage = PaginatedResponse<User, CursorMeta>;

// type CursorUserPage = {
//   items: User[];
//   meta: {
//     nextCursor: string | null;
//   };
// };

const cursorUserPage: CursorUserPage = {
  items: [
    {
      id: 1,
      name: "Анна",
    },
  ],
  meta: {
    nextCursor: "users-page-2",
  },
};

const lastUserPage: CursorUserPage = {
  items: [
    {
      id: 3,
      name: "Мария",
    },
  ],
  meta: {
    nextCursor: null,
  },
};
