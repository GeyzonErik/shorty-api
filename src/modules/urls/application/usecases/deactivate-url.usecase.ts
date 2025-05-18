import { User } from '@/users/domain/entities/user.entity';
import {
  GoneException,
  Inject,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { IUrlRepository } from '../repositories/urls.repository';

export type ToggleUrlStatusInput = {
  user: User;
  urlId: string;
  active: boolean;
};

export class ToggleUrlStatus {
  @Inject(IUrlRepository)
  private readonly urlRepo: IUrlRepository;

  async execute(data: ToggleUrlStatusInput) {
    const url = await this.urlRepo.findById(data.urlId);

    if (!url || !url.isActive) {
      throw new NotFoundException('Url not found');
    }

    if (url.user !== data.user) {
      throw new UnauthorizedException(
        'You do not have permission to modify this URL.',
      );
    }

    if (url.deletedAt || (url.expiresAt && url.expiresAt < new Date())) {
      throw new GoneException('Expired URl');
    }

    url.isActive = data.active;

    return await this.urlRepo.updateUrl(url);
  }
}
