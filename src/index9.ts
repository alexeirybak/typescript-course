class Product {
  constructor(
    public readonly id: number,
    public title: string,
  ) {}
}

type ProductConstructorArgs = ConstructorParameters<typeof Product>;

type ProductInstance = InstanceType<typeof Product>;
