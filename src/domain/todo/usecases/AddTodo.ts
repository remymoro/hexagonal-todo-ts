import { Todo } from "../Todo";
import { TodoRepository } from "../TodoRepository";

export class AddTodo {
  constructor(private readonly repo: TodoRepository) {}
  async execute(input: { title: string }) {
    const todo = new Todo(null, input.title, false);
    return this.repo.save(todo);
  }
}
