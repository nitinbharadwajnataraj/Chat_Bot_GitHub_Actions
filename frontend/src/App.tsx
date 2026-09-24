import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { sendMessage } from "./api/chat";
import type { ChatMessage } from "./types";
import "./App.css";

function App() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollAnchorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollAnchorRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

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
      setError("Something went wrong talking to the assistant. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="chat-app">
      <div className="chat-card">
        <header className="chat-header">
          <span className="chat-header__avatar" aria-hidden="true">
            🤖
          </span>
          <div>
            <h1>Chat Assistant</h1>
            <p className="chat-header__subtitle">Ask me anything, I'm here to help</p>
          </div>
        </header>

        <div className="chat-window">
          {messages.length === 0 && (
            <p className="chat-empty">Ask me anything to get started.</p>
          )}
          {messages.map((message, index) => (
            <div key={index} className={`chat-row chat-row--${message.role}`}>
              <span className="chat-avatar" aria-hidden="true">
                {message.role === "user" ? "🧑" : "🤖"}
              </span>
              <div className={`chat-bubble chat-bubble--${message.role}`}>
                <p>{message.content}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="chat-row chat-row--assistant">
              <span className="chat-avatar" aria-hidden="true">
                🤖
              </span>
              <div className="chat-bubble chat-bubble--assistant chat-bubble--typing">
                <span className="chat-typing-dot" />
                <span className="chat-typing-dot" />
                <span className="chat-typing-dot" />
              </div>
            </div>
          )}
          <div ref={scrollAnchorRef} />
        </div>

        {error && <p className="chat-error">{error}</p>}

        <form
          className={`chat-form${isLoading ? " chat-form--loading" : ""}`}
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Type your question..."
            disabled={isLoading}
          />
          <button
            type="submit"
            className="chat-send"
            disabled={isLoading || !input.trim()}
            aria-label="Send message"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
              <path d="M2.01 21 23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;
