interface Entity {
  id: number;
}

class InMemoryRepository<T extends Entity> {
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

type Task = {
  id: number;
  title: string;
  completed: boolean;
};

const taskRepository = new InMemoryRepository<Task>();

taskRepository.save({
  id: 1,
  title: "Изучить классы",
  completed: false,
});

type Category = {
  title: string;
};

// const newClass = new InMemoryRepository<Category>();
