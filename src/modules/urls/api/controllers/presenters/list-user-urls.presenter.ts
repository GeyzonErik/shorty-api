import { Url } from '@/urls/domain/entities/url.entity';

export class ListUserUrlsPresenter {
  static toHTTP(data: Url) {
    const port = process.env.PORT;

    const baseUrl = process.env.BASE_URL || `http://localhost:${port}/`;

    return {
      originalUrl: data.originalUrl,
      url: `${baseUrl}${data.slug}`,
      visits: data.visits,
    };
  }
}
