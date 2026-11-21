export const dynamic = 'force-static';
export const revalidate = 86400;

const serverCard = {
  $schema: "https://static.modelcontextprotocol.io/schemas/v1/server-card.schema.json",
  name: "ingress-within",
  title: "Ingress Within MCP Server",
  version: "1.0.0",
  description: "Unified psychological care and mental health platform MCP server providing tools for guided reflection, psychoeducation, and practitioner discovery.",
  endpoint: "https://ingresswithin.com/api/mcp",
  homepage: "https://ingresswithin.com",
  capabilities: {
    tools: {
      list: true,
    },
    resources: {
      subscribe: false,
      list: true,
    },
    prompts: {
      list: true,
    },
  },
  remotes: [
    {
      type: "streamable-http",
      url: "https://ingresswithin.com/api/mcp",
      endpoint: "https://ingresswithin.com/api/mcp",
    },
  ],
};

export async function GET() {
  return new Response(JSON.stringify(serverCard, null, 2), {
    status: 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, stale-while-revalidate=43200',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
