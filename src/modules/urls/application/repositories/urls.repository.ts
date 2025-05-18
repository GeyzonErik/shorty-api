import { Url } from '@/urls/domain/entities/url.entity';
import { User } from '@/users/domain/entities/user.entity';

export abstract class IUrlRepository {
  abstract create(data: Url): Promise<Url>;
  abstract existsSlug(slug: string): Promise<boolean>;
  abstract findBySlug(slug: string): Promise<Url | null>;
  abstract incrementVisit(data: Url): Promise<void>;
  abstract listUserUrls(data: { user: User; active?: boolean }): Promise<Url[]>;
}
