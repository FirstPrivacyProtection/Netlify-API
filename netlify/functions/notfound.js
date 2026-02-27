exports.handler = async () => {
  return { statusCode: 404, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ error: 'Not Found' }) };
};
