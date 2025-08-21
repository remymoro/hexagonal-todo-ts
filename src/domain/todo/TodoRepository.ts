import { Todo, TodoId } from "./Todo";

export interface TodoRepository {
  save(todo: Todo): Promise<Todo>;
  findById(id: TodoId): Promise<Todo | null>;
  listAll(): Promise<Todo[]>;
}
