const router = require('express').Router();
const { searchMovies } = require('./tmdb.service').default;

router.get('/search', async (req, res, next) => {
  try {
    const { q, page } = req.query;
    const data = await searchMovies(q, Number(page || 1));
    res.json(data);
  } catch (e) {
    next(e);
  }
});

module.exports = router;