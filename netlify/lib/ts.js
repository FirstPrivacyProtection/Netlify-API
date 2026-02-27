// netlify/lib/ts.js
function getTimeData() {
  const now = Date.now();
  const date = new Date(now);

  const sj = date
    .toLocaleString("en-GB", { timeZone: "Asia/Singapore" })
    .replace(/(\d+)\/(\d+)\/(\d+), (\d+:\d+:\d+)/,
      "$3-$2-$1T$4"
    ) + "+08:00";

  return {
    timestamp: now,
    timezone: "Asia/Singapore",
    timeNow: sj
  };
}

module.exports = { getTimeData };
