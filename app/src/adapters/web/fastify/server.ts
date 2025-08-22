/**
 * Point d'entrée principal de l'adaptateur HTTP (Fastify).
 *
 * - Ce fichier démarre l'application Fastify configurée dans app.ts.
 * - Il utilise la fonction buildApp pour obtenir une instance prête à l'emploi.
 * - Le port d'écoute peut être configuré via la variable d'environnement PORT (défaut : 3000).
 * - Affiche dans les logs l'URL d'accès à l'API.
 * - En cas d'erreur au démarrage, affiche l'erreur et termine le processus.
 *
 * Avantage : ce point d'entrée reste minimal, il ne fait que lancer l'adaptateur web.
 */

import { buildApp } from "./app";

async function bootstrap() {
  const app = await buildApp();
  const PORT = Number(process.env.PORT ?? 3000);
  await app.listen({ port: PORT, host: "0.0.0.0" });
  app.log.info(`HTTP adapter (Fastify) on http://localhost:${PORT}`);
}
bootstrap().catch((err) => { console.error(err); process.exit(1); });
