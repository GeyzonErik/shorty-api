import { UpdateUrl } from '@/urls/application/usecases/update-url.usecase';
import {
  NotFoundException,
  UnauthorizedException,
  GoneException,
} from '@nestjs/common';

describe('UpdateUrl', () => {
  let updateUrl: UpdateUrl;

  const mockUrlRepo = {
    findById: jest.fn(),
    updateUrl: jest.fn(),
  };

  const fakeUser = { id: 'elfs-hash', email: 'user@example.com' } as any;

  beforeEach(() => {
    updateUrl = new UpdateUrl();
    (updateUrl as any).urlRepo = mockUrlRepo;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should throw NotFoundException if URL does not exist', async () => {
    mockUrlRepo.findById.mockResolvedValue(null);

    await expect(
      updateUrl.execute({
        user: fakeUser,
        urlId: '123',
        orginalUrl: 'https://new-url.com',
      }),
    ).rejects.toThrow(NotFoundException);
  });

  it('should throw NotFoundException if URL is not active', async () => {
    mockUrlRepo.findById.mockResolvedValue({
      isActive: false,
    });

    await expect(
      updateUrl.execute({
        user: fakeUser,
        urlId: '123',
        orginalUrl: 'https://new-url.com',
      }),
    ).rejects.toThrow(NotFoundException);
  });

  it('should throw UnauthorizedException if user is not the owner', async () => {
    const anotherUser = { id: 2 };
    mockUrlRepo.findById.mockResolvedValue({
      isActive: true,
      user: anotherUser,
    });

    await expect(
      updateUrl.execute({
        user: fakeUser,
        urlId: '123',
        orginalUrl: 'https://new-url.com',
      }),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('should throw GoneException if URL is deleted', async () => {
    const url = {
      isActive: true,
      user: fakeUser,
      deletedAt: new Date(),
    };
    mockUrlRepo.findById.mockResolvedValue(url);

    await expect(
      updateUrl.execute({
        user: fakeUser,
        urlId: '123',
        orginalUrl: 'https://new-url.com',
      }),
    ).rejects.toThrow(GoneException);
  });

  it('should throw GoneException if URL is expired', async () => {
    const url = {
      isActive: true,
      user: fakeUser,
      deletedAt: null,
      expiresAt: new Date(Date.now() - 1000),
    };
    mockUrlRepo.findById.mockResolvedValue(url);

    await expect(
      updateUrl.execute({
        user: fakeUser,
        urlId: '123',
        orginalUrl: 'https://new-url.com',
      }),
    ).rejects.toThrow(GoneException);
  });

  it('should update originalUrl and call updateUrl if all conditions are met', async () => {
    const url = {
      isActive: true,
      user: fakeUser,
      deletedAt: null,
      expiresAt: null,
      originalUrl: 'https://old.com',
    };

    mockUrlRepo.findById.mockResolvedValue(url);
    mockUrlRepo.updateUrl.mockResolvedValue({
      ...url,
      originalUrl: 'https://new-url.com',
    });

    const result = await updateUrl.execute({
      user: fakeUser,
      urlId: '123',
      orginalUrl: 'https://new-url.com',
    });

    expect(url.originalUrl).toBe('https://new-url.com');
    expect(mockUrlRepo.updateUrl).toHaveBeenCalledWith(url);
    expect(result).toEqual({ ...url, originalUrl: 'https://new-url.com' });
  });
});
