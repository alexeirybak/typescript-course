# Решение домашнего задания

Ниже приведено готовое решение домашнего задания по уроку 9.

# Домашнее задание. Решение

## Контрольные вопросы

### 1. Чем модификатор `private` в TypeScript отличается от приватного поля `#private` в JavaScript?

Модификатор `private` относится к системе типов TypeScript.

```ts
class User {
  private password: string;

  constructor(password: string) {
    this.password = password;
  }
}
```

TypeScript запрещает обращаться к полю извне:

```ts
const user = new User("123456");

// Ошибка TypeScript:
// console.log(user.password);
```

Но после компиляции обычное поле JavaScript продолжает существовать в объекте. Ограничение проверяется преимущественно во время компиляции.

Поле с символом `#` является настоящим приватным полем JavaScript:

```ts
class User {
  #password: string;

  constructor(password: string) {
    this.#password = password;
  }
}
```

Обратиться к нему извне нельзя даже во время выполнения:

```ts
const user = new User("123456");

// Синтаксическая ошибка:
// console.log(user.#password);
```

Основное различие:

* `private` — ограничение системы типов TypeScript;
* `#private` — механизм приватности самого JavaScript.

---

### 2. Что создают parameter properties при использовании модификаторов в параметрах конструктора?

Parameter properties позволяют одновременно:

1. объявить параметр конструктора;
2. создать свойство класса;
3. присвоить свойству переданное значение.

Например:

```ts
class Product {
  constructor(
    public readonly id: number,
    private price: number,
  ) {}
}
```

Эта запись приблизительно эквивалентна следующему коду:

```ts
class Product {
  public readonly id: number;
  private price: number;

  constructor(id: number, price: number) {
    this.id = id;
    this.price = price;
  }
}
```

Parameter properties уменьшают количество повторяющегося кода.

---

### 3. В каких случаях getter уместнее обычного метода?

Getter подходит, когда значение воспринимается как свойство объекта.

Например:

```ts
class Rectangle {
  constructor(
    private width: number,
    private height: number,
  ) {}

  get area(): number {
    return this.width * this.height;
  }
}

const rectangle = new Rectangle(10, 5);

console.log(rectangle.area);
```

Площадь выглядит как характеристика прямоугольника, поэтому getter здесь уместен.

Обычный метод лучше использовать, когда выполняется действие:

```ts
account.withdraw(1000);
order.cancel();
task.complete();
```

Такой код яснее показывает, что состояние объекта может измениться.

Практическое правило:

* характеристика или вычисляемое значение — getter;
* действие или бизнес-операция — метод.

---

### 4. Чем интерфейс отличается от абстрактного класса?

Интерфейс описывает контракт объекта:

```ts
interface Repository<T> {
  save(entity: T): void;
  findAll(): T[];
}
```

Он не содержит состояния экземпляра и готовой реализации методов.

Абстрактный класс может содержать:

* свойства;
* конструктор;
* обычные методы с реализацией;
* абстрактные методы без реализации.

```ts
abstract class PaymentProcessor {
  constructor(
    protected readonly merchantId: string,
  ) {}

  protected validateAmount(amount: number): void {
    if (amount <= 0) {
      throw new Error("Сумма должна быть положительной");
    }
  }

  abstract pay(amount: number): Promise<string>;
}
```

Кроме того:

* класс может реализовать несколько интерфейсов;
* наследоваться можно только от одного класса.

---

### 5. Для чего используется ограничение дженерика `T extends Entity`?

Ограничение сообщает TypeScript, что тип `T` обязан соответствовать интерфейсу `Entity`.

```ts
interface Entity {
  readonly id: number;
}

class Repository<T extends Entity> {
  save(entity: T): void {
    console.log(entity.id);
  }
}
```

Благодаря `T extends Entity` TypeScript знает, что у любого объекта типа `T` есть числовое поле `id`.

Такой тип использовать можно:

```ts
type Task = {
  id: number;
  title: string;
};
```

А такой нельзя:

```ts
type Category = {
  title: string;
};

// Ошибка: отсутствует id
// new Repository<Category>();
```

Ограничение сохраняет универсальность класса, но запрещает передавать неподходящие типы.

---

### 6. Зачем при переопределении метода использовать ключевое слово `override`?

Ключевое слово `override` явно показывает, что метод переопределяет метод родительского класса.

```ts
abstract class PaymentProcessor {
  abstract pay(amount: number): Promise<string>;
}

class CardPaymentProcessor extends PaymentProcessor {
  override async pay(amount: number): Promise<string> {
    return `Оплачено: ${amount}`;
  }
}
```

Это особенно полезно при рефакторинге.

---

### 7. Почему композиция часто масштабируется лучше глубокой иерархии наследования?

При наследовании поведение жёстко связывается с иерархией классов.

Например, для разных комбинаций возможностей могут появиться классы:

```text
EmailNotification
UrgentEmailNotification
RetryingEmailNotification
UrgentRetryingEmailNotification
```

Чем больше независимых возможностей, тем больше комбинаций и классов.

При композиции объект получает необходимые компоненты через конструктор:

```ts
class NotificationService {
  constructor(
    private readonly sender: Sender,
    private readonly formatter: Formatter,
    private readonly retryPolicy: RetryPolicy,
  ) {}
}
```

Теперь отправителя, форматирование и стратегию повторов можно заменять независимо.

Композиция:

* уменьшает связанность;
* упрощает тестирование;
* позволяет заменять отдельные компоненты;
* не требует создавать класс для каждой комбинации поведения.

---

# Практическое задание

## Задание 1. Класс задачи

Сначала создадим тип статуса задачи:

```ts
type TaskStatus = "todo" | "inProgress" | "done";
```

Создадим тип снимка задачи:

```ts
type TaskSnapshot = {
  id: number;
  title: string;
  status: TaskStatus;
  createdAt: string;
};
```

Снимок является обычным объектом. Он не содержит методов класса, поэтому его можно безопасно преобразовать в JSON.

---

### Класс `TaskEntity`

```ts
class TaskEntity {
  private _status: TaskStatus = "todo";

  constructor(
    public readonly id: number,
    private _title: string,
    public readonly createdAt: Date = new Date(),
  ) {
    this._title = TaskEntity.normalizeTitle(_title);

    if (Number.isNaN(createdAt.getTime())) {
      throw new Error("Некорректная дата создания задачи");
    }
  }

  get title(): string {
    return this._title;
  }

  get status(): TaskStatus {
    return this._status;
  }

  rename(title: string): void {
    if (this._status === "done") {
      throw new Error("Нельзя переименовать завершённую задачу");
    }

    this._title = TaskEntity.normalizeTitle(title);
  }

  start(): void {
    if (this._status !== "todo") {
      throw new Error(
        "Начать можно только задачу со статусом todo",
      );
    }

    this._status = "inProgress";
  }

  complete(): void {
    if (this._status !== "inProgress") {
      throw new Error(
        "Завершить можно только задачу со статусом inProgress",
      );
    }

    this._status = "done";
  }

  toSnapshot(): TaskSnapshot {
    return {
      id: this.id,
      title: this._title,
      status: this._status,
      createdAt: this.createdAt.toISOString(),
    };
  }

  static fromSnapshot(snapshot: TaskSnapshot): TaskEntity {
    if (
      !Number.isInteger(snapshot.id) ||
      snapshot.id <= 0
    ) {
      throw new Error(
        "Идентификатор задачи должен быть положительным целым числом",
      );
    }

    if (!TaskEntity.isTaskStatus(snapshot.status)) {
      throw new Error(
        `Некорректный статус задачи: ${snapshot.status}`,
      );
    }

    const createdAt = new Date(snapshot.createdAt);

    if (Number.isNaN(createdAt.getTime())) {
      throw new Error("Некорректная дата создания задачи");
    }

    const task = new TaskEntity(
      snapshot.id,
      snapshot.title,
      createdAt,
    );

    task._status = snapshot.status;

    return task;
  }

  private static normalizeTitle(title: string): string {
    const normalizedTitle = title.trim();

    if (normalizedTitle === "") {
      throw new Error("Название задачи обязательно");
    }

    return normalizedTitle;
  }

  private static isTaskStatus(
    value: string,
  ): value is TaskStatus {
    return (
      value === "todo" ||
      value === "inProgress" ||
      value === "done"
    );
  }
}
```

---

### Разбор класса

Поле статуса закрыто от внешнего кода:

```ts
private _status: TaskStatus = "todo";
```

Поэтому выполнить прямое присваивание нельзя:

```ts
const task = new TaskEntity(1, "Изучить классы");

// Ошибка TypeScript:
// task._status = "done";
```

Статус изменяется только через методы:

```ts
task.start();
task.complete();
```

Каждый метод проверяет допустимость перехода.

---

Название также является приватным:

```ts
private _title: string
```

Для чтения используются getter:

```ts
console.log(task.title);
console.log(task.status);
```

Для изменения названия используется метод:

```ts
task.rename("Изучить композицию");
```

---

Метод `toSnapshot()` возвращает обычный объект:

```ts
const snapshot = task.toSnapshot();

console.log(snapshot);
```

Результат:

```text
{
  id: 1,
  title: "Изучить композицию",
  status: "done",
  createdAt: "2026-07-15T10:00:00.000Z"
}
```

---

Статический метод восстанавливает экземпляр класса:

```ts
const restoredTask = TaskEntity.fromSnapshot(snapshot);

console.log(restoredTask.title);
console.log(restoredTask.status);
```

Восстановленный объект снова имеет методы класса:

```ts
restoredTask.rename;
restoredTask.start;
restoredTask.complete;
```

Однако вызвать некоторые методы может быть нельзя из-за текущего статуса задачи.

---

### Проверка первого задания

```ts
const firstTask = new TaskEntity(
  1,
  "  Изучить классы  ",
);

console.log(firstTask.title);
console.log(firstTask.status);

firstTask.rename("Изучить инварианты");
firstTask.start();
firstTask.complete();

console.log(firstTask.toSnapshot());
```

Результат:

```text
Изучить классы
todo
{
  id: 1,
  title: "Изучить инварианты",
  status: "done",
  createdAt: "..."
}
```

Попробуем выполнить запрещённую операцию:

```ts
try {
  firstTask.start();
} catch (error) {
  if (error instanceof Error) {
    console.log(error.message);
  }
}
```

Результат:

```text
Начать можно только задачу со статусом todo
```

Экспортируем задачу в JSON:

```ts
const json = JSON.stringify(
  firstTask.toSnapshot(),
  null,
  2,
);

console.log(json);
```

Восстановим задачу:

```ts
const parsedSnapshot: TaskSnapshot =
  JSON.parse(json);

const restoredTask =
  TaskEntity.fromSnapshot(parsedSnapshot);

console.log(restoredTask instanceof TaskEntity);
console.log(restoredTask.title);
console.log(restoredTask.status);
```

Результат:

```text
true
Изучить инварианты
done
```

---

## Задание 2. Репозиторий и сервис

### Общий интерфейс сущности

```ts
interface Entity {
  readonly id: number;
}
```

Класс `TaskEntity` уже соответствует этому интерфейсу, потому что у него есть поле:

```ts
public readonly id: number
```

TypeScript использует структурную типизацию, поэтому писать `implements Entity` необязательно.

---

### Интерфейс репозитория

```ts
interface Repository<T extends Entity> {
  save(entity: T): void;
  findById(id: number): T | undefined;
  findAll(): T[];
  remove(id: number): boolean;
}
```

Интерфейс описывает только контракт хранилища.

Он не определяет, где именно будут храниться данные:

* в памяти;
* в базе данных;
* в файле;
* на удалённом сервере.

---

### Реализация `InMemoryRepository`

```ts
class InMemoryRepository<T extends Entity>
  implements Repository<T>
{
  private readonly items = new Map<number, T>();

  save(entity: T): void {
    this.items.set(entity.id, entity);
  }

  findById(id: number): T | undefined {
    return this.items.get(id);
  }

  findAll(): T[] {
    return [...this.items.values()];
  }

  remove(id: number): boolean {
    return this.items.delete(id);
  }
}
```

Метод `save` добавляет новый объект или заменяет существующий объект с тем же идентификатором:

```ts
save(entity: T): void {
  this.items.set(entity.id, entity);
}
```

Метод `findById` может вернуть объект или `undefined`:

```ts
findById(id: number): T | undefined {
  return this.items.get(id);
}
```

Метод `findAll` создаёт новый массив:

```ts
findAll(): T[] {
  return [...this.items.values()];
}
```

---

### Проверка снимка во время выполнения

После `JSON.parse()` TypeScript не знает реальную структуру данных.

Поэтому добавим runtime-проверку.

```ts
function isRecord(
  value: unknown,
): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
```

Проверим допустимый статус:

```ts
function isTaskStatus(
  value: unknown,
): value is TaskStatus {
  return (
    value === "todo" ||
    value === "inProgress" ||
    value === "done"
  );
}
```

Теперь проверим снимок целиком:

```ts
function isTaskSnapshot(
  value: unknown,
): value is TaskSnapshot {
  return (
    isRecord(value) &&
    typeof value.id === "number" &&
    Number.isInteger(value.id) &&
    value.id > 0 &&
    typeof value.title === "string" &&
    isTaskStatus(value.status) &&
    typeof value.createdAt === "string"
  );
}
```

---

### Класс `TaskService`

```ts
class TaskService {
  private static nextId = 1;

  constructor(
    private readonly repository:
      Repository<TaskEntity>,
  ) {}

  create(title: string): TaskEntity {
    const task = new TaskEntity(
      TaskService.nextId,
      title,
    );

    TaskService.nextId += 1;

    this.repository.save(task);

    return task;
  }

  findById(id: number): TaskEntity {
    const task = this.repository.findById(id);

    if (!task) {
      throw new Error(`Задача с id ${id} не найдена`);
    }

    return task;
  }

  findAll(): TaskEntity[] {
    return this.repository.findAll();
  }

  rename(id: number, title: string): void {
    const task = this.findById(id);

    task.rename(title);
    this.repository.save(task);
  }

  start(id: number): void {
    const task = this.findById(id);

    task.start();
    this.repository.save(task);
  }

  complete(id: number): void {
    const task = this.findById(id);

    task.complete();
    this.repository.save(task);
  }

  remove(id: number): boolean {
    return this.repository.remove(id);
  }

  exportToJson(): string {
    const snapshots = this.repository
      .findAll()
      .map((task) => task.toSnapshot());

    return JSON.stringify(snapshots, null, 2);
  }

  importFromJson(json: string): void {
    let parsedValue: unknown;

    try {
      parsedValue = JSON.parse(json);
    } catch {
      throw new Error("Передана некорректная JSON-строка");
    }

    if (!Array.isArray(parsedValue)) {
      throw new Error(
        "JSON должен содержать массив задач",
      );
    }

    const restoredTasks: TaskEntity[] = [];

    for (const value of parsedValue) {
      if (!isTaskSnapshot(value)) {
        throw new Error(
          `Некорректный снимок задачи: ${JSON.stringify(value)}`,
        );
      }

      restoredTasks.push(
        TaskEntity.fromSnapshot(value),
      );
    }

    for (const task of restoredTasks) {
      this.repository.save(task);
    }

    const maximumId = restoredTasks.reduce(
      (maximum, task) => Math.max(maximum, task.id),
      0,
    );

    TaskService.nextId = Math.max(
      TaskService.nextId,
      maximumId + 1,
    );
  }
}
```

---

### Почему сервис использует композицию?

Репозиторий передаётся в конструктор:

```ts
constructor(
  private readonly repository:
    Repository<TaskEntity>,
) {}
```

`TaskService` не наследуется от `InMemoryRepository`.

Неправильный вариант выглядел бы так:

```ts
// Так делать не нужно:
class TaskService
  extends InMemoryRepository<TaskEntity> {}
```

Сервис не является разновидностью репозитория.

Сервис использует репозиторий для хранения данных. Поэтому между ними отношение композиции.

Благодаря интерфейсу реализацию можно заменить:

```ts
const repository =
  new InMemoryRepository<TaskEntity>();

const service = new TaskService(repository);
```

В будущем вместо `InMemoryRepository` можно передать другую реализацию:

```ts
// const repository = new MongoTaskRepository();
// const service = new TaskService(repository);
```

Сам класс `TaskService` изменять не потребуется.

---

# Полный код решения

```ts
type TaskStatus = "todo" | "inProgress" | "done";

type TaskSnapshot = {
  id: number;
  title: string;
  status: TaskStatus;
  createdAt: string;
};

interface Entity {
  readonly id: number;
}

interface Repository<T extends Entity> {
  save(entity: T): void;
  findById(id: number): T | undefined;
  findAll(): T[];
  remove(id: number): boolean;
}

class TaskEntity {
  private _status: TaskStatus = "todo";

  constructor(
    public readonly id: number,
    private _title: string,
    public readonly createdAt: Date = new Date(),
  ) {
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error(
        "Идентификатор задачи должен быть положительным целым числом",
      );
    }

    this._title = TaskEntity.normalizeTitle(_title);

    if (Number.isNaN(createdAt.getTime())) {
      throw new Error(
        "Некорректная дата создания задачи",
      );
    }
  }

  get title(): string {
    return this._title;
  }

  get status(): TaskStatus {
    return this._status;
  }

  rename(title: string): void {
    if (this._status === "done") {
      throw new Error(
        "Нельзя переименовать завершённую задачу",
      );
    }

    this._title = TaskEntity.normalizeTitle(title);
  }

  start(): void {
    if (this._status !== "todo") {
      throw new Error(
        "Начать можно только задачу со статусом todo",
      );
    }

    this._status = "inProgress";
  }

  complete(): void {
    if (this._status !== "inProgress") {
      throw new Error(
        "Завершить можно только задачу со статусом inProgress",
      );
    }

    this._status = "done";
  }

  toSnapshot(): TaskSnapshot {
    return {
      id: this.id,
      title: this._title,
      status: this._status,
      createdAt: this.createdAt.toISOString(),
    };
  }

  static fromSnapshot(
    snapshot: TaskSnapshot,
  ): TaskEntity {
    if (
      !Number.isInteger(snapshot.id) ||
      snapshot.id <= 0
    ) {
      throw new Error(
        "Идентификатор задачи должен быть положительным целым числом",
      );
    }

    if (!TaskEntity.isTaskStatus(snapshot.status)) {
      throw new Error(
        `Некорректный статус задачи: ${snapshot.status}`,
      );
    }

    const createdAt = new Date(snapshot.createdAt);

    if (Number.isNaN(createdAt.getTime())) {
      throw new Error(
        "Некорректная дата создания задачи",
      );
    }

    const task = new TaskEntity(
      snapshot.id,
      snapshot.title,
      createdAt,
    );

    task._status = snapshot.status;

    return task;
  }

  private static normalizeTitle(
    title: string,
  ): string {
    const normalizedTitle = title.trim();

    if (normalizedTitle === "") {
      throw new Error("Название задачи обязательно");
    }

    return normalizedTitle;
  }

  private static isTaskStatus(
    value: string,
  ): value is TaskStatus {
    return (
      value === "todo" ||
      value === "inProgress" ||
      value === "done"
    );
  }
}

class InMemoryRepository<T extends Entity>
  implements Repository<T>
{
  private readonly items = new Map<number, T>();

  save(entity: T): void {
    this.items.set(entity.id, entity);
  }

  findById(id: number): T | undefined {
    return this.items.get(id);
  }

  findAll(): T[] {
    return [...this.items.values()];
  }

  remove(id: number): boolean {
    return this.items.delete(id);
  }
}

function isRecord(
  value: unknown,
): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isTaskStatus(
  value: unknown,
): value is TaskStatus {
  return (
    value === "todo" ||
    value === "inProgress" ||
    value === "done"
  );
}

function isTaskSnapshot(
  value: unknown,
): value is TaskSnapshot {
  return (
    isRecord(value) &&
    typeof value.id === "number" &&
    Number.isInteger(value.id) &&
    value.id > 0 &&
    typeof value.title === "string" &&
    isTaskStatus(value.status) &&
    typeof value.createdAt === "string"
  );
}

class TaskService {
  private static nextId = 1;

  constructor(
    private readonly repository:
      Repository<TaskEntity>,
  ) {}

  create(title: string): TaskEntity {
    const task = new TaskEntity(
      TaskService.nextId,
      title,
    );

    TaskService.nextId += 1;

    this.repository.save(task);

    return task;
  }

  findById(id: number): TaskEntity {
    const task = this.repository.findById(id);

    if (!task) {
      throw new Error(
        `Задача с id ${id} не найдена`,
      );
    }

    return task;
  }

  findAll(): TaskEntity[] {
    return this.repository.findAll();
  }

  rename(id: number, title: string): void {
    const task = this.findById(id);

    task.rename(title);
    this.repository.save(task);
  }

  start(id: number): void {
    const task = this.findById(id);

    task.start();
    this.repository.save(task);
  }

  complete(id: number): void {
    const task = this.findById(id);

    task.complete();
    this.repository.save(task);
  }

  remove(id: number): boolean {
    return this.repository.remove(id);
  }

  exportToJson(): string {
    const snapshots = this.repository
      .findAll()
      .map((task) => task.toSnapshot());

    return JSON.stringify(snapshots, null, 2);
  }

  importFromJson(json: string): void {
    let parsedValue: unknown;

    try {
      parsedValue = JSON.parse(json);
    } catch {
      throw new Error(
        "Передана некорректная JSON-строка",
      );
    }

    if (!Array.isArray(parsedValue)) {
      throw new Error(
        "JSON должен содержать массив задач",
      );
    }

    const restoredTasks: TaskEntity[] = [];

    for (const value of parsedValue) {
      if (!isTaskSnapshot(value)) {
        throw new Error(
          `Некорректный снимок задачи: ${JSON.stringify(value)}`,
        );
      }

      restoredTasks.push(
        TaskEntity.fromSnapshot(value),
      );
    }

    for (const task of restoredTasks) {
      this.repository.save(task);
    }

    const maximumId = restoredTasks.reduce(
      (maximum, task) =>
        Math.max(maximum, task.id),
      0,
    );

    TaskService.nextId = Math.max(
      TaskService.nextId,
      maximumId + 1,
    );
  }
}

function printError(error: unknown): void {
  if (error instanceof Error) {
    console.log(`Ошибка: ${error.message}`);
  } else {
    console.log("Произошла неизвестная ошибка");
  }
}

const repository =
  new InMemoryRepository<TaskEntity>();

const taskService = new TaskService(repository);

console.log("Сценарий 1. Создание корректной задачи");

const task1 = taskService.create(
  "Изучить классы TypeScript",
);

console.log(task1.toSnapshot());

console.log(
  "\nСценарий 2. Попытка создать пустую задачу",
);

try {
  taskService.create("   ");
} catch (error) {
  printError(error);
}

console.log(
  "\nСценарий 3. Корректное изменение статусов",
);

taskService.rename(
  task1.id,
  "Изучить классы и композицию",
);

taskService.start(task1.id);

console.log(taskService.findById(task1.id).status);

taskService.complete(task1.id);

console.log(taskService.findById(task1.id).status);

console.log(
  "\nСценарий 4. Запрещённый переход",
);

try {
  taskService.start(task1.id);
} catch (error) {
  printError(error);
}

console.log(
  "\nСценарий 5. Запрет переименования завершённой задачи",
);

try {
  taskService.rename(
    task1.id,
    "Новое название",
  );
} catch (error) {
  printError(error);
}

console.log(
  "\nСценарий 6. Экспорт задач в JSON",
);

const task2 = taskService.create(
  "Реализовать репозиторий",
);

taskService.start(task2.id);

const json = taskService.exportToJson();

console.log(json);

console.log(
  "\nСценарий 7. Восстановление задач",
);

const restoredRepository =
  new InMemoryRepository<TaskEntity>();

const restoredService =
  new TaskService(restoredRepository);

restoredService.importFromJson(json);

for (const task of restoredService.findAll()) {
  console.log({
    snapshot: task.toSnapshot(),
    isTaskEntity: task instanceof TaskEntity,
    hasStartMethod:
      typeof task.start === "function",
  });
}

console.log(
  "\nСценарий 8. Создание задачи после импорта",
);

const task3 = restoredService.create(
  "Проверить генерацию идентификатора",
);

console.log(task3.toSnapshot());

console.log(
  "\nСценарий 9. Поиск и удаление",
);

console.log(
  restoredService.findById(task2.id).toSnapshot(),
);

const removed =
  restoredService.remove(task2.id);

console.log(`Задача удалена: ${removed}`);

console.log(
  "\nСценарий 10. Несуществующая задача",
);

try {
  restoredService.findById(999);
} catch (error) {
  printError(error);
}
```

## Пример результата

```text
Сценарий 1. Создание корректной задачи
{
  id: 1,
  title: "Изучить классы TypeScript",
  status: "todo",
  createdAt: "..."
}

Сценарий 2. Попытка создать пустую задачу
Ошибка: Название задачи обязательно

Сценарий 3. Корректное изменение статусов
inProgress
done

Сценарий 4. Запрещённый переход
Ошибка: Начать можно только задачу со статусом todo

Сценарий 5. Запрет переименования завершённой задачи
Ошибка: Нельзя переименовать завершённую задачу

Сценарий 6. Экспорт задач в JSON
[
  {
    "id": 1,
    "title": "Изучить классы и композицию",
    "status": "done",
    "createdAt": "..."
  },
  {
    "id": 2,
    "title": "Реализовать репозиторий",
    "status": "inProgress",
    "createdAt": "..."
  }
]

Сценарий 7. Восстановление задач
{
  snapshot: {
    id: 1,
    title: "Изучить классы и композицию",
    status: "done",
    createdAt: "..."
  },
  isTaskEntity: true,
  hasStartMethod: true
}

Сценарий 8. Создание задачи после импорта
{
  id: 3,
  title: "Проверить генерацию идентификатора",
  status: "todo",
  createdAt: "..."
}

Сценарий 9. Поиск и удаление
{
  id: 2,
  title: "Реализовать репозиторий",
  status: "inProgress",
  createdAt: "..."
}
Задача удалена: true

Сценарий 10. Несуществующая задача
Ошибка: Задача с id 999 не найдена
```
