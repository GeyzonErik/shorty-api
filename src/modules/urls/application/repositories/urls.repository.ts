import { Url } from '@/urls/domain/entities/url.entity';

export abstract class IUrlRepository {
  abstract create(data: Url): Promise<Url>;
  abstract existsSlug(slug: string): Promise<boolean>;
  abstract findBySlug(slug: string): Promise<Url | null>;
  abstract incrementVisit(data: Url): Promise<void>;
}
