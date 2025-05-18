import { CreateUrlOutput } from '@/urls/application/usecases/create-url.usecase';

export class CreateUrlPresenter {
  static toHTTP(data: CreateUrlOutput) {
    const port = process.env.APP_PORT;

    const baseUrl = process.env.BASE_URL || `http://localhost:${port}/`;

    return {
      message: 'URL successfully created',
      url: `${baseUrl}${data.slug}`,
    };
  }
}
