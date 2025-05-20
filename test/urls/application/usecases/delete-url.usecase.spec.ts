import { DeleteUrl } from '@/urls/application/usecases/delete-url.usecase';
import {
  NotFoundException,
  UnauthorizedException,
  GoneException,
} from '@nestjs/common';

describe('DeleteUrl', () => {
  let deleteUrl: DeleteUrl;

  const mockUrlRepo = {
    findById: jest.fn(),
    delete: jest.fn(),
  };

  const fakeUser = { id: 'hashId', email: 'user@example.com' } as any;

  beforeEach(() => {
    deleteUrl = new DeleteUrl();
    (deleteUrl as any).urlRepo = mockUrlRepo;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should throw NotFoundException if URL does not exist', async () => {
    mockUrlRepo.findById.mockResolvedValue(null);

    await expect(
      deleteUrl.execute({ user: fakeUser, urlId: '123' }),
    ).rejects.toThrow(NotFoundException);
  });

  it('should throw UnauthorizedException if user is not the owner', async () => {
    const anotherUser = { id: 'another-hash' };
    mockUrlRepo.findById.mockResolvedValue({ user: anotherUser });

    await expect(
      deleteUrl.execute({ user: fakeUser, urlId: '123' }),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('should throw GoneException if URL is deleted', async () => {
    const url = { user: fakeUser, deletedAt: new Date() };
    mockUrlRepo.findById.mockResolvedValue(url);

    await expect(
      deleteUrl.execute({ user: fakeUser, urlId: '123' }),
    ).rejects.toThrow(GoneException);
  });

  it('should throw GoneException if URL is expired', async () => {
    const expiredUrl = {
      user: fakeUser,
      deletedAt: null,
      expiresAt: new Date(Date.now() - 1000),
    };
    mockUrlRepo.findById.mockResolvedValue(expiredUrl);

    await expect(
      deleteUrl.execute({ user: fakeUser, urlId: '123' }),
    ).rejects.toThrow(GoneException);
  });

  it('should delete URL if all conditions are met', async () => {
    const validUrl = {
      user: fakeUser,
      deletedAt: null,
      expiresAt: null,
    };

    mockUrlRepo.findById.mockResolvedValue(validUrl);
    mockUrlRepo.delete.mockResolvedValue({ success: true });

    const result = await deleteUrl.execute({ user: fakeUser, urlId: '123' });

    expect(mockUrlRepo.delete).toHaveBeenCalledWith(validUrl);
    expect(result).toEqual({ success: true });
  });
});
