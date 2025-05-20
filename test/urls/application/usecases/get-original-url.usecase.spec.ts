import { GetOrignalUrl } from '@/urls/application/usecases/get-original-url.usecase';
import { NotFoundException, GoneException } from '@nestjs/common';

describe('GetOrignalUrl', () => {
  let getOriginalUrl: GetOrignalUrl;

  const mockUrlRepo = {
    findBySlug: jest.fn(),
    incrementVisit: jest.fn(),
  };

  beforeEach(() => {
    getOriginalUrl = new GetOrignalUrl();
    (getOriginalUrl as any).urlRepo = mockUrlRepo;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should throw NotFoundException if URL does not exist', async () => {
    mockUrlRepo.findBySlug.mockResolvedValue(null);

    await expect(getOriginalUrl.execute({ slug: 'abc123' })).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should throw GoneException if URL is expired', async () => {
    const expiredUrl = {
      expiresAt: new Date(Date.now() - 1000),
    };

    mockUrlRepo.findBySlug.mockResolvedValue(expiredUrl);

    await expect(getOriginalUrl.execute({ slug: 'abc123' })).rejects.toThrow(
      GoneException,
    );
  });

  it('should increment visit and return original URL if valid', async () => {
    const url = {
      expiresAt: null,
      originalUrl: 'https://example.com',
    };

    mockUrlRepo.findBySlug.mockResolvedValue(url);

    const result = await getOriginalUrl.execute({ slug: 'abc123' });

    expect(mockUrlRepo.incrementVisit).toHaveBeenCalledWith(url);
    expect(result).toBe('https://example.com');
  });
});
