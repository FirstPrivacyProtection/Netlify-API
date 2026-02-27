const { getTimeData } = require("../lib/ts");
const { getIPData } = require("../lib/ip");

/**
 * 统一JSON响应
 * @param {number} statusCode HTTP状态码
 * @param {object|string} body 响应体
 */
function resJson(statusCode, body) {
  return {
    statusCode,
    headers: { "Content-Type": "application/json" },
    body: typeof(body) === "string" ? body : JSON.stringify(body)
  };
}

/**
 * 普通错误响应
 * @param {number} statusCode 
 * @param {string} message 
 */
function resError(statusCode, message) {
  return resJson(statusCode, { error: message });
}

/**
 * JSON-RPC成功响应
 * @param {string|number|null} id 
 * @param {object} result 
 */
function resRpc(id, result) {
  return resJson(200, {
    jsonrpc: "2.0",
    id,
    result
  });
}

/**
 * JSON-RPC错误响应
 * @param {string|number|null} id 
 * @param {number} code 
 * @param {string} message 
 */
function resRpcError(id, code, message) {
  return resJson(400, {
    jsonrpc: "2.0",
    id,
    error: {
      code,
      message
    }
  });
}

exports.handler = async (event) => {

  if (event.httpMethod !== "POST") {
    return resError(405, "Method Not Allowed");
  }

  let req;

  try {
    req = JSON.parse(event.body || "{}");
  } catch (e) {
    return resError(400, "Invalid JSON");
  }

  // ===== notification（必须支持）=====
  if (req.method === "notifications/initialized") {
    return resJson(200, "");
  }

  // ===== initialize =====
  if (req.method === "initialize") {
    return resRpc(req.id, {
      protocolVersion: "2024-11-05",
      capabilities: { tools: {} },
      serverInfo: {
        name: "netlify-mcp",
        version: "1.0.0"
      }
    });
  }

  // ===== tools/list =====
  if (req.method === "tools/list") {
    return resRpc(req.id, {
      tools: [
        {
          name: "getNowTime",
          description: "获取当前时间、时区（无完整时区名称，仅保证ISO8601时区偏移正确可用）、时间戳",
          inputSchema: {
            type: "object",
            properties: {},
            required: []
          }
        },
        {
          name: "getIP",
          description: "获取当前IP地址",
          inputSchema: {
            type: "object",
            properties: {},
            required: []
          }
        }
      ]
    });
  }

  // ===== tools/call =====
  if (req.method === "tools/call") {

    const toolName = req.params?.name;

    if (toolName === "getNowTime") {
      return resRpc(req.id, getTimeData());
    }

    if (toolName === "getIP") {
      return resRpc(req.id, getIPData(event));
    }
  }

  return resRpcError(req?.id, -32601, "Method not found");
};
