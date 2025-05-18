import { IUserRepository } from '@/users/application/repositories/user.repository';
import { User } from '@/users/domain/entities/user.entity';
import {
  GoneException,
  Inject,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { IUrlRepository } from '../repositories/urls.repository';

export type UpdateUrlInput = {
  user: User;
  urlId: string;
  orginalUrl: string;
};

export class UpdateUrl {
  @Inject(IUserRepository)
  private readonly userRepo: IUserRepository;
  @Inject(IUrlRepository)
  private readonly urlRepo: IUrlRepository;

  async executer(data: UpdateUrlInput) {
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

    url.originalUrl = data.orginalUrl;

    return await this.urlRepo.updateUrl(url);
  }
}
