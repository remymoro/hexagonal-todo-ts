import { Todo } from "../Todo";
import { TodoRepository } from "../TodoRepository";

/**
 * Cas d'usage (use case) : Ajouter un nouveau Todo
 *
 * Cette classe représente l'action métier "ajouter un todo".
 * Elle ne connaît rien de la technique (base de données, API, etc.) : elle dépend uniquement d'une interface (le port TodoRepository).
 * Cela permet de tester et réutiliser ce code facilement, sans dépendre d'un stockage particulier.
 */
export class AddTodo {
  /**
   * On injecte ici le repository (port) dont le domaine a besoin pour sauvegarder un todo.
   * L'implémentation concrète (mémoire, base de données...) sera branchée ailleurs (dans le wiring).
   */
  constructor(private readonly repo: TodoRepository) {}

  /**
   * Méthode principale du use case.
   * @param input - Un objet contenant le titre du todo à créer.
   * @returns Le todo créé, après sauvegarde via le repository.
   *
   * 1. Crée une nouvelle entité Todo (l'id est à null, il sera généré par le repository).
   * 2. Demande au repository de sauvegarder ce todo.
   * 3. Retourne le résultat (le todo créé, souvent avec un id généré).
   */
  async execute(input: { title: string }) {
    return this.repo.save(new Todo(null, input.title));
  }
}
