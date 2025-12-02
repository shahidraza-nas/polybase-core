import { Command } from 'commander';
import { createRequire } from 'module';
import { initProject, generate, doctor } from './cli/index.js';

const require = createRequire(import.meta.url);
const packageJson = require('../package.json');

const program = new Command();

program
  .name('polycore')
  .description('Backend boilerplate generator for SQL + NoSQL')
  .version(packageJson.version);

program
  .command('init <projectName>')
  .description('Initialize a new API project')
  .action(initProject);

program.command('generate <type> <name>').description('Generate module or model').action(generate);

program
  .command('doctor')
  .description('Check system requirements and project health')
  .action(doctor);

program.parse();
