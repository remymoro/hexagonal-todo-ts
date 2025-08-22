import { Todo, TodoId } from "./Todo";

/**
 * Port (interface) de persistance pour les Todos.
 *
 * Cette interface définit les opérations dont le domaine a besoin pour manipuler les todos,
 * sans dépendre d'une technologie particulière (base de données, mémoire, etc.).
 *
 * - Le domaine ne connaît que cette interface, jamais l'implémentation concrète.
 * - Cela permet de brancher facilement différents adaptateurs (mémoire, SQL, API...) sans toucher au code métier.
 */
export interface TodoRepository {
  /**
   * Sauvegarde un todo (création ou mise à jour).
   * @param todo - Le todo à sauvegarder.
   * @returns Le todo sauvegardé (avec id généré si besoin).
   */
  save(todo: Todo): Promise<Todo>;

  /**
   * Recherche un todo par son identifiant.
   * @param id - L'identifiant du todo.
   * @returns Le todo trouvé, ou null si absent.
   */
  findById(id: TodoId): Promise<Todo | null>;

  /**
   * Liste tous les todos existants.
   * @returns Un tableau de todos.
   */
  listAll(): Promise<Todo[]>;
}
