import { UrlPgRepository } from '@/urls/data/repositories/mikro-orm/urls.pg.repository';
import { Url } from '@/urls/domain/entities/url.entity';
import { EntityManager } from '@mikro-orm/postgresql';

describe('UrlPgRepository', () => {
  let repo: UrlPgRepository;
  let em: jest.Mocked<EntityManager>;

  const fakeUser = { id: 'hashed-id', email: 'test@example.com' } as any;
  const fakeUrl = {
    id: 'url-123',
    slug: 'abc123',
    user: fakeUser,
    originalUrl: 'https://example.com',
    visits: 0,
    isActive: true,
  } as Url;

  beforeEach(() => {
    em = {
      create: jest.fn(),
      persistAndFlush: jest.fn(),
      findOne: jest.fn(),
      findOneOrFail: jest.fn(),
      nativeUpdate: jest.fn(),
      findAll: jest.fn(),
    } as unknown as jest.Mocked<EntityManager>;

    repo = new UrlPgRepository();
    (repo as any).entityManager = em;
  });

  it('should create a URL and persist it', async () => {
    em.create.mockReturnValue(fakeUrl);
    await repo.create(fakeUrl);
    expect(em.create).toHaveBeenCalledWith(Url, fakeUrl);
    expect(em.persistAndFlush).toHaveBeenCalledWith(fakeUrl);
  });

  it('should check if slug exists', async () => {
    em.findOne.mockResolvedValue(fakeUrl);
    const result = await repo.existsSlug('abc123');
    expect(em.findOne).toHaveBeenCalledWith(Url, { slug: 'abc123' });
    expect(result).toBe(true);
  });

  it('should return false if slug does not exist', async () => {
    em.findOne.mockResolvedValue(null);
    const result = await repo.existsSlug('abc123');
    expect(result).toBe(false);
  });

  it('should find a URL by slug with filters', async () => {
    em.findOne.mockResolvedValue(fakeUrl);
    const result = await repo.findBySlug('abc123');
    expect(em.findOne).toHaveBeenCalledWith(Url, {
      slug: 'abc123',
      isActive: true,
      deletedAt: null,
    });
    expect(result).toBe(fakeUrl);
  });

  it('should find a URL by id excluding deleted', async () => {
    em.findOne.mockResolvedValue(fakeUrl);
    const result = await repo.findById('url-123');
    expect(em.findOne).toHaveBeenCalledWith(Url, {
      id: 'url-123',
      deletedAt: null,
    });
    expect(result).toBe(fakeUrl);
  });

  it('should increment visits of a URL', async () => {
    await repo.incrementVisit({ ...fakeUrl, visits: 5 });
    expect(em.nativeUpdate).toHaveBeenCalledWith(
      Url,
      { id: fakeUrl.id },
      { visits: 6 },
    );
  });

  it('should list URLs for a user with active filter', async () => {
    em.findAll.mockResolvedValue([fakeUrl]);
    const result = await repo.listUserUrls({ user: fakeUser, active: true });
    expect(em.findAll).toHaveBeenCalledWith(Url, {
      where: {
        user: fakeUser,
        isActive: true,
        deletedAt: null,
      },
    });
    expect(result).toEqual([fakeUrl]);
  });

  it('should update a URL and return the new entity', async () => {
    em.findOneOrFail.mockResolvedValue(fakeUrl);
    const updated = await repo.updateUrl(fakeUrl);
    expect(em.nativeUpdate).toHaveBeenCalledWith(
      Url,
      { id: fakeUrl.id },
      expect.objectContaining({
        visits: 0,
        updatedAt: expect.any(Date),
      }),
    );
    expect(em.findOneOrFail).toHaveBeenCalledWith(Url, { id: fakeUrl.id });
    expect(updated).toBe(fakeUrl);
  });

  it('should logically delete a URL', async () => {
    await repo.delete(fakeUrl);
    expect(em.nativeUpdate).toHaveBeenCalledWith(
      Url,
      { id: fakeUrl.id },
      expect.objectContaining({
        isActive: false,
        deletedAt: expect.any(Date),
      }),
    );
  });
});
