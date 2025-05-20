import { IUserRepository } from '@/users/application/repositories/user.repository';
import { UpdateUser } from '@/users/application/usecases/update-user.usecase';
import { User } from '@/users/domain/entities/user.entity';
import { BadRequestException } from '@nestjs/common';

describe('UpdateUser', () => {
  let service: UpdateUser;
  let userRepo: jest.Mocked<IUserRepository>;

  const fakeUser = { id: 'user-123', name: 'Old Name' } as User;
  const updateUserInput = { user: fakeUser, name: 'New Name' };

  beforeEach(() => {
    userRepo = {
      findById: jest.fn(),
      updateUser: jest.fn(),
    } as unknown as jest.Mocked<IUserRepository>;

    service = new UpdateUser();
    (service as any).userRepo = userRepo;
  });

  it('should update the user name successfully', async () => {
    userRepo.findById.mockResolvedValue(fakeUser);
    userRepo.updateUser.mockResolvedValue({
      ...fakeUser,
      name: 'New Name',
    } as unknown as User);

    const result = await service.execute(updateUserInput);

    expect(userRepo.findById).toHaveBeenCalledWith(fakeUser.id);
    expect(userRepo.updateUser).toHaveBeenCalledWith({
      ...fakeUser,
      name: 'New Name',
    });
    expect(result.name).toBe('New Name');
  });

  it('should throw a BadRequestException if user is not found', async () => {
    userRepo.findById.mockResolvedValue(null); // Simulando que o usuário não foi encontrado

    await expect(service.execute(updateUserInput)).rejects.toThrowError(
      BadRequestException,
    );

    expect(userRepo.findById).toHaveBeenCalledWith(fakeUser.id);
  });
});
