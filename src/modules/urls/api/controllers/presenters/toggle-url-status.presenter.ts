import { Url } from '@/urls/domain/entities/url.entity';

export class ToggleUrlStatusPresenter {
  static toHTTP(data: Url) {
    return {
      id: data.id,
      message: `Url successfully ${data.isActive ? 'activated' : 'deactivated'} `,
    };
  }
}
