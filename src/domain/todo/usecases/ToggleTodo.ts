import { TodoRepository } from "../TodoRepository";
import { TodoId } from "../Todo";

export class ToggleTodo {
  constructor(private readonly repo: TodoRepository) {}
  async execute(id: TodoId) {
    const todo = await this.repo.findById(id);
    if (!todo) throw new Error("Todo not found");
    todo.toggle();
    return this.repo.save(todo);
  }
}
