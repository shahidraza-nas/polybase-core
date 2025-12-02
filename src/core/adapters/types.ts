/**
 * Query options for database operations
 */
export interface QueryOptions {
  skip?: number;
  take?: number;
  orderBy?: Record<string, 'asc' | 'desc'>;
  where?: Record<string, unknown>;
}

/**
 * Pagination result structure
 */
export interface PaginationResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Generic database adapter interface
 * All database adapters (SQL, NoSQL, Sequelize) must implement this interface
 */
export interface DatabaseAdapter<T = unknown> {
  /**
   * Create a new record
   * @param model - The model/table name
   * @param data - The data to create
   */
  create(model: string, data: Partial<T>): Promise<T>;

  /**
   * Find a single record
   * @param model - The model/table name
   * @param where - The query conditions
   */
  findOne(model: string, where: Partial<T>): Promise<T | null>;

  /**
   * Find multiple records
   * @param model - The model/table name
   * @param query - Query options including filters, pagination, sorting
   */
  findMany(model: string, query?: QueryOptions): Promise<T[]>;

  /**
   * Update a record
   * @param model - The model/table name
   * @param where - The query conditions
   * @param data - The data to update
   */
  update(model: string, where: Partial<T>, data: Partial<T>): Promise<T>;

  /**
   * Delete a record
   * @param model - The model/table name
   * @param where - The query conditions
   */
  delete(model: string, where: Partial<T>): Promise<void>;

  /**
   * Count records
   * @param model - The model/table name
   * @param where - The query conditions
   */
  count(model: string, where?: Partial<T>): Promise<number>;
}
