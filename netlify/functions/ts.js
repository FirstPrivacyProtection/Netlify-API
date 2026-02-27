exports.handler = async () => {
  const now = Date.now();
  const date = new Date(now);
  const sj = date.toLocaleString('en-GB', { timeZone: 'Asia/Singapore' }).replace(/(\d+)\/(\d+)\/(\d+), (\d+:\d+:\d+)/, '$3-$2-$1T$4') + '+08:00';
  return { statusCode: 200, body: JSON.stringify({ ts: now, sj }) };
};
