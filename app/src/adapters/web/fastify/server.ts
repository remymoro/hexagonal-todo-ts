import fastify from "fastify";
import helmet from "@fastify/helmet";
import rateLimit from "@fastify/rate-limit";
import cors from "@fastify/cors";
import pino from "pino";
import { z } from "zod";
import { ZodTypeProvider, serializerCompiler, validatorCompiler } from "fastify-type-provider-zod";
import { usecases } from "@app/wiring";

async function bootstrap() {
  const logger = pino({
    level: process.env.LOG_LEVEL ?? "info",
    transport: process.env.NODE_ENV === "production" ? undefined : { target: "pino-pretty" }
  });

const app = fastify({
  logger: {
    level: process.env.LOG_LEVEL ?? "info",
    // pretty en dev, JSON en prod
    transport: process.env.NODE_ENV === "production"
      ? undefined
      : { target: "pino-pretty" }
  },
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
    return reply.send(await usecases.listTodos.execute());
  });

  app.post("/todos/:id/toggle", {
    schema: {
      params: z.object({ id: z.string() }),
      response: { 200: Todo, 404: z.object({ error: z.string() }) }
    }
  }, async (req, reply) => {
    try { return reply.send(await usecases.toggleTodo.execute(req.params.id)); }
    catch (e: any) { return reply.code(404).send({ error: e?.message ?? "Not Found" }); }
  });

  const PORT = Number(process.env.PORT ?? 3000);
  await app.listen({ port: PORT, host: "0.0.0.0" });
  app.log.info(`HTTP adapter (Fastify) on http://localhost:${PORT}`);
}

bootstrap().catch((err) => { console.error(err); process.exit(1); });
