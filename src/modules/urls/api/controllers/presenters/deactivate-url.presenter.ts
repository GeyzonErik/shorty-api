import { Url } from '@/urls/domain/entities/url.entity';

export class DeactivateUrlPresenter {
  static toHTTP(data: Url) {
    return {
      id: data.id,
      message: 'Url successfully deactivated',
    };
  }
}
