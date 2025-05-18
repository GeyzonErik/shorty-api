import { Inject, Injectable } from '@nestjs/common';
import { IUrlRepository } from '../repositories/urls.repository';
import { UrlBuilder } from '@/urls/domain/builders/url.builder';
import { User } from '@/users/domain/entities/user.entity';

export type CreateUrlInput = {
  user?: User;
  originalUrl: string;
};

export type CreateUrlOutput = {
  slug: string;
  visits: number;
};

@Injectable()
export class CreateUrl {
  @Inject(IUrlRepository)
  private readonly urlRepo: IUrlRepository;

  async execute(data: CreateUrlInput): Promise<CreateUrlOutput> {
    const url = await UrlBuilder.create(data).withUniqueSlug(
      this.urlRepo.existsSlug.bind(this.urlRepo),
    );

    const newUrl = await this.urlRepo.create(url);

    return {
      slug: newUrl.slug,
      visits: newUrl.visits,
    };
  }
}
