import chalk from 'chalk';

export default function generate(type: string, name: string) {
  console.log(chalk.yellow('\nWarning: Generate command is not yet implemented.\n'));
  console.log(chalk.white(`Requested: generate ${type} ${name}\n`));
  console.log(chalk.cyan('This feature will be available in Phase 4.'));
  console.log(chalk.cyan('It will scaffold modules and models in existing projects.\n'));
}
