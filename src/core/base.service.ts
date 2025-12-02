import type { DatabaseAdapter, QueryOptions, PaginationResult } from './adapters/types.js';

/**
 * Generic base service class providing common CRUD operations
 * @template T - The entity type this service manages
 */
export class BaseService<T> {
  constructor(
    private adapter: DatabaseAdapter<T>,
    private model: string
  ) {}

  async create(data: Partial<T>): Promise<T> {
    return this.adapter.create(this.model, data);
  }

  async findOne(query: Partial<T>): Promise<T | null> {
    return this.adapter.findOne(this.model, query);
  }

  async findMany(query: QueryOptions = {}): Promise<T[]> {
    return this.adapter.findMany(this.model, query);
  }

  async update(id: string | number, data: Partial<T>): Promise<T> {
    return this.adapter.update(this.model, { id } as unknown as Partial<T>, data);
  }

  async delete(id: string | number): Promise<void> {
    return this.adapter.delete(this.model, { id } as unknown as Partial<T>);
  }

  async count(query: Partial<T> = {}): Promise<number> {
    return this.adapter.count(this.model, query);
  }

  async paginate(
    page: number = 1,
    limit: number = 10,
    query: QueryOptions = {}
  ): Promise<PaginationResult<T>> {
    const skip = (page - 1) * limit;
    const total = await this.count(query.where as Partial<T>);
    const data = await this.findMany({
      ...query,
      skip,
      take: limit,
    });

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
