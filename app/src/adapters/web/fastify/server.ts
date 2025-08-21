// app/src/adapters/web/fastify/server.ts
import { buildApp } from "./app";

async function bootstrap() {
  const app = await buildApp();
  const PORT = Number(process.env.PORT ?? 3000);
  await app.listen({ port: PORT, host: "0.0.0.0" });
  app.log.info(`HTTP adapter (Fastify) on http://localhost:${PORT}`);
}
bootstrap().catch((err) => { console.error(err); process.exit(1); });
