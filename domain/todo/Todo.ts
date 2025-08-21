export type TodoId = string;
export class Todo {
  constructor(public readonly id: TodoId | null, public title: string, public done = false) {
    if (!title || !title.trim()) throw new Error("Title is required");
    this.title = title.trim();
  }
  toggle() { this.done = !this.done; }
}
