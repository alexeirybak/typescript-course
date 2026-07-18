type Role = "admin" | "editor" | "viewer";
type Permission = "read" | "write" | "delete";

const permissions = {
  admin: ["read", "write", "delete"],
  editor: ["read", "write"],
  viewer: ["read"],
} as const satisfies Record<Role, readonly Permission[]>;

function hasPermission(role: Role, permission: Permission): boolean {
  const rolePermissions: readonly Permission[] = permissions[role];
  return rolePermissions.includes(permission);
}

console.log(hasPermission("admin", "delete"));
console.log(hasPermission("viewer", "delete"));
