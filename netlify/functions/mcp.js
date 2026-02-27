// netlify/functions/mcp.js

const { getTimeData } = require("../lib/ts");
const { getIPData } = require("../lib/ip");

exports.handler = async (event) => {

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        error: "Method Not Allowed"
      })
    };
  }

  let req;

  try {
    req = JSON.parse(event.body || "{}");
  } catch (e) {
    return {
      statusCode: 400,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        error: "Invalid JSON"
      })
    };
  }

  // ===== initialize =====
  if (req.method === "initialize") {
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: req.id,
        result: {
          protocolVersion: "2024-11-05",
          capabilities: {
            tools: {}
          },
          serverInfo: {
            name: "netlify-mcp",
            version: "1.0.0"
          }
        }
      })
    };
  }

  // ===== tools/list =====
  if (req.method === "tools/list") {
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: req.id,
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
      })
    };
  }

  // ===== tools/call =====
  if (req.method === "tools/call") {

    const toolName = req.params?.name;

    if (toolName === "getNowTime") {
      return {
        statusCode: 200,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: req.id,
          result: getTimeData()
        })
      };
    }

    if (toolName === "getIP") {
      return {
        statusCode: 200,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: req.id,
          result: getIPData(event)
        })
      };
    }

    return {
      statusCode: 400,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: req.id,
        error: {
          code: -32601,
          message: "Tool not found"
        }
      })
    };
  }

  return {
    statusCode: 400,
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: req.id,
      error: {
        code: -32601,
        message: "Method not found"
        Method: req.method
      }
    })
  };
};
