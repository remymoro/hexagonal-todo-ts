/**
 * Type alias pour l'identifiant d'un Todo.
 * Cela permet de changer facilement le type d'id plus tard si besoin.
 */
export type TodoId = string;

/**
 * Entité métier représentant un Todo.
 *
 * - Un Todo possède un identifiant (id), un titre, et un état (fait ou non).
 * - L'id peut être null lors de la création (il sera généré par le repository).
 * - Le titre est obligatoire et sera automatiquement "trimé" (espaces retirés).
 * - La méthode métier `toggle()` permet d'inverser l'état du todo (fait <-> à faire).
 */
export class Todo {
  constructor(
    public readonly id: TodoId | null,
    public title: string,
    public done = false
  ) {
    if (!title || !title.trim()) throw new Error("Title is required");
    this.title = title.trim();
  }

  /**
   * Inverse l'état du todo (fait <-> à faire).
   */
  toggle() {
    this.done = !this.done;
  }
}
