import { GoneException, Inject, NotFoundException } from '@nestjs/common';
import { IUrlRepository } from '../repositories/urls.repository';

export type GetOrignalUrlInput = {
  slug: string;
};

export class GetOrignalUrl {
  @Inject(IUrlRepository)
  private readonly urlRepo: IUrlRepository;

  async execute(data: GetOrignalUrlInput) {
    const url = await this.urlRepo.findBySlug(data.slug);

    if (!url) {
      throw new NotFoundException('Shortened URL not found');
    }

    if (url.expiresAt && url.expiresAt < new Date()) {
      throw new GoneException('Expired URl');
    }

    await this.urlRepo.incrementVisit(url);

    return url.originalUrl;
  }
}
