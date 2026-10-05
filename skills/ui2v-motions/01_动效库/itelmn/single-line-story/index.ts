/** Cloudflare Worker entry point for the Plotbeat website. */
import handler from "vinext/server/app-router-entry";

interface Env {
  ASSETS: Fetcher;
}

interface ExecutionContext {
  waitUntil(promise: Promise<unknown>): void;
  passThroughOnException(): void;
}

const worker = {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    const localeMatch = url.pathname.match(/^\/(zh|ja|ko|es|de|fr|pt)(?:\/|$)/);
    const headers = new Headers(request.headers);
    headers.set("x-plotbeat-locale", localeMatch?.[1] ?? "en");
    return handler.fetch(new Request(request, { headers }), env, ctx);
  },
};

export default worker;
