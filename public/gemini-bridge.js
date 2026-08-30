/*
 * Gemini 3.7 Flash bridge
 *
 * The existing app was written against Groq's OpenAI-compatible endpoint.
 * This small compatibility layer lets the existing AI features use Gemini
 * without rewriting the large App.tsx file yet.
 *
 * IMPORTANT: The key is still supplied by the existing app's settings field.
 * This is a transitional fix; a server-side secret should be the long-term design.
 */
(function () {
  const originalFetch = window.fetch.bind(window);
  const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
  const GEMINI_MODEL = "gemini-3.7-flash";
  const GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/" + GEMINI_MODEL + ":generateContent";

  function makeErrorResponse(status, message) {
    return new Response(JSON.stringify({ error: { message: message || "Gemini request failed." } }), {
      status,
      headers: { "Content-Type": "application/json" }
    });
  }

  window.fetch = async function (input, init) {
    const url = typeof input === "string" ? input : input && input.url;
    if (!url || !url.startsWith(GROQ_URL)) {
      return originalFetch(input, init);
    }

    try {
      const requestInit = init || {};
      const headers = new Headers(requestInit.headers || (input instanceof Request ? input.headers : undefined));
      const authorization = headers.get("Authorization") || "";
      const match = authorization.match(/^Bearer\\s+(.+)$/i);
      const apiKey = match ? match[1].trim() : "";

      if (!apiKey) {
        return makeErrorResponse(401, "Gemini API key is missing.");
      }

      let body;
      if (typeof requestInit.body === "string") {
        body = JSON.parse(requestInit.body);
      } else if (input instanceof Request) {
        body = JSON.parse(await input.clone().text());
      } else {
        return makeErrorResponse(400, "AI request body is missing.");
      }

      const messages = Array.isArray(body.messages) ? body.messages : [];
      const systemMessages = messages.filter(function (m) { return m && m.role === "system"; });
      const conversationMessages = messages.filter(function (m) { return m && m.role !== "system"; });

      const contents = conversationMessages.map(function (message) {
        return {
          role: message.role === "assistant" ? "model" : "user",
          parts: [{ text: String(message.content || "") }]
        };
      }).filter(function (message) {
        return message.parts[0].text.trim().length > 0;
      });

      const payload = {
        systemInstruction: systemMessages.length ? {
          parts: [{ text: systemMessages.map(function (m) { return String(m.content || ""); }).join("\\n\\n") }]
        } : undefined,
        contents: contents,
        generationConfig: body.response_format
          ? { responseMimeType: "application/json", thinkingConfig: { thinkingLevel: "medium" } }
          : { thinkingConfig: { thinkingLevel: "medium" } }
      };

      if (!payload.contents.length) {
        return makeErrorResponse(400, "Gemini needs at least one user message.");
      }

      const response = await originalFetch(GEMINI_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey
        },
        body: JSON.stringify(payload)
      });

      const geminiData = await response.json();

      if (!response.ok) {
        const message = geminiData && geminiData.error && geminiData.error.message
          ? geminiData.error.message
          : "Gemini API request failed.";
        return makeErrorResponse(response.status, message);
      }

      const text = geminiData && geminiData.candidates && geminiData.candidates[0] && geminiData.candidates[0].content
        ? geminiData.candidates[0].content.parts.filter(function (p) { return typeof p.text === "string"; }).map(function (p) { return p.text; }).join("\\n")
        : "";

      if (!text) {
        return makeErrorResponse(502, "Gemini returned an empty response.");
      }

      /* Return the response shape the existing App.tsx already expects. */
      return new Response(JSON.stringify({
        choices: [{ message: { role: "assistant", content: text } }]
      }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    } catch (error) {
      console.error("Gemini bridge error:", error);
      return makeErrorResponse(500, error && error.message ? error.message : "Gemini bridge failed.");
    }
  };
})();
