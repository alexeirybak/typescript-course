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

class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

// const error = new ApiError( 404, "Публикация не найдена", );

async function createApiError(response: Response): Promise<ApiError> {
  const text = await response.text();

  let details: unknown;

  if (text !== "") {
    try {
      details = JSON.parse(text);
    } catch {
      details = text;
    }
  }

  return new ApiError(
    response.status,
    `Запрос завершился с HTTP ${response.status}`,
    details,
  );
}

async function ensureSuccess(response: Response): Promise<Response> {
  if (!response.ok) {
    throw await createApiError(response);
  }

  return response;
}

async function request<T>(path: string): Promise<T> {
  const response = await fetch(`${API_URL}${path}`);

  await ensureSuccess(response);

  return response.json() as Promise<T>;
}

async function fetchPost(id: number): Promise<PostDto> {
  return request<PostDto>(`/posts/${id}`);
}

async function fetchUser(id: number): Promise<UserDto> {
  return request<UserDto>(`/users/${id}`);
}

try {
  const post = await fetchPost(1);
  console.log(post);
} catch (error: unknown) {
  if (error instanceof ApiError) {
    console.error(`HTTP-ошибка ${error.status}`, error.details);
  } else if (error instanceof Error) {
    console.error(error.message);
  } else {
    console.error("Неизвестная ошибка", error);
  }
}
