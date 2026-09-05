import Joi from 'joi';

export const envValidationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  PORT: Joi.number().port().default(4000),
  DATABASE_URL: Joi.string().uri().required(),
  BCRYPT_ROUNDS: Joi.number().integer().min(10).max(14).default(12),
}).unknown(true);
