import { User } from '@/users/domain/entities/user.entity';
import {
  GoneException,
  Inject,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { IUrlRepository } from '../repositories/urls.repository';

export type DeactivateUrlInput = {
  user: User;
  urlId: string;
};

export class DeactivateUrl {
  @Inject(IUrlRepository)
  private readonly urlRepo: IUrlRepository;

  async execute(data: DeactivateUrlInput) {
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

    return await this.urlRepo.deactivateUrl(url);
  }
}
