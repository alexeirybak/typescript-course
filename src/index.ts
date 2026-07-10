type UserProfile = {
  id: number;
  name: string;
  avatarUrl?: string;
};

const user: UserProfile = {
  id: 1,
  name: "Анна",
};

function getAvatar(profile: UserProfile): string {
  return profile.avatarUrl ?? "/images/default-avatar.png";
}

console.log(
  getAvatar({
    id: 1,
    name: "Анна",
    avatarUrl: "/avatars/ivan.png",
  }),
);

type OptionalAvatar = {
  avatarUrl?: string;
};

type ExplicitAvatar = {
  avatarUrl: string | undefined;
};

const first: OptionalAvatar = {};

const second: ExplicitAvatar = {
  avatarUrl: undefined,
};

