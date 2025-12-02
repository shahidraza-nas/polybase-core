import { describe, it, expect } from 'vitest';
import { BaseService } from './index.js';
import type { DatabaseAdapter, QueryOptions } from './adapters/types.js';

/* Mock adapter for testing */
class MockAdapter<T> implements DatabaseAdapter<T> {
  private data: Map<string, T[]> = new Map();

  async create(model: string, data: Partial<T>): Promise<T> {
    const collection = this.data.get(model) || [];
    const newItem = { id: Date.now(), ...data } as T;
    collection.push(newItem);
    this.data.set(model, collection);
    return newItem;
  }

  async findOne(model: string, where: Partial<T>): Promise<T | null> {
    const collection = this.data.get(model) || [];
    const found = collection.find((item) =>
      Object.entries(where).every(([key, value]) => (item as any)[key] === value)
    );
    return found || null;
  }

  async findMany(model: string, query?: QueryOptions): Promise<T[]> {
    const collection = this.data.get(model) || [];
    let result = [...collection];

    if (query?.skip) {
      result = result.slice(query.skip);
    }

    if (query?.take) {
      result = result.slice(0, query.take);
    }

    return result;
  }

  async update(model: string, where: Partial<T>, data: Partial<T>): Promise<T> {
    const collection = this.data.get(model) || [];
    const index = collection.findIndex((item) =>
      Object.entries(where).every(([key, value]) => (item as any)[key] === value)
    );

    if (index === -1) {
      throw new Error('Item not found');
    }

    collection[index] = { ...collection[index]!, ...data } as T;
    return collection[index];
  }

  async delete(model: string, where: Partial<T>): Promise<void> {
    const collection = this.data.get(model) || [];
    const filtered = collection.filter(
      (item) => !Object.entries(where).every(([key, value]) => (item as any)[key] === value)
    );
    this.data.set(model, filtered);
  }

  async count(model: string, where?: Partial<T>): Promise<number> {
    const collection = this.data.get(model) || [];
    if (!where) {
      return collection.length;
    }

    return collection.filter((item) =>
      Object.entries(where).every(([key, value]) => (item as any)[key] === value)
    ).length;
  }
}

interface TestUser {
  id: number;
  name: string;
  email: string;
}

describe('BaseService', () => {
  it('should create a new item', async () => {
    const adapter = new MockAdapter<TestUser>();
    const service = new BaseService<TestUser>(adapter, 'users');

    const user = await service.create({ name: 'John', email: 'john@test.com' });

    expect(user).toHaveProperty('id');
    expect(user.name).toBe('John');
    expect(user.email).toBe('john@test.com');
  });

  it('should find one item', async () => {
    const adapter = new MockAdapter<TestUser>();
    const service = new BaseService<TestUser>(adapter, 'users');

    await service.create({ name: 'John', email: 'john@test.com' });
    const user = await service.findOne({ email: 'john@test.com' });

    expect(user).not.toBeNull();
    expect(user?.name).toBe('John');
  });

  it('should find many items', async () => {
    const adapter = new MockAdapter<TestUser>();
    const service = new BaseService<TestUser>(adapter, 'users');

    await service.create({ name: 'John', email: 'john@test.com' });
    await service.create({ name: 'Jane', email: 'jane@test.com' });

    const users = await service.findMany();

    expect(users).toHaveLength(2);
  });

  it('should paginate results', async () => {
    const adapter = new MockAdapter<TestUser>();
    const service = new BaseService<TestUser>(adapter, 'users');

    // Create 15 users
    for (let i = 1; i <= 15; i++) {
      await service.create({ name: `User ${i}`, email: `user${i}@test.com` });
    }

    const result = await service.paginate(1, 10);

    expect(result.data).toHaveLength(10);
    expect(result.pagination.page).toBe(1);
    expect(result.pagination.limit).toBe(10);
    expect(result.pagination.total).toBe(15);
    expect(result.pagination.totalPages).toBe(2);
  });

  it('should count items', async () => {
    const adapter = new MockAdapter<TestUser>();
    const service = new BaseService<TestUser>(adapter, 'users');

    await service.create({ name: 'John', email: 'john@test.com' });
    await service.create({ name: 'Jane', email: 'jane@test.com' });

    const count = await service.count();

    expect(count).toBe(2);
  });

  it('should update an item', async () => {
    const adapter = new MockAdapter<TestUser>();
    const service = new BaseService<TestUser>(adapter, 'users');

    const user = await service.create({ name: 'John', email: 'john@test.com' });
    const updated = await service.update(user.id, { name: 'John Updated' });

    expect(updated.name).toBe('John Updated');
    expect(updated.email).toBe('john@test.com');
  });

  it('should delete an item', async () => {
    const adapter = new MockAdapter<TestUser>();
    const service = new BaseService<TestUser>(adapter, 'users');

    const user = await service.create({ name: 'John', email: 'john@test.com' });
    await service.delete(user.id);

    const count = await service.count();
    expect(count).toBe(0);
  });
});
