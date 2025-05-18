import { User } from '@/users/domain/entities/user.entity';
import { Inject } from '@nestjs/common';
import { IUrlRepository } from '../repositories/urls.repository';
import { Url } from '@/urls/domain/entities/url.entity';

export type ListUserUrlsInput = {
  user: User;
  active: boolean;
};

export class ListUserUrls {
  @Inject(IUrlRepository)
  private readonly urlRepo: IUrlRepository;

  async execute(data: ListUserUrlsInput): Promise<Url[]> {
    return this.urlRepo.listUserUrls({
      user: data.user,
      active: data.active,
    });
  }
}
