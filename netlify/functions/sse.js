exports.handler = async (event, context) => {
  const headers = {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  };

  const sendEvent = (data) => `data: ${JSON.stringify(data)}\n\n`;

  // Simulate MCP tools
  const getNowTime = async () => {
    const res = await fetch(`${process.env.URL}/ts`);
    return await res.json();
  };

  const getIP = async () => {
    const res = await fetch(`${process.env.URL}/ip`);
    return await res.json();
  };

  // Send initial data
  const stream = new ReadableStream({
    async start(controller) {
      controller.enqueue(sendEvent({ tool: 'getNowTime', data: await getNowTime() }));
      controller.enqueue(sendEvent({ tool: 'getIP', data: await getIP() }));
      // Add periodic updates if needed
      const interval = setInterval(async () => {
        controller.enqueue(sendEvent({ tool: 'getNowTime', data: await getNowTime() }));
      }, 5000);

      controller.close = () => clearInterval(interval);
    }
  });

  return { statusCode: 200, headers, body: stream };
};
