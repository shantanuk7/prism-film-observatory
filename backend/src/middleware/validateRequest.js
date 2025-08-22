const { ZodError } = require('zod');

const validate = (schema) => (req, res, next) => {
  try {
    const data = {
      body: req.body,
      query: req.query,
      params: req.params
    };
    schema.parse(data);
    next();
  } catch (err) {
    if (err instanceof ZodError) {
      return res.status(400).json({ message: 'Validation failed', errors: err.errors });
    }
    next(err);
  }
};

module.exports = { validate };