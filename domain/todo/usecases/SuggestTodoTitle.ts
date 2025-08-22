// domain/todo/usecases/SuggestTodoTitle.ts
import { ChatGptService } from "../ChatGptService";

export class SuggestTodoTitle {
  constructor(private readonly ai: ChatGptService) {}

  async execute(context: string) {
    return this.ai.suggestTitle(context);
  }
}