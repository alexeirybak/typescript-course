const API_URL = "https://jsonplaceholder.typicode.com";

type PostDto = {
  userId: number;
  id: number;
  title: string;
  body: string;
};

type UserDto = {
  id: number;
  name: string;
  email: string;
};

async function fetchPost(id: number): Promise<PostDto> {
  const response = await fetch(`${API_URL}/posts/${id}`);

  if (!response.ok) {
    throw new Error(`Что-то пошло не так`);
  }

  return response.json();
}

async function fetchUser(id: number): Promise<UserDto> {
  const response = await fetch(`${API_URL}/users/${id}`);

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  return response.json();
}

// const post = await fetchPost(1);
// const user = await fetchUser(post.userId);

// console.log(post.title);
// console.log(user.name);

// const postPromise = fetchPost(1);
// const userPromise = fetchUser(1);

// const post = await postPromise;
// const user = await userPromise;

// const [post, user] = await Promise.all([
//   fetchPost(9999),
//   fetchUser(1),
// ]);

const results = await Promise.allSettled([fetchPost(1), fetchPost(9999)]);

for (const result of results) {
  if (result.status === "fulfilled") {
    console.log(result.value.title);
  } else {
    console.error(result.reason);
  }
}
