export interface Env {
    OPENROUTER_API_KEY: string;
    GOOGLE_AI_STUDIO_KEY: string;
}

export default {
    async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
        const url = new URL(request.url);
        const path = url.pathname;

        if (request.method !== "POST") {
            return new Response("Only POST allowed", { status: 405 });
        }

        try {
            if (path === "/v1/openrouter") {
                return await proxyToOpenRouter(request, env.OPENROUTER_API_KEY);
            } else if (path === "/v1/googleai") {
                return await proxyToGoogleAI(request, env.GOOGLE_AI_STUDIO_KEY);
            }

            return new Response("Not Found", { status: 404 });
        } catch (error) {
            return new Response(JSON.stringify({ error: (error as Error).message }), {
                status: 500,
                headers: { "Content-Type": "application/json" }
            });
        }
    },
};

async function proxyToOpenRouter(request: Request, apiKey: string): Promise<Response> {
    const body = await request.json();
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json",
            "HTTP-Referer": "https://orasync.site",
            "X-Title": "Orasync Nova Proxy"
        },
        body: JSON.stringify(body)
    });
    return response;
}

async function proxyToGoogleAI(request: Request, apiKey: string): Promise<Response> {
    const body = await request.json();
    const url = new URL(request.url);
    const model = url.searchParams.get("model") || "gemini-1.5-flash";
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    });
    return response;
}
