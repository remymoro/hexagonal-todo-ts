import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { buildApp } from "../app/src/adapters/web/fastify/app";

describe("HTTP API (Fastify) — app.inject()", () => {
  let app: Awaited<ReturnType<typeof buildApp>>;

  beforeEach(async () => { app = await buildApp(); });
  afterEach(async () => { await app.close(); });

  it("POST /todos puis GET /todos", async () => {
    const create = await app.inject({
      method: "POST",
      url: "/todos",
      headers: { "content-type": "application/json" },
      payload: { title: "Acheter du lait" }
    });
    expect(create.statusCode).toBe(201);
    const created = create.json() as { id: string; title: string; done: boolean };
    expect(created.title).toBe("Acheter du lait");
    expect(created.done).toBe(false);

    const list = await app.inject({ method: "GET", url: "/todos" });
    expect(list.statusCode).toBe(200);
    const todos = list.json() as Array<{ id: string; title: string; done: boolean }>;
    expect(todos).toHaveLength(1);
    expect(todos[0].id).toBe(created.id);
  });

  it("POST /todos/:id/toggle (OK) & 404 si id inconnu", async () => {
    const cr = await app.inject({
      method: "POST",
      url: "/todos",
      headers: { "content-type": "application/json" },
      payload: { title: "Lire un livre" }
    });
    const { id } = cr.json() as { id: string };

    const ok = await app.inject({ method: "POST", url: `/todos/${id}/toggle` });
    expect(ok.statusCode).toBe(200);
    expect((ok.json() as any).done).toBe(true);

    const notFound = await app.inject({ method: "POST", url: "/todos/999/toggle" });
    expect(notFound.statusCode).toBe(404);
  });
});
