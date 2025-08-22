import { TodoRepository } from "../TodoRepository";
import { TodoId } from "../Todo";

/**
 * Cas d'usage (use case) : Basculer l'état (fait / à faire) d'un Todo
 *
 * Cette classe encapsule la logique métier pour inverser l'état d'un todo (done <-> not done).
 * Elle ne dépend que de l'interface TodoRepository (port), ce qui la rend indépendante de la technologie de stockage.
 * Cela permet de tester ce use case facilement, sans se soucier de la base de données ou de l'implémentation technique.
 */
export class ToggleTodo {
  /**
   * On injecte ici le repository (port) qui permet d'accéder et de sauvegarder les todos.
   * L'implémentation concrète sera branchée ailleurs (dans le wiring).
   */
  constructor(private readonly repo: TodoRepository) {}

  /**
   * Méthode principale du use case.
   * @param id - L'identifiant du todo à basculer.
   * @returns Le todo mis à jour, après sauvegarde.
   *
   * 1. Recherche le todo correspondant à l'id fourni.
   * 2. Si le todo n'existe pas, lève une erreur.
   * 3. Sinon, appelle la méthode métier `toggle()` sur le todo (change son état).
   * 4. Sauvegarde le todo modifié via le repository.
   * 5. Retourne le todo mis à jour.
   */
  async execute(id: TodoId) {
    const todo = await this.repo.findById(id);
    if (!todo) throw new Error("Todo not found");
    todo.toggle();
    return this.repo.save(todo);
  }
}
