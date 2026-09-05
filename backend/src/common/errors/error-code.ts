export const ErrorCode = {
  ValidationError: 'VALIDATION_ERROR',
  UserAlreadyExists: 'USER_ALREADY_EXISTS',
  InternalServerError: 'INTERNAL_SERVER_ERROR',
} as const;

export type ErrorCode = (typeof ErrorCode)[keyof typeof ErrorCode];
