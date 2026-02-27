import ts from "../../functions/ts.js";
import ip from "../../functions/ip.js";

export default async () => {

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {

      const send = (data) => {
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify(data)}\n\n`)
        );
      };

      // MCP 初始化
      send({
        jsonrpc: "2.0",
        method: "initialize",
        result: {
          protocolVersion: "2024-11-05",
          capabilities: { tools: {} },
          serverInfo: { name: "edge-mcp", version: "1.0.0" }
        }
      });

      // tools list
      send({
        jsonrpc: "2.0",
        method: "tools/list",
        result: {
          tools: [
            {
              name: "getNowTime",
              description: "获取当前的时间、时区、时间戳",
              inputSchema: { type: "object", properties: {} }
            },
            {
              name: "getIP",
              description: "获取当前IP地址",
              inputSchema: { type: "object", properties: {} }
            }
          ]
        }
      });

      controller.close();
    }
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive"
    }
  });
};
