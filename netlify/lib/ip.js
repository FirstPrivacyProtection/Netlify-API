// netlify/lib/ip.js
function getIPData(event) {
  const ip =
    event.headers["x-forwarded-for"] ||
    event.headers["client-ip"] ||
    "unknown";

  return { ip };
}

module.exports = { getIPData };
