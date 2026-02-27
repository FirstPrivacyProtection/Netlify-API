// netlify/functions/sse.js

const ts = require("./ts");
const ip = require("./ip");

exports.handler = async (event) => {

  const headers = {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    "Connection": "keep-alive"
  };

  const send = (data) => `data: ${JSON.stringify(data)}\n\n`;

  const stream = new ReadableStream({
    async start(controller) {

      // 1️⃣ 发送 MCP 初始化响应
      controller.enqueue(send({
        jsonrpc: "2.0",
        method: "initialize",
        result: {
          protocolVersion: "2024-11-05",
          capabilities: {
            tools: {}
          },
          serverInfo: {
            name: "netlify-sse-mcp",
            version: "1.0.0"
          }
        }
      }));

      // 2️⃣ 声明工具列表
      controller.enqueue(send({
        jsonrpc: "2.0",
        method: "tools/list",
        result: {
          tools: [
            {
              name: "getNowTime",
              description: "获取当前的时间、时区、时间戳",
              inputSchema: {
                type: "object",
                properties: {},
                required: []
              }
            },
            {
              name: "getIP",
              description: "获取当前的IP地址",
              inputSchema: {
                type: "object",
                properties: {},
                required: []
              }
            }
          ]
        }
      }));

      // 3️⃣ 示例：主动推送工具结果（可选）
      const tsRes = await ts.handler();
      const ipRes = await ip.handler();

      controller.enqueue(send({
        jsonrpc: "2.0",
        method: "tools/call",
        params: {
          name: "getNowTime",
          result: JSON.parse(tsRes.body)
        }
      }));

      controller.enqueue(send({
        jsonrpc: "2.0",
        method: "tools/call",
        params: {
          name: "getIP",
          result: JSON.parse(ipRes.body)
        }
      }));

    }
  });

  return {
    statusCode: 200,
    headers,
    body: stream
  };
};
