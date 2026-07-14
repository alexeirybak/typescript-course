type TaskStatus = "todo" | "inProgress" | "done";

class TaskEntity {
  private status: TaskStatus = "todo";

  constructor(
    public readonly id: number,
    private title: string,
  ) {
    if (title.trim() === "") {
      throw new Error("Название задачи обязательно");
    }
  }

  rename(title: string): void {
    if (title.trim() === "") {
      throw new Error("Название задачи обязательно");
    }

    this.title = title.trim();
  }

  start(): void {
    if (this.status !== "todo") {
      throw new Error("Начать можно только новую задачу");
    }

    this.status = "inProgress";
  }

  complete(): void {
    if (this.status !== "inProgress") {
      throw new Error("Завершить можно только активную задачу");
    }

    this.status = "done";
  }

  toSnapshot(): {
    id: number;
    title: string;
    status: TaskStatus;
  } {
    return {
      id: this.id,
      title: this.title,
      status: this.status,
    };
  }
}