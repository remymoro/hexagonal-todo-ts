// Adapter sortant: parle à https://restapi.fr/api/<collection>
// Il mappe _id <-> id pour coller à ton domaine.

import { Todo, TodoId } from "@domain/todo/Todo";
import { TodoRepository } from "@domain/todo/TodoRepository";

type DymaDoc = {
  _id: string;
  title: string;
  done: boolean;
  createdAt?: string;
};

export class DymaTodoRepository implements TodoRepository {
  constructor(
    private readonly baseUrl = "https://restapi.fr/api",
    private readonly collection = "todos-hexago-demo/todos" // ⚠️ mets un nom UNIQUE (ex: todos-<tonPseudo>-<date>)
  ) {}

  private url(path = "") {
    const slash = path ? `/${path}` : "";
    return `${this.baseUrl}/${this.collection}${slash}`;
  }

  private toDomain(d: DymaDoc): Todo {
    return new Todo(d._id, d.title, d.done);
  }
  private toRemote(t: Todo) {
    return { title: t.title, done: t.done };
  }

  async save(todo: Todo): Promise<Todo> {
    // Si pas d'id → POST ; sinon → PUT
    if (!todo.id) {
      const res = await fetch(this.url(), {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(this.toRemote(todo)),
      });
      if (!res.ok) throw new Error(`Dyma POST failed: ${res.status}`);
      const created = (await res.json()) as DymaDoc;
      return this.toDomain(created);
    } else {
      const res = await fetch(this.url(todo.id), {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(this.toRemote(todo)),
      });
      if (!res.ok) throw new Error(`Dyma PUT failed: ${res.status}`);
      const updated = (await res.json()) as DymaDoc;
      return this.toDomain(updated);
    }
  }

  async findById(id: TodoId): Promise<Todo | null> {
    const res = await fetch(this.url(id));
    if (res.status === 404) return null;
    if (!res.ok) throw new Error(`Dyma GET by id failed: ${res.status}`);
    const doc = (await res.json()) as DymaDoc;
    return this.toDomain(doc);
  }

  async listAll(): Promise<Todo[]> {
    // tri croissant par date si présent
    const res = await fetch(`${this.url()}?sort=createdAt:asc`);
    if (!res.ok) throw new Error(`Dyma LIST failed: ${res.status}`);
    const json = await res.json();
    const arr = Array.isArray(json) ? (json as DymaDoc[]) : [json as DymaDoc];
    return arr.map(this.toDomain);
  }
}
