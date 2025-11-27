export class SqlAdapter {
  constructor(private db: any) {}

  async create(table: string, data: any) {
    return this.db[table].create({ data });
  }

  async findOne(table: string, where: any) {
    return this.db[table].findUnique({ where });
  }

  async findMany(table: string, query: any = {}) {
    return this.db[table].findMany(query);
  }

  async update(table: string, where: any, data: any) {
    return this.db[table].update({ where, data });
  }

  async delete(table: string, where: any) {
    return this.db[table].delete({ where });
  }

  async count(table: string, where: any = {}) {
    return this.db[table].count({ where });
  }
}
