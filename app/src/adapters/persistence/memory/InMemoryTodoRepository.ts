import { Todo, TodoId } from "@domain/todo/Todo";
import { TodoRepository } from "@domain/todo/TodoRepository";

/**
 * Adaptateur de persistance en mémoire pour les Todos.
 *
 * Cette classe implémente le port TodoRepository avec un simple stockage en mémoire (Map).
 * Elle permet de tester l'application sans base de données, ou de démarrer rapidement en développement.
 *
 * - Les todos sont stockés dans une Map (clé = id, valeur = Todo).
 * - Un compteur (seq) génère des ids uniques pour chaque nouveau todo.
 * - Chaque méthode retourne une copie du todo pour éviter les effets de bord.
 */
export class InMemoryTodoRepository implements TodoRepository {
  private store = new Map<TodoId, Todo>();
  private seq = 1;

  /**
   * Sauvegarde un todo (création ou mise à jour).
   * Si l'id est absent, il est généré automatiquement.
   * @param todo - Le todo à sauvegarder.
   * @returns Le todo sauvegardé (avec id garanti).
   */
  async save(todo: Todo): Promise<Todo> {
    const id = todo.id ?? String(this.seq++);
    const copy = new Todo(id, todo.title, todo.done);
    this.store.set(id, copy);
    return copy;
  }

  /**
   * Recherche un todo par son identifiant.
   * @param id - L'identifiant du todo.
   * @returns Le todo trouvé (copie), ou null si absent.
   */
  async findById(id: TodoId): Promise<Todo | null> {
    const t = this.store.get(id);
    return t ? new Todo(t.id!, t.title, t.done) : null;
  }

  /**
   * Liste tous les todos existants.
   * @returns Un tableau de copies de todos.
   */
  async listAll(): Promise<Todo[]> {
    return [...this.store.values()].map(t => new Todo(t.id!, t.title, t.done));
  }
}
