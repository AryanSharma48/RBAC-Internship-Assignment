const Joi = require('joi');
const ErrorResponse = require('../utils/ErrorResponse');

const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) {
    const message = error.details.map(i => i.message).join(',');
    return next(new ErrorResponse(message, 400));
  }
  next();
};

module.exports = validate;
