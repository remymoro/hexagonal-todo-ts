// app/src/adapters/ai/OpenAiChatGptService.ts
import { ChatGptService } from "@domain/todo/ChatGptService";

export class OpenAiChatGptService implements ChatGptService {
  constructor(private readonly apiKey: string) {
    console.log("OPENAI_API_KEY:", process.env.OPENAI_API_KEY);
  }

  async suggestTitle(context: string): Promise<string> {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${this.apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [{ role: "user", content: `Propose un titre de todo pour : ${context}` }]
      })
    });
    const data = await res.json();
    console.log(data)
    return data.choices?.[0]?.message?.content?.trim() ?? "Suggestion";
  }
}