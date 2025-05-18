import { CreateUrlOutput } from '@/urls/application/usecases/create-url.usecase';

export class CreateUrlPresenter {
  static toHTTP(data: CreateUrlOutput) {
    const baseUrl = process.env.BASE_URL || 'http://localhost:3000/';

    return {
      message: 'URL successfully created',
      url: `${baseUrl}${data.slug}`,
    };
  }
}
