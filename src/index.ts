import { Command } from 'commander';
import { initProject, generate, doctor } from './cli/index.js';

const program = new Command();

program
  .name('polycore')
  .description('Backend boilerplate generator for SQL + NoSQL')
  .version('1.1.0');

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
