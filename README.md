# Hexagonal TODO (TypeScript)

Mini-projet de démonstration de l'architecture hexagonale (Ports & Adapters).

## Couches
- **domain** : entités métier + ports + use cases (pur TypeScript)
- **adapters** : implémentations techniques (persistence, web)
- **app** : wiring/composition (injection des ports vers les use cases)

## Exécuter
Voir les sections par branche (PRs) pour suivre l'évolution étape par étape.
