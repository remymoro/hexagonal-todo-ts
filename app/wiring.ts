import { InMemoryTodoRepository } from "@app/src/adapters/persistence/memory/InMemoryTodoRepository";
import { AddTodo } from "@domain/todo/usecases/AddTodo";
import { ToggleTodo } from "@domain/todo/usecases/ToggleTodo";
import { ListTodos } from "@domain/todo/usecases/ListTodos";

const repo = new InMemoryTodoRepository();

export const usecases = {
  addTodo: new AddTodo(repo),
  toggleTodo: new ToggleTodo(repo),
  listTodos: new ListTodos(repo),
};
