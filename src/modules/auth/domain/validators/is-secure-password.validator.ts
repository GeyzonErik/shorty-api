import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsSecurePassword(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isStrongPassword',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, _arguments: ValidationArguments) {
          if (typeof value !== 'string') return false;

          const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
          return regex.test(value);
        },
        defaultMessage(_arguments: ValidationArguments): string {
          return 'Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, and one number.';
        },
      },
    });
  };
}
