console.log(typeof 42);

const defaultConfig = {
  locale: "ru",
  pageSize: 20,
  theme: "dark",
  features: {
    recommendations: true,
  },
};

// type Config = {
//   locale: string;
//   pageSize: number;
//   features: {
//     recommendations: boolean;
//   };
// };

type Config = typeof defaultConfig;

const roles = ["admin", "editor", "viewer"] as const;

typeof roles;

type Role = (typeof roles)[number];

const role: Role = "admin";
//const role2: Role = "manager";