import { User } from './user.model.js';
import { CreateUserInput, UpdateUserInput } from './user.dto.js';
import { NotFoundError } from '../../core/errors/app-error.js';
import bcrypt from 'bcryptjs';

export class UserService {
  async create(data: CreateUserInput) {
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await User.create({
      id: '',
      email: data.email,
      name: data.name,
      password: hashedPassword,
    });

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async findAll(page: number = 1, limit: number = 10) {
    const offset = (page - 1) * limit;

    const { count, rows } = await User.findAndCountAll({
      offset,
      limit,
      attributes: ['id', 'email', 'name', 'createdAt', 'updatedAt'],
      order: [['createdAt', 'DESC']],
    });

    return {
      users: rows,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit),
      },
    };
  }

  async findById(id: string) {
    const user = await User.findByPk(id, {
      attributes: ['id', 'email', 'name', 'createdAt', 'updatedAt'],
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    return user;
  }

  async findByEmail(email: string) {
    return User.findOne({ where: { email } });
  }

  async update(id: string, data: UpdateUserInput) {
    const user = await this.findById(id);

    await user.update(data);

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async delete(id: string) {
    const user = await this.findById(id);
    await user.destroy();

    return { message: 'User deleted successfully' };
  }
}

export const userService = new UserService();
