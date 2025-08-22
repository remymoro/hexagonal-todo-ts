// domain/todo/ChatGptService.ts
export interface ChatGptService {
  suggestTitle(context: string): Promise<string>;
}