/*
 * Gemini 3.7 Flash compatibility bridge.
 *
 * App.tsx still calls Groq's OpenAI-compatible endpoint. Instead of rewriting
 * the large component, redirect those requests to Google's OpenAI-compatible
 * Gemini endpoint and only change the model name.
 */
(function () {
  const originalFetch = window.fetch.bind(window);
  const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
  const GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions";
  const GEMINI_MODEL = "gemini-3.7-flash";

  function errorResponse(status, message) {
    return new Response(JSON.stringify({
      error: { message: message || "Gemini request failed." }
    }), {
      status: status,
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
      const sourceHeaders = requestInit.headers || (input instanceof Request ? input.headers : undefined);
      const headers = new Headers(sourceHeaders || {});
      const authorization = headers.get("Authorization") || "";

      // IMPORTANT: single backslash = real whitespace regex.
      const match = authorization.match(/^Bearer\s+(.+)$/i);
      const apiKey = match ? match[1].trim() : "";

      if (!apiKey) {
        return errorResponse(401, "Gemini API key missing. Put your Gemini API key in Command Center.");
      }

      let body;
      if (typeof requestInit.body === "string") {
        body = JSON.parse(requestInit.body);
      } else if (input instanceof Request) {
        body = JSON.parse(await input.clone().text());
      } else {
        return errorResponse(400, "AI request body is missing.");
      }

      // Gemini's OpenAI-compatible endpoint accepts the existing chat format.
      // Preserve messages/response_format and only swap the model.
      body.model = GEMINI_MODEL;
      delete body.temperature;
      delete body.top_p;
      delete body.top_k;

      const response = await originalFetch(GEMINI_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + apiKey
        },
        body: JSON.stringify(body)
      });

      const rawText = await response.text();
      let data;
      try {
        data = JSON.parse(rawText);
      } catch (_) {
        data = { error: { message: rawText || "Gemini returned an invalid response." } };
      }

      if (!response.ok) {
        const message = data && data.error && data.error.message
          ? data.error.message
          : "Gemini API request failed with HTTP " + response.status + ".";
        console.error("Gemini API error:", response.status, data);
        return errorResponse(response.status, message);
      }

      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        console.error("Unexpected Gemini response:", data);
        return errorResponse(502, "Gemini returned an unexpected response format.");
      }

      return new Response(JSON.stringify(data), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    } catch (error) {
      console.error("Gemini bridge error:", error);
      return errorResponse(500, error && error.message ? error.message : "Gemini bridge failed.");
    }
  };
})();
