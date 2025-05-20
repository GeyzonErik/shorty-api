import { ListUserUrls } from '@/urls/application/usecases/list-user-urls.usecase';
import { Url } from '@/urls/domain/entities/url.entity';

describe('ListUserUrls', () => {
  let listUserUrls: ListUserUrls;

  const mockUrlRepo = {
    listUserUrls: jest.fn(),
  };

  const fakeUser = { id: 'some-hash', email: 'user@example.com' } as any;

  beforeEach(() => {
    listUserUrls = new ListUserUrls();
    (listUserUrls as any).urlRepo = mockUrlRepo;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return list of URLs for the user', async () => {
    const mockUrls = [
      { id: 'some-hash', slug: 'abc123', user: fakeUser } as Url,
      { id: 'another-hash', slug: 'xyz789', user: fakeUser } as Url,
    ];

    mockUrlRepo.listUserUrls.mockResolvedValue(mockUrls);

    const result = await listUserUrls.execute({ user: fakeUser, active: true });

    expect(mockUrlRepo.listUserUrls).toHaveBeenCalledWith({
      user: fakeUser,
      active: true,
    });

    expect(result).toEqual(mockUrls);
  });
});
