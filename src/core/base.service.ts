export class BaseService {
  constructor(private adapter: any, private model: string) {}

  async create(data: any) {
    return this.adapter.create(this.model, data);
  }

  async findOne(query: any) {
    return this.adapter.findOne(this.model, query);
  }

  async findMany(query: any = {}) {
    return this.adapter.findMany(this.model, query);
  }

  async update(id: any, data: any) {
    return this.adapter.update(this.model, { id }, data);
  }

  async delete(id: any) {
    return this.adapter.delete(this.model, { id });
  }

  async count(query: any = {}) {
    return this.adapter.count(this.model, query);
  }

  async paginate(page: number = 1, limit: number = 10, query: any = {}) {
    const skip = (page - 1) * limit;
    const total = await this.count(query);
    const data = await this.findMany({ 
      ...query, 
      skip, 
      take: limit 
    });

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }
}
