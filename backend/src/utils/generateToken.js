const jwt = require('jsonwebtoken');

function generateAccessToken(user) {
  const ttl = process.env.ACCESS_TOKEN_TTL || '15m';
  return jwt.sign({ role: user.role }, process.env.ACCESS_TOKEN_SECRET, {
    subject: String(user.id),
    expiresIn: ttl
  });
}

function generateRefreshToken(user, days = Number(process.env.REFRESH_TOKEN_TTL_DAYS || 7)) {
  return jwt.sign({ role: user.role }, process.env.REFRESH_TOKEN_SECRET, {
    subject: String(user.id),
    expiresIn: `${days}d`
  });
}

module.exports = { generateAccessToken, generateRefreshToken };