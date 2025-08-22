const { signup, login, refresh, logout } = require('./auth.service');

async function signupController(req, res, next) {
  try {
    const { username, email, password, role } = req.body;
    const out = await signup({ username, email, password, role });
    res.status(201).json(out);
  } catch (e) {
    res.status(400);
    next(e);
  }
}

async function loginController(req, res, next) {
  try {
    const { email, password } = req.body;
    const out = await login({ email, password });
    res.json(out);
  } catch (e) {
    res.status(400);
    next(e);
  }
}

async function refreshController(req, res, next) {
  try {
    const { refreshToken } = req.body;
    const out = await refresh({ refreshToken });
    res.json(out);
  } catch (e) {
    res.status(401);
    next(e);
  }
}

async function logoutController(req, res, next) {
  try {
    const { refreshToken } = req.body;
    const userId = req.user?.id;
    const out = await logout({ refreshToken, userId });
    res.json(out);
  } catch (e) {
    next(e);
  }
}

module.exports = { signupController, loginController, refreshController, logoutController };
