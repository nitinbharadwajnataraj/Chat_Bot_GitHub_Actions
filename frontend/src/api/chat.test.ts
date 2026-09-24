import { afterEach, describe, expect, it, vi } from "vitest";
import { sendMessage } from "./chat";

describe("sendMessage", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns the reply text on a successful response", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ reply: "mocked reply" }),
    });
    vi.stubGlobal("fetch", mockFetch);

    const reply = await sendMessage("Hello");

    expect(reply).toBe("mocked reply");
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("/api/chat/"),
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: "Hello" }),
      }),
    );
  });

  it("throws when the response is not ok", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: false, status: 502 }),
    );

    await expect(sendMessage("Hello")).rejects.toThrow("502");
  });
});
