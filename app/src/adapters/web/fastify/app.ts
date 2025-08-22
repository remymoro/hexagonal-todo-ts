/**
 * Adaptateur Web (Fastify) — Point d'entrée HTTP de l'application
 *
 * Ce module expose la fonction buildApp qui configure et retourne une instance Fastify prête à servir l'API Todo.
 *
 * Points clés :
 * - Sécurisation (helmet), limitation de débit (rateLimit), CORS pour le développement front.
 * - Validation et typage automatique des requêtes/réponses grâce à Zod et fastify-type-provider-zod.
 * - Les routes HTTP délèguent toute la logique métier aux use cases du domaine (via l'objet usecases).
 * - Les schémas Zod garantissent que les données échangées sont toujours valides.
 *
 * Avantages :
 * - L'adaptateur web ne connaît rien de la persistance ni du métier : il ne fait qu'orchestrer les appels aux use cases.
 * - Facilement testable et évolutif : on peut changer d'adaptateur (REST, GraphQL...) sans toucher au domaine.
 * - Séparation claire des responsabilités, conforme à l'architecture en couches.
 */

// app/src/adapters/web/fastify/app.ts
import fastify from "fastify";
import helmet from "@fastify/helmet";
import rateLimit from "@fastify/rate-limit";
import cors from "@fastify/cors";
import { z } from "zod";
import { ZodTypeProvider, serializerCompiler, validatorCompiler } from "fastify-type-provider-zod";
import { usecases } from "@app/wiring"; // ou: "../../../../wiring" si tu n'as pas mis d'alias

export async function buildApp() {
  const app = fastify({
    logger: { level: process.env.LOG_LEVEL ?? "info", transport: process.env.NODE_ENV === "production" ? undefined : { target: "pino-pretty" } },
    bodyLimit: 16 * 1024
  }).withTypeProvider<ZodTypeProvider>();

  await app.register(helmet);
  await app.register(rateLimit, { max: 60, timeWindow: "1 minute" });
  await app.register(cors, { origin: [/^https?:\/\/localhost(?::\d+)?$/] });

  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);



  
  const Todo = z.object({
    id: z.string().nullable(), // <-- accepte string ou null
    title: z.string(),
    done: z.boolean()
  });

  
  const CreateTodo = z.object({ title: z.string().min(1).max(140) });

  app.post("/todos", { schema: { body: CreateTodo, response: { 201: Todo } } }, async (req, reply) => {
    const todo = await usecases.addTodo.execute({ title: req.body.title });
    return reply.code(201).send(todo);
  });

  app.get("/todos", { schema: { response: { 200: z.array(Todo) } } }, async (_req, reply) => {
    const todos = await usecases.listTodos.execute();
    return reply.send(todos);
  });

  app.post("/todos/:id/toggle", {
    schema: { params: z.object({ id: z.string() }), response: { 200: Todo, 404: z.object({ error: z.string() }) } }
  }, async (req, reply) => {
    try { return reply.send(await usecases.toggleTodo.execute(req.params.id)); }
    catch (e: any) { return reply.code(404).send({ error: e?.message ?? "Not Found" }); }
  });

app.post("/todos/suggest-title", {
  schema: { body: z.object({ context: z.string() }), response: { 200: z.object({ title: z.string() }) } }
}, async (req, reply) => {
  const title = await usecases.suggestTodoTitle.execute(req.body.context);
  return reply.send({ title });
});
  


  return app;
}
