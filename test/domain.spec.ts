import { describe, it, expect } from "vitest";
import { InMemoryTodoRepository } from "../app/src/adapters/persistence/memory/InMemoryTodoRepository";
import { AddTodo } from "../domain/todo/usecases/AddTodo";
import { ToggleTodo } from "../domain/todo/usecases/ToggleTodo";
import { ListTodos } from "../domain/todo/usecases/ListTodos";

describe("Hexagonal TODO — Domaine & Use Cases", () => {
  it("crée un todo puis le toggle", async () => {
    const repo = new InMemoryTodoRepository();
    const add = new AddTodo(repo);
    const toggle = new ToggleTodo(repo);
    const list = new ListTodos(repo);

    const t1 = await add.execute({ title: "Lire un livre" });
    expect(t1.id).toBeTruthy();
    expect(t1.done).toBe(false);

    const t2 = await toggle.execute(t1.id!);
    expect(t2.done).toBe(true);

    const all = await list.execute();
    expect(all).toHaveLength(1);
    expect(all[0].title).toBe("Lire un livre");
    expect(all[0].done).toBe(true);
  });

  it("renvoie une erreur si on toggle un id inexistant", async () => {
    const repo = new InMemoryTodoRepository();
    const toggle = new ToggleTodo(repo);
    await expect(toggle.execute("999")).rejects.toThrow(/Todo not found/i);
  });
});
