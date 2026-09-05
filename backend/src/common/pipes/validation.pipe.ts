import {
  BadRequestException,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import { ErrorCode } from '../errors/error-code.js';

type ValidationDetail = {
  field: string;
  messages: string[];
};

function flattenValidationErrors(
  errors: ValidationError[],
  parent = '',
): ValidationDetail[] {
  return errors.flatMap((error) => {
    const field = parent ? `${parent}.${error.property}` : error.property;
    const current = error.constraints
      ? [{ field, messages: Object.values(error.constraints) }]
      : [];

    return [
      ...current,
      ...flattenValidationErrors(error.children ?? [], field),
    ];
  });
}

export function createValidationPipe(): ValidationPipe {
  return new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
    exceptionFactory: (errors) =>
      new BadRequestException({
        code: ErrorCode.ValidationError,
        message: 'Request validation failed',
        details: flattenValidationErrors(errors),
      }),
  });
}
