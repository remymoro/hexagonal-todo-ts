import { TodoId, Todo } from "../../../../Todo";
import { TodoRepository } from "../../../../TodoRepository";

export class InMemoryTodoRepository implements TodoRepository {
  private store = new Map<TodoId, Todo>();
  private seq = 1;

  async save(todo: Todo): Promise<Todo> {
    const id = todo.id ?? String(this.seq++);
    const copy = new Todo(id, todo.title, todo.done);
    this.store.set(id, copy);
    return copy;
  }

  async findById(id: TodoId): Promise<Todo | null> {
    const t = this.store.get(id);
    return t ? new Todo(t.id!, t.title, t.done) : null;
  }

  async listAll(): Promise<Todo[]> {
    return [...this.store.values()].map(t => new Todo(t.id!, t.title, t.done));
  }
}
