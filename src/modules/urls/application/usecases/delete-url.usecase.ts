import { User } from '@/users/domain/entities/user.entity';
import {
  GoneException,
  Inject,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { IUrlRepository } from '../repositories/urls.repository';

export type DeleteUrlInput = {
  user: User;
  urlId: string;
};

export class DeleteUrl {
  @Inject(IUrlRepository)
  private readonly urlRepo: IUrlRepository;

  async execute(data: DeleteUrlInput) {
    const url = await this.urlRepo.findById(data.urlId);

    if (!url) {
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

    return await this.urlRepo.delete(url);
  }
}
