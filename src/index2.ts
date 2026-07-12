type User = {
  id: number;
  name: string;
};

type Id = string | number;

type Status = "draft" | "published";

type Coordinates = [number, number];

type Handler = (message: string) => void;

type Identified = {
  id: number;
};

type Timestamped = {
  createdAt: Date;
  updatedAt: Date;
};

type Article = Identified &
  Timestamped & {
    title: string;
    status: "draft" | "published";
  };

// type Article = {
//   id: number;
//   createdAt: Date;
//   updatedAt: Date;
//   title: string;
//   status: "draft" | "published";
// };
