// enum UserRole {
//   Admin = "admin",
//   Editor = "editor",
//   Viewer = "viewer",
// }

// type UserRole = "admin" | "editor" | "viewer";

function canDelete(role: UserRole): boolean {
  return role === "admin";
}

console.log(canDelete("admin"));
console.log(canDelete("editor"));

// const role1: UserRole = "admin";
const role2: UserRole = "editor";

const UserRole = {
  Admin: "admin",
  Editor: "editor",
  Viewer: "viewer",
} as const;

type UserRole = (typeof UserRole)[keyof typeof UserRole];

// type UserRole = "admin" | "editor" | "viewer";

function canEdit(role: UserRole): boolean {
  return role === UserRole.Admin || role === UserRole.Editor;
}

console.log(canEdit(UserRole.Admin));
console.log(canEdit(UserRole.Viewer));
