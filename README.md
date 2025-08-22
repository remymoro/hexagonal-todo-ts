# Todo – Architecture hexagonale (TypeScript)

Un petit projet **méga pédagogique** qui met en pratique l’architecture hexagonale en TypeScript. L’objectif : garder le **métier au centre** et rendre tout le reste **remplaçable** (web, persistance, IA…).

---

## TL;DR

* **Domaine au centre** : règles métier pures, sans frameworks.
* **Ports** (interfaces) ↔ **Adaptateurs** (implémentations concrètes).
* **Injection de dépendances** dans un **composition root** : `app/wiring.ts`.
* On peut **échanger la persistance** (mémoire, HTTP/Dyma…) et **ajouter l’IA** (OpenAI) **sans toucher au métier**.

```
Entrants (Web) ─► Use Cases (Domaine) ─► Ports ─► Adaptateurs (Sortants)
        Fastify         Toggle/List/Add         TodoRepository     InMemory / Dyma
                                           ChatGptService Port     OpenAI adapter
```

---

## Organisation du code

```text
.
|-- app/
|   |-- src/
|   |   `-- adapters/
|   |       |-- ai/
|   |       |   `-- OpenAiChatGptService.ts      # Adaptateur IA (sortant) pour OpenAI
|   |       |-- persistence/
|   |       |   |-- http/
|   |       |   |   `-- DymaTodoRepository.ts    # Adaptateur persistance via API Dyma (sortant)
|   |       |   `-- memory/
|   |       |       `-- InMemoryTodoRepository.ts# Adaptateur persistance en mémoire (sortant)
|   |       `-- web/
|   |           `-- fastify/
|   |               |-- app.ts                   # Déclaration des routes (entrant)
|   |               `-- server.ts                # Boot HTTP Fastify (entrant)
|   `-- wiring.ts                                # Composition root (choix des implémentations)
|-- domain/
|   `-- todo/
|       |-- ChatGptService.ts                    # Port (interface) pour l’IA
|       |-- Todo.ts                              # Entité métier
|       |-- TodoRepository.ts                    # Port (interface) pour la persistance
|       `-- usecases/
|           |-- AddTodo.ts
|           |-- ListTodos.ts
|           |-- SuggestTodoTitle.ts              # Use case qui dépend de ChatGptService (port)
|           `-- ToggleTodo.ts
|-- test/
|   |-- domain.spec.ts                           # Tests du domaine (purs, sans framework)
|   `-- http.spec.ts                             # Tests des routes/contrats HTTP
```

* **`domain/`** : uniquement du **TypeScript pur** (entités, ports, use cases). Aucune dépendance à Fastify, OpenAI ou BD.
* **`app/src/adapters/`** : le **monde extérieur**.

  * `web/fastify` : adaptateur **entrant** (reçoit HTTP, appelle les use cases).
  * `persistence/*` : adaptateurs **sortants** qui implémentent `TodoRepository`.
  * `ai/OpenAiChatGptService.ts` : adaptateur **sortant** qui implémente `ChatGptService`.
* **`app/wiring.ts`** : **composition root**. On choisit **quelle** implémentation brancher sur **quel** port.

---

## Flux d’une requête

1. **Fastify** reçoit la requête (ex. `PATCH /todos/:id/toggle`).
2. Le **contrôleur** appelle le **use case** (ex. `ToggleTodo.execute(id)`).
3. Le use case utilise des **ports** (ex. `TodoRepository`).
4. Le **wiring** lui a injecté une **implémentation** (ex. `InMemory` ou `Dyma`).
5. Le résultat remonte au contrôleur → **réponse HTTP**.

---

## Pourquoi c’est hexagonal ?

* Le **domaine** ne connaît **rien** du réseau, d’OpenAI ou de la base.
* Les **use cases** dépendent d’**interfaces** (ports), jamais d’implémentations concrètes.
* Les **détails** (Fastify, Dyma, OpenAI) sont repoussés aux **bords** (adaptateurs).
* **Changer d’implémentation** = changer le **wiring**, pas le domaine.

---

## Démarrage rapide

### Prérequis

* Node.js ≥ 18
* (Optionnel) `OPENAI_API_KEY` si tu utilises l’IA

### Installation

```bash
npm install
```

### Lancer le serveur (exemples)

Avec un script `dev` :

```bash
npm run dev
```

Ou avec `tsx` :

```bash
npx tsx app/src/adapters/web/fastify/server.ts
```

Par défaut, le serveur écoute sur `http://localhost:3000` (à ajuster selon `server.ts`).

---

## Configuration (env)

Variables utiles (exemples) :

* **Persistance**

  * `USE_DYMA=1` pour activer l’adaptateur HTTP Dyma (sinon mémoire)
  * `DYMA_BASE_URL=https://api.dyma.example` (exemple)
  * `DYMA_API_TOKEN=xxxxx` (si nécessaire)

* **IA**

  * `USE_AI=1` pour activer l’adaptateur OpenAI
  * `OPENAI_API_KEY=sk-…`

> Si les variables ne sont pas définies, le projet utilise des **fallbacks** simples (ex. repo mémoire, IA no‑op).

---

## Choisir sa persistance / service IA (dans `app/wiring.ts`)

```ts
// app/wiring.ts
import { InMemoryTodoRepository } from './src/adapters/persistence/memory/InMemoryTodoRepository';
import { DymaTodoRepository } from './src/adapters/persistence/http/DymaTodoRepository';
import { OpenAiChatGptService } from './src/adapters/ai/OpenAiChatGptService';

import { AddTodo, ListTodos, ToggleTodo, SuggestTodoTitle } from '../domain/todo/usecases';

const repo =
  process.env.USE_DYMA === '1'
    ? new DymaTodoRepository({ /* baseURL, token… */ })
    : new InMemoryTodoRepository();

const ai =
  process.env.USE_AI === '1'
    ? new OpenAiChatGptService(process.env.OPENAI_API_KEY!)
    : { suggestTitle: async (t: string) => `Todo: ${t}` }; // no-op adapter

export const usecases = {
  addTodo: new AddTodo(repo),
  listTodos: new ListTodos(repo),
  toggleTodo: new ToggleTodo(repo),
  suggestTodoTitle: new SuggestTodoTitle(ai),
};
```

> **Idée clé** : on **switch** librement entre `InMemory` et `Dyma`, on **active/désactive l’IA**, **sans toucher au domaine**.

---

## Endpoints (indicatifs)

> Réfère-toi à `app/src/adapters/web/fastify/app.ts` pour la liste exacte.

* `GET /todos` → `ListTodos`
* `POST /todos` → `AddTodo`
* `PATCH /todos/:id/toggle` → `ToggleTodo`
* `POST /todos/suggest-title` → `SuggestTodoTitle` (IA active requise)

Exemples rapides :

```bash
# Lister
curl http://localhost:3000/todos

# Ajouter
curl -X POST http://localhost:3000/todos \
  -H 'Content-Type: application/json' \
  -d '{"title":"Apprendre Hexagonal"}'

# Basculer l’état
docker
curl -X PATCH http://localhost:3000/todos/123/toggle

# Suggérer un titre (IA)
curl -X POST http://localhost:3000/todos/suggest-title \
  -H 'Content-Type: application/json' \
  -d '{"hint":"courses pour la collecte"}'
```

---

## Tests

* **`test/domain.spec.ts`** : teste les use cases avec un **repo en mémoire** → rapides, déterministes.
* **`test/http.spec.ts`** : teste le **contrat HTTP** (routes/DTO) via l’adaptateur web.

```bash
npm test
```

---

## Correspondance Clean Architecture (pour la culture)

* **Domain** = Entities + Use Cases (interactors)
* **Interface Adapters** = adaptateurs web/persistance/IA
* **Frameworks & Drivers** = Fastify, clients HTTP, SDK OpenAI
* **Composition root** = `app/wiring.ts`

> En pratique, le code reste très proche ; c’est surtout le **vocabulaire** et les **couches concentriques** qui changent.

---

## Principes & bonnes pratiques

* **Aucune fuite de détails** (pas de Fastify/SDK/HTTP dans `domain/`).
* **Ports explicites** (`TodoRepository`, `ChatGptService`).
* **Mapping** limité aux adaptateurs (DTO ↔ Domain).
* **Erreurs métier** gérées dans les use cases (ex. `NotFoundError`).
* **Tests faciles** grâce aux implémentations mémoire.
* **Side‑effects aux bords**, logique **pure au centre**.

---

## Licence

Libre usage pour l’apprentissage.
