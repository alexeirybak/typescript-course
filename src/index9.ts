type Resource = "user" | "order";

type Action = "create" | "update" | "delete" | "read";

type Permission = `${Resource}:${Action}`;

type EntityId = string | number;

type DetailRoute = `/products/${EntityId}`;

//const route: DetailRoute = "/products/42";

//const route: DetailRoute = "/products/abc";

//const route: DetailRoute = "/users/42";

const route = window.location.pathname;
