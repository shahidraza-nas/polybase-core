export class NoSqlAdapter {
  constructor(private model: any) {}

  async create(data: any) {
    return this.model.create(data);
  }

  async findOne(query: any) {
    return this.model.findOne(query);
  }

  async findMany(query: any = {}) {
    return this.model.find(query);
  }

  async update(query: any, data: any) {
    return this.model.findOneAndUpdate(query, data, { new: true });
  }

  async delete(query: any) {
    return this.model.findOneAndDelete(query);
  }

  async count(query: any = {}) {
    return this.model.countDocuments(query);
  }
}
