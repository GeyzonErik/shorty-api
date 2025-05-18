import { IUrlRepository } from '@/urls/application/repositories/urls.repository';
import { Url } from '@/urls/domain/entities/url.entity';
import { EntityManager } from '@mikro-orm/postgresql';
import { Inject } from '@nestjs/common';

export class UrlPgRepository implements IUrlRepository {
  @Inject(EntityManager)
  private readonly entityManager: EntityManager;

  async create(data: Url): Promise<Url> {
    console.log(data);

    const url = this.entityManager.create(Url, data);
    await this.entityManager.persistAndFlush(url);
    return url;
  }

  async existsSlug(slug: string): Promise<boolean> {
    const url = await this.entityManager.findOne(Url, { slug });
    return !!url;
  }

  async findBySlug(slug: string): Promise<Url | null> {
    const url = await this.entityManager.findOne(Url, {
      slug,
      isActive: true,
      deletedAt: null,
    });
    return url;
  }

  async incrementVisit(data: Url): Promise<void> {
    await this.entityManager.nativeUpdate(
      Url,
      { id: data.id },
      {
        visits: data.visits + 1,
        updatedAt: new Date(),
      },
    );
  }
}
