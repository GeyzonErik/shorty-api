import { User } from '@/users/domain/entities/user.entity';
import { Url } from '../entities/url.entity';
import { randomUUID } from 'crypto';

export class UrlBuilder {
  private url!: Url;

  private static newInstace(): UrlBuilder {
    return new UrlBuilder();
  }

  static create(data: UrlData): UrlBuilder {
    const builder = this.newInstace();
    builder.url = new Url();
    builder.url.id = randomUUID();
    builder.url.user = data.user;
    builder.url.originalUrl = data.originalUrl;
    return builder;
  }

  async withUniqueSlug(
    existsSlug: (slug: string) => Promise<boolean>,
  ): Promise<Url> {
    let slug: string;
    let exists = true;

    do {
      slug = this.generateSlug();
      exists = await existsSlug(slug);
    } while (exists);

    this.url.slug = slug;
    return this.url;
  }

  private generateSlug(length = 6): string {
    const chars =
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let slug = '';
    for (let i = 0; i < length; i++) {
      slug += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return slug;
  }
}

interface UrlData {
  user?: User;
  originalUrl: string;
}
