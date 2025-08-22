const { prisma } = require('../../config/db');
const { hashPassword, comparePassword } = require('../../utils/hashPassword');
const { generateAccessToken, generateRefreshToken } = require("../../utils/generateToken");
const jwt = require('jsonwebtoken');

async function signup({ username, email, password, role = 'OBSERVER' }) {
  const existing = await prisma.user.findFirst({ where: { OR: [{ email }, { username }] } });
  if (existing) throw new Error('Email or username already in use');
  const passwordHash = await hashPassword(password);
  const user = await prisma.user.create({ data: { username, email, passwordHash, role } });
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);
  const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt: new Date(decoded.exp * 1000)
    }
  });
  return { user: sanitize(user), accessToken, refreshToken };
}

async function login({ email, password }) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error('Invalid credentials');
  const ok = await comparePassword(password, user.passwordHash);
  if (!ok) throw new Error('Invalid credentials');
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);
  const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
  await prisma.refreshToken.create({
    data: { token: refreshToken, userId: user.id, expiresAt: new Date(decoded.exp * 1000) }
  });
  return { user: sanitize(user), accessToken, refreshToken };
}

async function refresh({ refreshToken }) {
  const record = await prisma.refreshToken.findUnique({ where: { token: refreshToken } });
  if (!record) throw new Error('Invalid refresh token');
  try {
    const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const user = await prisma.user.findUnique({ where: { id: Number(payload.sub) } });
    if (!user) throw new Error('User not found');

    // Rotate token: delete old, issue new
    await prisma.refreshToken.delete({ where: { token: refreshToken } });

    const newAccess = generateAccessToken(user);
    const newRefresh = generateRefreshToken(user);
    const decoded = jwt.verify(newRefresh, process.env.REFRESH_TOKEN_SECRET);
    await prisma.refreshToken.create({
      data: { token: newRefresh, userId: user.id, expiresAt: new Date(decoded.exp * 1000) }
    });
    return { accessToken: newAccess, refreshToken: newRefresh };
  } catch (e) {
    // revoke invalid
    await prisma.refreshToken.deleteMany({ where: { token: refreshToken } });
    throw new Error('Invalid or expired refresh token');
  }
}

async function logout({ refreshToken, userId }) {
  await prisma.refreshToken.deleteMany({ where: { token: refreshToken, userId } });
  return { ok: true };
}

function sanitize(user) {
  const { passwordHash, ...safe } = user;
  return safe;
}

module.exports = { signup, login, refresh, logout };