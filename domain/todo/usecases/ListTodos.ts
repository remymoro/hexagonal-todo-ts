import { Todo } from "../Todo";
import { TodoRepository } from "../TodoRepository";

/**
 * Cas d'usage (use case) : Lister tous les Todos
 *
 * Cette classe représente l'action métier "récupérer la liste des todos".
 * Elle ne dépend que de l'interface TodoRepository (port), ce qui la rend indépendante de la technologie utilisée pour stocker les données.
 * Cela permet de tester ce use case facilement, sans se soucier du stockage (mémoire, base de données, etc.).
 */
export class ListTodos {
  /**
   * On injecte ici le repository (port) qui permet d'accéder aux todos.
   * L'implémentation concrète sera branchée ailleurs (dans le wiring).
   */
  constructor(private readonly repo: TodoRepository) {}

  /**
   * Méthode principale du use case.
   * @returns Une promesse contenant la liste de tous les todos.
   *
   * 1. Demande au repository de fournir la liste complète des todos.
   * 2. Retourne cette liste.
   */
  execute(): Promise<Todo[]> {
    return this.repo.listAll();
  }
}
