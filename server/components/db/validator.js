import Joi from 'joi';
import { BadRequestError } from '../../utils/errors';

const payloadValidator = schema => (req, res, next) => {
  const payload = req.body;
  const { error } = Joi.validate(payload, schema);
  if(error) {
    throw new BadRequestError('Invalid request.');
  }
  next();
};

export default payloadValidator;
