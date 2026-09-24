import { useState } from "react";
import type { FormEvent } from "react";
import { sendMessage } from "./api/chat";
import type { ChatMessage } from "./types";
import "./App.css";

function App() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    const nextMessages: ChatMessage[] = [...messages, { role: "user", content: trimmed }];
    setMessages(nextMessages);
    setInput("");
    setError(null);
    setIsLoading(true);

    try {
      const reply = await sendMessage(trimmed);
      setMessages([...nextMessages, { role: "assistant", content: reply }]);
    } catch {
      setError("Something went wrong talking to the chatbot. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="chat-app">
      <h1>Chat Bot</h1>

      <div className="chat-window">
        {messages.length === 0 && <p className="chat-empty">Ask me anything to get started.</p>}
        {messages.map((message, index) => (
          <div key={index} className={`chat-message chat-message--${message.role}`}>
            <span className="chat-message__role">{message.role === "user" ? "You" : "Bot"}</span>
            <p>{message.content}</p>
          </div>
        ))}
        {isLoading && <p className="chat-empty">Thinking…</p>}
      </div>

      {error && <p className="chat-error">{error}</p>}

      <form className="chat-form" onSubmit={handleSubmit}>
        <input
          type="text"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Type your question..."
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading || !input.trim()}>
          Send
        </button>
      </form>
    </div>
  );
}

export default App;
