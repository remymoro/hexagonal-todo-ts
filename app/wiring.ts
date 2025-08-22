import { AddTodo } from "@domain/todo/usecases/AddTodo";
import { ToggleTodo } from "@domain/todo/usecases/ToggleTodo";
import { ListTodos } from "@domain/todo/usecases/ListTodos";
import { DymaTodoRepository } from "./src/adapters/persistence/http/DymaTodoRepository";
import { OpenAiChatGptService } from "./src/adapters/ai/OpenAiChatGptService";
import { SuggestTodoTitle } from "@domain/todo/usecases/SuggestTodoTitle";
import "dotenv/config";

// Choisis une collection UNIQUE pour éviter les collisions publiques.
const repo = new DymaTodoRepository(
  "https://restapi.fr/api",
  process.env.DYMA_COLLECTION ?? "todos-hexago-demo"
);

const ai = new OpenAiChatGptService(process.env.OPENAI_API_KEY!);

export const usecases = {
  addTodo: new AddTodo(repo),
  toggleTodo: new ToggleTodo(repo),
  listTodos: new ListTodos(repo),
  suggestTodoTitle: new SuggestTodoTitle(ai),
};