export class SequelizeAdapter {
  constructor(private db: any) {}

  async create(model: string, data: any) {
    const Model = this.db.models[model];
    return Model.create(data);
  }

  async findOne(model: string, where: any) {
    const Model = this.db.models[model];
    return Model.findOne({ where });
  }

  async findMany(model: string, options: any = {}) {
    const Model = this.db.models[model];
    return Model.findAll(options);
  }

  async update(model: string, where: any, data: any) {
    const Model = this.db.models[model];
    const [count, rows] = await Model.update(data, { 
      where, 
      returning: true 
    });
    return rows[0];
  }

  async delete(model: string, where: any) {
    const Model = this.db.models[model];
    return Model.destroy({ where });
  }

  async count(model: string, where: any = {}) {
    const Model = this.db.models[model];
    return Model.count({ where });
  }
}
