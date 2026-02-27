exports.handler = async (event) => {
  const ip = event.headers['x-nf-client-connection-ip'] || 'unknown';
  return { statusCode: 200, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ip }) };
};
