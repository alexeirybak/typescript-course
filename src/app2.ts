// async function getPostId(): Promise<number> {
//   return 1;
// }

// const postIdPromise = getPostId();

// // const postId = await postIdPromise;

// const postId = await getPostId();

// console.log(postIdPromise);
// console.log(postId);

// async function getPostId(id: number): Promise<number> {
//   if (!Number.isInteger(id) || id <= 0) {
//     throw new Error("Идентификатор должен быть положительным числом");
//   }

//   return id;
// }

// const postId = await getPostId(-1);

// console.log(postId);

const API_URL = "https://jsonplaceholder.typicode.com";

type PostDto = {
  userId: number;
  id: number;
  title: string;
  body: string;
};

async function fetchPost(id: number): Promise<PostDto> {
  const response = await fetch(`${API_URL}/posts/${id}`);

  if (!response.ok) {
    throw new Error(`Что-то пошло не так`);
  }

  return response.json() as Promise<PostDto>;
}

try {
  const post = await fetchPost(9999);

  console.log(post.title);
} catch (error: unknown) {
  if (error instanceof Error) {
    console.error(error.message);
  } else {
    console.error("Получена неизвестная ошибка", error);
  }
}
