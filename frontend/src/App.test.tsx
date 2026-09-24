import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import App from "./App";
import { sendMessage } from "./api/chat";

vi.mock("./api/chat", () => ({
  sendMessage: vi.fn(),
}));

const mockSendMessage = vi.mocked(sendMessage);

describe("App", () => {
  beforeEach(() => {
    mockSendMessage.mockReset();
  });

  afterEach(() => {
    cleanup();
  });

  it("shows an empty-state prompt before any messages are sent", () => {
    render(<App />);

    expect(screen.getByText(/ask me anything to get started/i)).toBeInTheDocument();
  });

  it("disables the send button until there is input", async () => {
    render(<App />);

    expect(screen.getByRole("button", { name: /send message/i })).toBeDisabled();

    await userEvent.type(screen.getByPlaceholderText(/type your question/i), "Hi");

    expect(screen.getByRole("button", { name: /send message/i })).toBeEnabled();
  });

  it("sends the typed message and displays the reply", async () => {
    mockSendMessage.mockResolvedValue("mocked reply");
    render(<App />);

    await userEvent.type(screen.getByPlaceholderText(/type your question/i), "Hello");
    await userEvent.click(screen.getByRole("button", { name: /send message/i }));

    expect(screen.getByText("Hello")).toBeInTheDocument();
    expect(mockSendMessage).toHaveBeenCalledWith("Hello");
    await waitFor(() => expect(screen.getByText("mocked reply")).toBeInTheDocument());
  });

  it("clears the input after sending", async () => {
    mockSendMessage.mockResolvedValue("mocked reply");
    render(<App />);

    const input = screen.getByPlaceholderText<HTMLInputElement>(/type your question/i);
    await userEvent.type(input, "Hello");
    await userEvent.click(screen.getByRole("button", { name: /send message/i }));

    expect(input.value).toBe("");
  });

  it("shows an error message when the request fails", async () => {
    mockSendMessage.mockRejectedValue(new Error("network down"));
    render(<App />);

    await userEvent.type(screen.getByPlaceholderText(/type your question/i), "Hello");
    await userEvent.click(screen.getByRole("button", { name: /send message/i }));

    await waitFor(() =>
      expect(screen.getByText(/something went wrong talking to the assistant/i)).toBeInTheDocument(),
    );
  });
});
