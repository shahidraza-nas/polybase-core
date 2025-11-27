import path from 'path';
import fs from 'fs-extra';
import chalk from 'chalk';
import ora from 'ora';
import inquirer from 'inquirer';

interface ModuleFiles {
  controller: string;
  service: string;
  routes: string;
  dto: string;
  model?: string;
}

export default async function generate(type: string, name: string) {
  if (type !== 'module') {
    console.log(chalk.red(`\nError: Unknown type "${type}". Only "module" is supported.\n`));
    console.log(chalk.cyan('Usage: polycore generate module <name>\n'));
    process.exit(1);
  }

  const spinner = ora('Checking project structure...').start();

  // Check if we're in a polycore project
  const cwd = process.cwd();
  const packageJsonPath = path.join(cwd, 'package.json');
  
  if (!await fs.pathExists(packageJsonPath)) {
    spinner.fail(chalk.red('Not in a Node.js project'));
    console.log(chalk.yellow('\nPlease run this command from your project root.\n'));
    process.exit(1);
  }

  const packageJson = await fs.readJSON(packageJsonPath);
  
  // Detect project type
  const hasPrisma = packageJson.dependencies?.['@prisma/client'];
  const hasSequelize = packageJson.dependencies?.['sequelize'];
  const hasMongoose = packageJson.dependencies?.['mongoose'];
  
  let projectType: string;
  if (hasPrisma && hasMongoose) {
    projectType = 'hybrid-prisma';
  } else if (hasSequelize && hasMongoose) {
    projectType = 'hybrid-sequelize';
  } else if (hasPrisma) {
    projectType = 'sql-prisma';
  } else if (hasSequelize) {
    projectType = 'sql-sequelize';
  } else if (hasMongoose) {
    projectType = 'nosql';
  } else {
    spinner.fail(chalk.red('Could not detect project type'));
    console.log(chalk.yellow('\nThis command only works with polycore-generated projects.\n'));
    process.exit(1);
  }

  spinner.succeed(chalk.green(`Detected ${projectType} project`));

  // For hybrid projects, ask which database
  let useSQL = true;
  if (projectType.startsWith('hybrid')) {
    const { database } = await inquirer.prompt([{
      type: 'list',
      name: 'database',
      message: 'Which database for this module?',
      choices: ['SQL', 'NoSQL'],
      default: 'SQL'
    }]);
    useSQL = database === 'SQL';
  }

  const moduleName = name.toLowerCase();
  const ModuleName = capitalize(moduleName);
  const modulePath = path.join(cwd, 'src', 'modules', moduleName);

  // Check if module already exists
  if (await fs.pathExists(modulePath)) {
    console.log(chalk.red(`\nError: Module "${moduleName}" already exists!\n`));
    process.exit(1);
  }

  spinner.start(`Generating ${moduleName} module...`);

  try {
    // Create module directory
    await fs.mkdirp(modulePath);

    // Generate files based on project type
    const files = generateModuleFiles(moduleName, ModuleName, projectType, useSQL);

    // Write files
    await Promise.all([
      fs.writeFile(path.join(modulePath, `${moduleName}.controller.ts`), files.controller),
      fs.writeFile(path.join(modulePath, `${moduleName}.service.ts`), files.service),
      fs.writeFile(path.join(modulePath, `${moduleName}.routes.ts`), files.routes),
      fs.writeFile(path.join(modulePath, `${moduleName}.dto.ts`), files.dto),
      files.model && fs.writeFile(path.join(modulePath, `${moduleName}.model.ts`), files.model)
    ]);

    // Update routes.ts to include new module
    await updateMainRoutes(cwd, moduleName);

    spinner.succeed(chalk.green(`Module "${moduleName}" generated successfully!`));

    console.log(chalk.cyan('\nGenerated files:'));
    console.log(chalk.white(`  src/modules/${moduleName}/${moduleName}.controller.ts`));
    console.log(chalk.white(`  src/modules/${moduleName}/${moduleName}.service.ts`));
    console.log(chalk.white(`  src/modules/${moduleName}/${moduleName}.routes.ts`));
    console.log(chalk.white(`  src/modules/${moduleName}/${moduleName}.dto.ts`));
    if (files.model) {
      console.log(chalk.white(`  src/modules/${moduleName}/${moduleName}.model.ts`));
    }

    console.log(chalk.cyan('\nNext steps:'));
    console.log(chalk.white(`  1. Update the model schema in ${moduleName}.model.ts`));
    console.log(chalk.white(`  2. Implement business logic in ${moduleName}.service.ts`));
    if (hasPrisma) {
      console.log(chalk.white(`  3. Update prisma/schema.prisma with your model`));
      console.log(chalk.white(`  4. Run: npx prisma generate && npx prisma db push`));
    }
    console.log();

  } catch (error) {
    spinner.fail(chalk.red('Failed to generate module'));
    console.error(chalk.red(`\nError: ${error instanceof Error ? error.message : error}`));
    process.exit(1);
  }
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function generateModuleFiles(
  moduleName: string,
  ModuleName: string,
  projectType: string,
  useSQL: boolean
): ModuleFiles {
  const controller = `import { Request, Response } from 'express';
import { ${ModuleName}Service } from './${moduleName}.service.js';
import { Create${ModuleName}Dto, Update${ModuleName}Dto } from './${moduleName}.dto.js';
import { success } from '../../core/index.js';

export class ${ModuleName}Controller {
  private ${moduleName}Service: ${ModuleName}Service;

  constructor() {
    this.${moduleName}Service = new ${ModuleName}Service();
  }

  async create(req: Request, res: Response) {
    const data: Create${ModuleName}Dto = req.body;
    const ${moduleName} = await this.${moduleName}Service.create(data);
    return success(res, ${moduleName}, '${ModuleName} created successfully', 201);
  }

  async getAll(req: Request, res: Response) {
    const ${moduleName}s = await this.${moduleName}Service.findAll();
    return success(res, ${moduleName}s);
  }

  async getById(req: Request, res: Response) {
    const { id } = req.params;
    const ${moduleName} = await this.${moduleName}Service.findById(id);
    return success(res, ${moduleName});
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const data: Update${ModuleName}Dto = req.body;
    const ${moduleName} = await this.${moduleName}Service.update(id, data);
    return success(res, ${moduleName}, '${ModuleName} updated successfully');
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;
    await this.${moduleName}Service.delete(id);
    return success(res, null, '${ModuleName} deleted successfully');
  }
}
`;

  const isPrisma = projectType.includes('prisma') && useSQL;
  const isSequelize = projectType.includes('sequelize') && useSQL;
  const isMongoose = projectType === 'nosql' || (!useSQL && projectType.startsWith('hybrid'));

  let service = '';
  let model: string | undefined;

  if (isPrisma) {
    service = `import { prisma } from '../../config/index.js';
import { Create${ModuleName}Dto, Update${ModuleName}Dto } from './${moduleName}.dto.js';
import { AppError } from '../../core/index.js';

export class ${ModuleName}Service {
  async create(data: Create${ModuleName}Dto) {
    return await prisma.${moduleName}.create({ data });
  }

  async findAll() {
    return await prisma.${moduleName}.findMany();
  }

  async findById(id: string) {
    const ${moduleName} = await prisma.${moduleName}.findUnique({ where: { id } });
    if (!${moduleName}) {
      throw new AppError('${ModuleName} not found', 404);
    }
    return ${moduleName};
  }

  async update(id: string, data: Update${ModuleName}Dto) {
    await this.findById(id);
    return await prisma.${moduleName}.update({ where: { id }, data });
  }

  async delete(id: string) {
    await this.findById(id);
    await prisma.${moduleName}.delete({ where: { id } });
  }
}
`;
  } else if (isSequelize) {
    service = `import { ${ModuleName} } from './${moduleName}.model.js';
import { Create${ModuleName}Dto, Update${ModuleName}Dto } from './${moduleName}.dto.js';
import { AppError } from '../../core/index.js';

export class ${ModuleName}Service {
  async create(data: Create${ModuleName}Dto) {
    return await ${ModuleName}.create(data as any);
  }

  async findAll() {
    return await ${ModuleName}.findAll();
  }

  async findById(id: string) {
    const ${moduleName} = await ${ModuleName}.findByPk(id);
    if (!${moduleName}) {
      throw new AppError('${ModuleName} not found', 404);
    }
    return ${moduleName};
  }

  async update(id: string, data: Update${ModuleName}Dto) {
    const ${moduleName} = await this.findById(id);
    return await ${moduleName}.update(data as any);
  }

  async delete(id: string) {
    const ${moduleName} = await this.findById(id);
    await ${moduleName}.destroy();
  }
}
`;
    model = `import { DataTypes, Model } from 'sequelize';
import { getSequelize } from '../../config/index.js';

export interface ${ModuleName}Attributes {
  id: string;
  name: string;
  // Add your fields here
  createdAt?: Date;
  updatedAt?: Date;
}

export class ${ModuleName} extends Model<${ModuleName}Attributes> implements ${ModuleName}Attributes {
  declare id: string;
  declare name: string;
  // Add your fields here
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

// Initialize model
${ModuleName}.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // Add your field definitions here
  },
  {
    sequelize: getSequelize(),
    tableName: '${moduleName}s',
    timestamps: true,
  }
);
`;
  } else if (isMongoose) {
    service = `import { ${ModuleName}Model } from './${moduleName}.model.js';
import { Create${ModuleName}Dto, Update${ModuleName}Dto } from './${moduleName}.dto.js';
import { AppError } from '../../core/index.js';

export class ${ModuleName}Service {
  async create(data: Create${ModuleName}Dto) {
    return await ${ModuleName}Model.create(data);
  }

  async findAll() {
    return await ${ModuleName}Model.find();
  }

  async findById(id: string) {
    const ${moduleName} = await ${ModuleName}Model.findById(id);
    if (!${moduleName}) {
      throw new AppError('${ModuleName} not found', 404);
    }
    return ${moduleName};
  }

  async update(id: string, data: Update${ModuleName}Dto) {
    const ${moduleName} = await ${ModuleName}Model.findByIdAndUpdate(id, data, { new: true });
    if (!${moduleName}) {
      throw new AppError('${ModuleName} not found', 404);
    }
    return ${moduleName};
  }

  async delete(id: string) {
    const ${moduleName} = await ${ModuleName}Model.findByIdAndDelete(id);
    if (!${moduleName}) {
      throw new AppError('${ModuleName} not found', 404);
    }
  }
}
`;
    model = `import mongoose, { Schema, Document } from 'mongoose';

export interface I${ModuleName} extends Document {
  name: string;
  // Add your fields here
}

const ${ModuleName}Schema = new Schema<I${ModuleName}>(
  {
    name: {
      type: String,
      required: true,
    },
    // Add your field definitions here
  },
  {
    timestamps: true,
  }
);

export const ${ModuleName}Model = mongoose.model<I${ModuleName}>('${ModuleName}', ${ModuleName}Schema);
`;
  }

  const routes = `import { Router } from 'express';
import { ${ModuleName}Controller } from './${moduleName}.controller.js';
import { asyncHandler } from '../../core/index.js';
import { validate } from '../../middlewares/index.js';
import { create${ModuleName}Schema, update${ModuleName}Schema } from './${moduleName}.dto.js';

const router = Router();
const ${moduleName}Controller = new ${ModuleName}Controller();

router.post('/', validate(create${ModuleName}Schema), asyncHandler((req, res) => ${moduleName}Controller.create(req, res)));
router.get('/', asyncHandler((req, res) => ${moduleName}Controller.getAll(req, res)));
router.get('/:id', asyncHandler((req, res) => ${moduleName}Controller.getById(req, res)));
router.put('/:id', validate(update${ModuleName}Schema), asyncHandler((req, res) => ${moduleName}Controller.update(req, res)));
router.delete('/:id', asyncHandler((req, res) => ${moduleName}Controller.delete(req, res)));

export default router;
`;

  const dto = `import { z } from 'zod';

export const create${ModuleName}Schema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required'),
    // Add your validation fields here
  }),
});

export const update${ModuleName}Schema = z.object({
  body: z.object({
    name: z.string().min(1).optional(),
    // Add your validation fields here
  }),
});

export type Create${ModuleName}Dto = z.infer<typeof create${ModuleName}Schema>['body'];
export type Update${ModuleName}Dto = z.infer<typeof update${ModuleName}Schema>['body'];
`;

  return { controller, service, routes, dto, model };
}

async function updateMainRoutes(projectRoot: string, moduleName: string) {
  const routesPath = path.join(projectRoot, 'src', 'routes.ts');
  
  if (!await fs.pathExists(routesPath)) {
    return; // Skip if routes file doesn't exist
  }

  let content = await fs.readFile(routesPath, 'utf-8');
  
  // Add import
  const importStatement = `import ${moduleName}Routes from './modules/${moduleName}/${moduleName}.routes.js';\n`;
  
  // Find where to insert the import (after other imports)
  const lastImportIndex = content.lastIndexOf('import ');
  const lineEndIndex = content.indexOf('\n', lastImportIndex);
  content = content.slice(0, lineEndIndex + 1) + importStatement + content.slice(lineEndIndex + 1);
  
  // Add route
  const routeStatement = `router.use('/${moduleName}s', ${moduleName}Routes);\n`;
  
  // Find where to insert the route (before export)
  const exportIndex = content.indexOf('export default router');
  content = content.slice(0, exportIndex) + routeStatement + '\n' + content.slice(exportIndex);
  
  await fs.writeFile(routesPath, content);
}
