import { User } from '@/users/domain/entities/user.entity';
import { EventSubscriber, EntityName, EventArgs } from '@mikro-orm/core';

export class NormalizeFieldsSubscriber implements EventSubscriber {
  private LOWERCASE_EXCEPTIONS = [
    'da',
    'das',
    'de',
    'do',
    'dos',
    "l'",
    'e',
    'em',
    'com',
    'a',
    'o',
    'ao',
    'aos',
    'na',
    'no',
  ];

  getSubscribedEntities(): EntityName<unknown>[] {
    return [User];
  }

  beforeCreate<T>(args: EventArgs<T>): void {
    this.normalize(args.entity);
  }

  beforeUpdate<T>(args: EventArgs<T>): void {
    this.normalize(args.entity);
  }

  private normalize<T>(entity: T) {
    const capitalize = (text?: string): string =>
      (text || '')
        .split(' ')
        .map((word) =>
          this.LOWERCASE_EXCEPTIONS.includes(word.toLowerCase())
            ? word.toLowerCase()
            : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
        )
        .join(' ');

    if (entity instanceof User) {
      entity.name = capitalize(entity.name);
    }
  }
}
