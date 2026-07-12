enum OrderStatus {
  Draft = 0,
  Paid = 1,
  Shipped = 2,
}

enum UserRole {
  Admin = "admin",
  Editor = "editor",
  Viewer = "viewer",
}

// const role = UserRole.Admin;

// console.log(role);

function canDelete(role: UserRole): boolean {
  return role === UserRole.Admin;
}

console.log(canDelete(UserRole.Admin));
console.log(canDelete(UserRole.Editor));
