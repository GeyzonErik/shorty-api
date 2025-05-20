import { CreateUrl } from '@/urls/application/usecases/create-url.usecase';
import { UrlBuilder } from '@/urls/domain/builders/url.builder';
import { User } from '@/users/domain/entities/user.entity';

jest.mock('../../../../src/modules/urls/domain/builders/url.builder');

describe('CreateUrl', () => {
  let createUrl: CreateUrl;

  const mockUrlRepo = {
    existsSlug: jest.fn(),
    create: jest.fn(),
  };

  beforeEach(() => {
    createUrl = new CreateUrl();
    (createUrl as any).urlRepo = mockUrlRepo;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a new URL and return slug and visits', async () => {
    const input = {
      originalUrl: 'https://example.com/some-long-url',
      user: {
        id: 1,
        email: 'user@example.com',
      } as unknown as User,
    };

    const builtUrl = {
      slug: 'abc123',
      visits: 0,
    };

    (UrlBuilder.create as jest.Mock).mockReturnValue({
      withUniqueSlug: jest.fn().mockResolvedValue(builtUrl),
    });

    mockUrlRepo.create.mockResolvedValue(builtUrl);

    const result = await createUrl.execute(input);

    expect(UrlBuilder.create).toHaveBeenCalledWith(input);
    expect(mockUrlRepo.create).toHaveBeenCalledWith(builtUrl);
    expect(result).toEqual({ slug: 'abc123', visits: 0 });
  });
});
