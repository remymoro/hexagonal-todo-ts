import { Todo } from "../Todo";
import { TodoRepository } from "../TodoRepository";
export class AddTodo {
  constructor(private readonly repo: TodoRepository) {}
  async execute(input: { title: string }) { return this.repo.save(new Todo(null, input.title)); }
}
