const AppError = require('../errors/AppError');

function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query,
    });

    if (!result.success) {
      const details = result.error.issues.map((issue) => issue.message).join(', ');
      return next(new AppError(details, 400));
    }

    req.validated = result.data;
    return next();
  };
}

module.exports = validate;
