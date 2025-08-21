# Hexagonal TODO (TypeScript)

Mini-projet de démonstration de l'architecture hexagonale (Ports & Adapters).

## Couches
- **domain** : entités métier + ports + use cases (pur TypeScript)
- **adapters** : implémentations techniques (persistence, web)
- **app** : wiring/composition (injection des ports vers les use cases)

## Exécuter
Voir les sections par branche (PRs) pour suivre l'évolution étape par étape.
                ┌──────────────────────────┐
                │   Adapter Web (Fastify)  │
                │  app/src/adapters/web    │
     HTTP  ───▶ │  /fastify/server.ts      │
                └──────────┬───────────────┘
                           │ appels des
                           │   use cases
                           ▼
                ┌──────────────────────────┐
                │   Application / Cas d’usage     │
                │  domain/todo/usecases/*         │
                │   - AddTodo                     │
                │   - ListTodos                   │
                │   - ToggleTodo                  │
                └──────────┬───────────────┘
                           │ via Port (interface)
                           │   TodoRepository
                           ▼
                ┌──────────────────────────┐
                │       Domaine pur        │
                │  domain/todo/*           │
                │  - Todo (entité)         │
                │  - TodoRepository (Port) │
                └──────────┬───────────────┘
                           │ implémentation du Port
                           ▼
                ┌──────────────────────────┐
                │ Adapter Persistance      │
                │ app/src/adapters/        │
                │ persistence/memory/*     │
                │  - InMemoryTodoRepository│
                └──────────────────────────┘
