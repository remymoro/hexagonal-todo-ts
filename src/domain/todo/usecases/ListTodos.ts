import { Todo } from "../Todo";
import { TodoRepository } from "../TodoRepository";

export class ListTodos {
  constructor(private readonly repo: TodoRepository) {}
  execute(): Promise<Todo[]> {
    return this.repo.listAll();
  }
}
