interface Product {
  id: number;
  title: string;
  price: number;
}

interface Entity {
  id: number;
}

interface Product extends Entity {
  title: string;
  price: number;
}

// interface DigitalProduct extends Product {
//   downloadUrl: string;
//   fileSize: number;
// }

// interface Named {
//   name: string;
// }

// interface Broken extends Named {
//   name: number;
// }

type WithSlug = {
  slug: string;
};

interface Category extends WithSlug {
  title: string;
}
