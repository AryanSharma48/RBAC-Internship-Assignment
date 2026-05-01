const ApiError = require('../utils/ApiError');

// Validates req.body against a Joi schema. Strips unknown fields and trims strings.
const validate = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
    convert: true,
  });

  if (error) {
    const message = error.details.map(d => d.message.replace(/"/g, '')).join('. ');
    return next(new ApiError(message, 400));
  }

  req.body = value;
  next();
};

module.exports = validate;
