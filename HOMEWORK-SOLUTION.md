# Решение домашнего задания

## Контрольные вопросы

### 1. Замораживает ли `readonly` объект во время выполнения?

Нет.

`readonly` работает только во время проверки TypeScript-кода. Он запрещает изменять свойство через соответствующий тип, но после компиляции в JavaScript модификатор `readonly` исчезает.

```ts
type User = {
  readonly id: number;
  name: string;
};

const user: User = {
  id: 1,
  name: "Анна",
};

// Ошибка TypeScript
// user.id = 2;
```

Для настоящей заморозки объекта во время выполнения используется `Object.freeze()`:

```ts
const frozenUser = Object.freeze({
  id: 1,
  name: "Анна",
});
```

---

### 2. Почему readonly-свойство с обычным массивом всё ещё позволяет `push`?

В типе:

```ts
type Team = {
  readonly members: string[];
};
```

`readonly` запрещает заменить само свойство `members`:

```ts
const team: Team = {
  members: ["Анна"],
};

// Ошибка TypeScript
// team.members = ["Борис"];
```

Но массив имеет обычный изменяемый тип `string[]`, поэтому его содержимое менять можно:

```ts
team.members.push("Борис");
```

Чтобы запретить изменение массива, нужно добавить `readonly` самому массиву:

```ts
type SafeTeam = {
  readonly members: readonly string[];
};

const safeTeam: SafeTeam = {
  members: ["Анна"],
};

// Ошибка TypeScript
// safeTeam.members.push("Борис");
```

---

### 3. В чём идея структурной типизации?

TypeScript проверяет не название типа и не способ создания объекта, а его структуру.

Если объект содержит все свойства, которые требует тип, он считается совместимым с этим типом.

```ts
type Named = {
  name: string;
};

const employee = {
  id: 1,
  name: "Анна",
  department: "Разработка",
};

function printName(value: Named): void {
  console.log(value.name);
}

printName(employee);
```

Объект `employee` подходит типу `Named`, потому что у него есть обязательное свойство:

```ts
name: string
```

Дополнительные свойства `id` и `department` не мешают.

---

### 4. Почему литерал с лишним полем может вызвать ошибку, а переменная — нет?

Свежий объектный литерал TypeScript проверяет строже.

```ts
type CreateUserInput = {
  name: string;
  email: string;
};

function createUser(input: CreateUserInput): void {
  console.log(input);
}
```

При прямой передаче литерала с лишним свойством возникнет ошибка:

```ts
createUser({
  name: "Анна",
  email: "anna@example.com",

  // Ошибка: свойство role не описано в CreateUserInput
  // role: "admin",
});
```

Но объект можно сначала сохранить в переменную:

```ts
const adminInput = {
  name: "Анна",
  email: "anna@example.com",
  role: "admin",
};

createUser(adminInput);
```

Во втором случае TypeScript применяет обычную структурную совместимость. У объекта есть все обязательные поля `CreateUserInput`, поэтому дополнительное поле не мешает.

---

### 5. Почему `Partial<Customer>` не всегда подходит для команды обновления?

`Partial<Customer>` делает необязательными все свойства клиента:

```ts
type Customer = {
  readonly id: number;
  readonly createdAt: Date;
  name: string;
  email: string;
};

type PartialCustomer = Partial<Customer>;
```

Получается примерно такой тип:

```ts
type PartialCustomer = {
  readonly id?: number;
  readonly createdAt?: Date;
  name?: string;
  email?: string;
};
```

Но команда обновления не должна разрешать изменение `createdAt`. Кроме того, идентификатор клиента обычно должен быть обязательным.

Поэтому лучше создать отдельный тип:

```ts
type UpdateCustomerCommand = {
  id: number;
  name?: string;
  email?: string;
};
```

Он точнее описывает бизнес-смысл операции.

---

# Практическое задание 1. Система управления проектами

## Модель участника

```ts
type ParticipantRole = "owner" | "developer" | "designer" | "tester";

type Participant = {
  readonly id: number;
  readonly createdAt: Date;
  name: string;
  email: string;
  role: ParticipantRole;
};
```

## Модель задачи

```ts
type TaskStatus = "todo" | "inProgress" | "done";
type TaskPriority = "low" | "medium" | "high";

type Task = {
  readonly id: number;
  readonly createdAt: Date;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeId?: number;
};
```

## Пользовательские настройки

```ts
type ProjectSettingName =
  | "emailNotifications"
  | "showCompletedTasks"
  | "compactMode";

type UserSettings = Record<ProjectSettingName, boolean>;
```

Такой тип требует точный набор ключей:

```ts
const userSettings: UserSettings = {
  emailNotifications: true,
  showCompletedTasks: false,
  compactMode: true,
};
```

## Модель проекта

```ts
type Project = {
  readonly id: number;
  readonly createdAt: Date;
  name: string;
  description?: string;
  participants: readonly Participant[];
  tasks: readonly Task[];
  settings: UserSettings;
};
```

## Команда создания проекта

При создании проекта идентификатор и дата могут формироваться системой, поэтому их нет в команде:

```ts
type CreateProjectCommand = {
  name: string;
  description?: string;
  participants?: readonly Participant[];
  settings: UserSettings;
};
```

Функция создания проекта:

```ts
function createProject(
  id: number,
  command: CreateProjectCommand,
): Project {
  return {
    id,
    createdAt: new Date(),
    name: command.name,
    description: command.description,
    participants: command.participants ?? [],
    tasks: [],
    settings: command.settings,
  };
}
```

## Команда обновления проекта

```ts
type UpdateProjectCommand = {
  id: number;
  name?: string;
  description?: string;
  participants?: readonly Participant[];
  tasks?: readonly Task[];
  settings?: Partial<UserSettings>;
};
```

Здесь `Partial<UserSettings>` допустим, потому что при обновлении настроек можно передать только часть известного набора настроек.

## Чистая функция обновления проекта

```ts
function updateProject(
  project: Project,
  command: UpdateProjectCommand,
): Project {
  if (project.id !== command.id) {
    throw new Error("Команда относится к другому проекту");
  }

  return {
    ...project,
    name: command.name ?? project.name,
    description: command.description ?? project.description,
    participants: command.participants ?? project.participants,
    tasks: command.tasks ?? project.tasks,
    settings: {
      ...project.settings,
      ...command.settings,
    },
  };
}
```

Функция не изменяет исходный объект. Она создает и возвращает новый проект.

## Пример использования

```ts
const participant: Participant = {
  id: 1,
  createdAt: new Date(),
  name: "Анна",
  email: "anna@example.com",
  role: "developer",
};

const project = createProject(100, {
  name: "Интернет-магазин",
  description: "Разработка нового магазина",
  participants: [participant],
  settings: {
    emailNotifications: true,
    showCompletedTasks: false,
    compactMode: false,
  },
});

const updatedProject = updateProject(project, {
  id: 100,
  name: "Интернет-магазин 2.0",
  settings: {
    compactMode: true,
  },
});

console.log(project.name);
// Интернет-магазин

console.log(updatedProject.name);
// Интернет-магазин 2.0

console.log(project.settings.compactMode);
// false

console.log(updatedProject.settings.compactMode);
// true
```

Исходный объект `project` не изменился.

---

# Практическое задание 2. Мини-CRM

## Адрес клиента

```ts
type Address = {
  country: string;
  city: string;
  street: string;
  building: string;
  apartment?: string;
};
```

## Дополнительные поля

Дополнительные поля заранее неизвестны, поэтому используется индексная сигнатура со значением `unknown`:

```ts
type CustomerCustomFields = {
  [key: string]: unknown;
};
```

Использование `unknown` безопаснее, чем `any`. Перед работой со значением его тип придется проверить.

## Модель клиента

```ts
type Customer = {
  readonly id: number;
  readonly createdAt: Date;
  name: string;
  email: string;
  phone?: string;
  addresses: readonly Address[];
  customFields: CustomerCustomFields;
};
```

## Команда создания клиента

```ts
type CreateCustomerCommand = {
  name: string;
  email: string;
  phone?: string;
  addresses?: readonly Address[];
  customFields?: CustomerCustomFields;
};
```

Поля `id` и `createdAt` не передаются, потому что их создает система.

## Функция создания клиента

```ts
function createCustomer(
  id: number,
  command: CreateCustomerCommand,
): Customer {
  return {
    id,
    createdAt: new Date(),
    name: command.name,
    email: command.email,
    phone: command.phone,
    addresses: command.addresses ?? [],
    customFields: command.customFields ?? {},
  };
}
```

## Команда обновления клиента

```ts
type UpdateCustomerCommand = {
  id: number;
  name?: string;
  email?: string;
  phone?: string;
  addresses?: readonly Address[];
  customFields?: CustomerCustomFields;
};
```

В команду не включено поле `createdAt`, потому что дату создания изменять нельзя.

## Чистая функция обновления клиента

```ts
function updateCustomer(
  customer: Customer,
  command: UpdateCustomerCommand,
): Customer {
  if (customer.id !== command.id) {
    throw new Error("Команда относится к другому клиенту");
  }

  return {
    ...customer,
    name: command.name ?? customer.name,
    email: command.email ?? customer.email,
    phone: command.phone ?? customer.phone,
    addresses: command.addresses ?? customer.addresses,
    customFields: command.customFields
      ? {
          ...customer.customFields,
          ...command.customFields,
        }
      : customer.customFields,
  };
}
```

## Пример использования

```ts
const customer = createCustomer(1, {
  name: "Анна Иванова",
  email: "anna@example.com",
  phone: "+7 900 000-00-00",
  addresses: [
    {
      country: "Россия",
      city: "Москва",
      street: "Тверская",
      building: "1",
    },
  ],
  customFields: {
    source: "Реклама",
    discount: 10,
    vip: false,
  },
});
```

Обновим email и дополнительное поле:

```ts
const updatedCustomer = updateCustomer(customer, {
  id: 1,
  email: "anna.ivanova@example.com",
  customFields: {
    discount: 15,
    manager: "Борис",
  },
});
```

Проверим результат:

```ts
console.log(customer.email);
// anna@example.com

console.log(updatedCustomer.email);
// anna.ivanova@example.com

console.log(customer.customFields.discount);
// 10

console.log(updatedCustomer.customFields.discount);
// 15
```

Исходный объект `customer` не изменился.

## Работа со значениями `unknown`

```ts
const discount = updatedCustomer.customFields.discount;

if (typeof discount === "number") {
  console.log(discount * 2);
}
```

Без проверки TypeScript не позволит использовать значение `unknown` как число.

---

# Практическое задание 3. Настройки уведомлений

## Точный набор ключей

```ts
type NotificationType =
  | "email"
  | "sms"
  | "push"
  | "telegram";
```

## Тип настроек

```ts
type NotificationSettings = Record<NotificationType, boolean>;
```

Он эквивалентен следующей структуре:

```ts
type NotificationSettings = {
  email: boolean;
  sms: boolean;
  push: boolean;
  telegram: boolean;
};
```

## Корректный объект

```ts
const notificationSettings: NotificationSettings = {
  email: true,
  sms: false,
  push: true,
  telegram: false,
};
```

## Ошибка при отсутствии ключа

```ts
const incompleteSettings: NotificationSettings = {
  email: true,
  sms: false,
  push: true,

  // Ошибка: отсутствует telegram
};
```

Этот пример нужно оставить закомментированным, чтобы проект компилировался:

```ts
/*
const incompleteSettings: NotificationSettings = {
  email: true,
  sms: false,
  push: true,
};
*/
```

## Ошибка при добавлении неизвестного ключа

```ts
const incorrectSettings: NotificationSettings = {
  email: true,
  sms: false,
  push: true,
  telegram: false,

  // Ошибка: ключ whatsapp не входит в NotificationType
  // whatsapp: true,
};
```

`Record` требует все ключи из union-типа и не разрешает неизвестные свойства в свежем объектном литерале.

## Функция обновления настроек

```ts
function updateNotificationSettings(
  settings: NotificationSettings,
  changes: Partial<NotificationSettings>,
): NotificationSettings {
  return {
    ...settings,
    ...changes,
  };
}
```

Пример:

```ts
const updatedNotificationSettings =
  updateNotificationSettings(notificationSettings, {
    sms: true,
    telegram: true,
  });

console.log(updatedNotificationSettings);
```

Результат:

```ts
{
  email: true,
  sms: true,
  push: true,
  telegram: true,
}
```

---

# Дополнительное задание. Структурная типизация

Создадим тип входных данных:

```ts
type CreateEmployeeInput = {
  name: string;
  email: string;
};
```

Функция:

```ts
function createEmployee(input: CreateEmployeeInput): void {
  console.log(`Создан сотрудник: ${input.name}`);
}
```

## Передача объектного литерала

```ts
createEmployee({
  name: "Анна",
  email: "anna@example.com",

  // Ошибка excess property checking
  // department: "Разработка",
});
```

Свежий объектный литерал проверяется строго, поэтому неизвестное свойство `department` вызывает ошибку.

## Передача переменной

```ts
const employeeInput = {
  name: "Анна",
  email: "anna@example.com",
  department: "Разработка",
};

createEmployee(employeeInput);
```

Теперь ошибки нет.

TypeScript проверяет, есть ли у объекта все обязательные свойства типа `CreateEmployeeInput`:

```ts
name: string;
email: string;
```

Они есть, поэтому дополнительное поле `department` не мешает.

## Использование `satisfies`

```ts
const checkedEmployeeInput = {
  name: "Борис",
  email: "boris@example.com",
} satisfies CreateEmployeeInput;
```

Оператор `satisfies` проверяет объект на соответствие контракту, но сохраняет тип, выведенный из самого объекта.

При лишнем свойстве свежий литерал по-прежнему вызовет ошибку:

```ts
const incorrectEmployeeInput = {
  name: "Борис",
  email: "boris@example.com",

  // Ошибка: неизвестное свойство
  // department: "Тестирование",
} satisfies CreateEmployeeInput;
```

---

# Полный код

```ts
type ParticipantRole =
  | "owner"
  | "developer"
  | "designer"
  | "tester";

type Participant = {
  readonly id: number;
  readonly createdAt: Date;
  name: string;
  email: string;
  role: ParticipantRole;
};

type TaskStatus = "todo" | "inProgress" | "done";
type TaskPriority = "low" | "medium" | "high";

type Task = {
  readonly id: number;
  readonly createdAt: Date;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeId?: number;
};

type ProjectSettingName =
  | "emailNotifications"
  | "showCompletedTasks"
  | "compactMode";

type UserSettings = Record<ProjectSettingName, boolean>;

type Project = {
  readonly id: number;
  readonly createdAt: Date;
  name: string;
  description?: string;
  participants: readonly Participant[];
  tasks: readonly Task[];
  settings: UserSettings;
};

type CreateProjectCommand = {
  name: string;
  description?: string;
  participants?: readonly Participant[];
  settings: UserSettings;
};

type UpdateProjectCommand = {
  id: number;
  name?: string;
  description?: string;
  participants?: readonly Participant[];
  tasks?: readonly Task[];
  settings?: Partial<UserSettings>;
};

function createProject(
  id: number,
  command: CreateProjectCommand,
): Project {
  return {
    id,
    createdAt: new Date(),
    name: command.name,
    description: command.description,
    participants: command.participants ?? [],
    tasks: [],
    settings: command.settings,
  };
}

function updateProject(
  project: Project,
  command: UpdateProjectCommand,
): Project {
  if (project.id !== command.id) {
    throw new Error("Команда относится к другому проекту");
  }

  return {
    ...project,
    name: command.name ?? project.name,
    description: command.description ?? project.description,
    participants: command.participants ?? project.participants,
    tasks: command.tasks ?? project.tasks,
    settings: {
      ...project.settings,
      ...command.settings,
    },
  };
}

type Address = {
  country: string;
  city: string;
  street: string;
  building: string;
  apartment?: string;
};

type CustomerCustomFields = {
  [key: string]: unknown;
};

type Customer = {
  readonly id: number;
  readonly createdAt: Date;
  name: string;
  email: string;
  phone?: string;
  addresses: readonly Address[];
  customFields: CustomerCustomFields;
};

type CreateCustomerCommand = {
  name: string;
  email: string;
  phone?: string;
  addresses?: readonly Address[];
  customFields?: CustomerCustomFields;
};

type UpdateCustomerCommand = {
  id: number;
  name?: string;
  email?: string;
  phone?: string;
  addresses?: readonly Address[];
  customFields?: CustomerCustomFields;
};

function createCustomer(
  id: number,
  command: CreateCustomerCommand,
): Customer {
  return {
    id,
    createdAt: new Date(),
    name: command.name,
    email: command.email,
    phone: command.phone,
    addresses: command.addresses ?? [],
    customFields: command.customFields ?? {},
  };
}

function updateCustomer(
  customer: Customer,
  command: UpdateCustomerCommand,
): Customer {
  if (customer.id !== command.id) {
    throw new Error("Команда относится к другому клиенту");
  }

  return {
    ...customer,
    name: command.name ?? customer.name,
    email: command.email ?? customer.email,
    phone: command.phone ?? customer.phone,
    addresses: command.addresses ?? customer.addresses,
    customFields: command.customFields
      ? {
          ...customer.customFields,
          ...command.customFields,
        }
      : customer.customFields,
  };
}

type NotificationType =
  | "email"
  | "sms"
  | "push"
  | "telegram";

type NotificationSettings = Record<
  NotificationType,
  boolean
>;

function updateNotificationSettings(
  settings: NotificationSettings,
  changes: Partial<NotificationSettings>,
): NotificationSettings {
  return {
    ...settings,
    ...changes,
  };
}

const participant: Participant = {
  id: 1,
  createdAt: new Date(),
  name: "Анна",
  email: "anna@example.com",
  role: "developer",
};

const project = createProject(100, {
  name: "Интернет-магазин",
  participants: [participant],
  settings: {
    emailNotifications: true,
    showCompletedTasks: false,
    compactMode: false,
  },
});

const updatedProject = updateProject(project, {
  id: 100,
  name: "Интернет-магазин 2.0",
  settings: {
    compactMode: true,
  },
});

const customer = createCustomer(1, {
  name: "Анна Иванова",
  email: "anna@example.com",
  addresses: [
    {
      country: "Россия",
      city: "Москва",
      street: "Тверская",
      building: "1",
    },
  ],
  customFields: {
    source: "Реклама",
    discount: 10,
  },
});

const updatedCustomer = updateCustomer(customer, {
  id: 1,
  email: "anna.ivanova@example.com",
  customFields: {
    discount: 15,
  },
});

const notificationSettings: NotificationSettings = {
  email: true,
  sms: false,
  push: true,
  telegram: false,
};

const updatedSettings = updateNotificationSettings(
  notificationSettings,
  {
    sms: true,
  },
);

console.log(project);
console.log(updatedProject);
console.log(customer);
console.log(updatedCustomer);
console.log(updatedSettings);
```
