import { ValidateBy, ValidationOptions } from 'class-validator';

export function MaxUtf8Bytes(
  maxBytes: number,
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return ValidateBy(
    {
      name: 'maxUtf8Bytes',
      constraints: [maxBytes],
      validator: {
        validate(value: unknown): boolean {
          return (
            typeof value === 'string' &&
            Buffer.byteLength(value, 'utf8') <= maxBytes
          );
        },
        defaultMessage(): string {
          return `password must be no longer than ${maxBytes} UTF-8 bytes`;
        },
      },
    },
    validationOptions,
  );
}
