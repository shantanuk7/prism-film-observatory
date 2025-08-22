const { prisma } = require('../../config/db');
const { comparePassword, hashPassword } = require('../../utils/hashPassword');

async function getMe(userId) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error('User not found');
  const { passwordHash, ...safe } = user;
  return safe;
}

async function updateMe(userId, { username, profilePicUrl }) {
  const data = {};
  if (username) data.username = username;
  if (profilePicUrl) data.profilePic = profilePicUrl;
  const updated = await prisma.user.update({ where: { id: userId }, data });
  const { passwordHash, ...safe } = updated;
  return safe;
}

async function changePassword(userId, currentPassword, newPassword) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error('User not found');
  const ok = await comparePassword(currentPassword, user.passwordHash);
  if (!ok) throw new Error('Current password is incorrect');
  const passwordHash = await hashPassword(newPassword);
  await prisma.user.update({ where: { id: userId }, data: { passwordHash } });
  return { ok: true };
}

module.exports = { getMe, updateMe, changePassword };