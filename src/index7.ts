interface Entity<TId> {
  id: TId;
}

// interface User extends Entity<string> {
//   name: string;
// }

// interface Product extends Entity<number> {
//   title: string;
// }

class Repository<TEntity extends Entity<TId>, TId = string> {
  private readonly items = new Map<TId, TEntity>();

  save(entity: TEntity): void {
    this.items.set(entity.id, entity);
  }

  findById(id: TId): TEntity | undefined {
    return this.items.get(id);
  }

  findAll(): TEntity[] {
    return [...this.items.values()];
  }
}

type Product = {
  id: number;
  title: string;
};

const products = new Repository<Product, number>();

products.save({
  id: 1,
  title: "Клавиатура",
});

const product = products.findById(1);

console.log(product?.title);

const allProducts = products.findAll();

allProducts.forEach((product) => {
  console.log(product.id);
  console.log(product.title);
});

type User = {
  id: string;
  name: string;
};

const users = new Repository<User>();

users.save({
  id: "user-1",
  name: "Анна",
});

// const user = users.findById("user-1");

Repository<Product, number>
Repository<User, string>

const user = {
  id: "user-1",
  name: "Анна",
};

//products.save(user);