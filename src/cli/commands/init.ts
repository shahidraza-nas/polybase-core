import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs-extra';
import ora from 'ora';
import chalk from 'chalk';
import { initPrompts } from '../prompts.js';
import { copyTemplate } from '../../utils/copy.js';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default async function initProject(name: string) {
  console.log(chalk.blue(`\nCreating new project: ${name}\n`));

  const targetDir = path.resolve(process.cwd(), name);

  // Check if directory already exists
  if (await fs.pathExists(targetDir)) {
    console.error(chalk.red(`Error: Directory "${name}" already exists!`));
    process.exit(1);
  }

  const spinner = ora('Collecting project information...').start();

  try {
    spinner.stop();
    const answers = await initPrompts();
    spinner.start('Creating project structure...');

    // Determine template directory based on database type and ORM
    let templatePath = answers.dbType.toLowerCase();
    
    // For SQL and Hybrid modes, append ORM choice
    if (answers.sqlOrm) {
      templatePath = `${templatePath}-${answers.sqlOrm.toLowerCase()}`;
    }

    const templateDir = path.join(
      __dirname,
      '../../../templates',
      templatePath
    );

    // Check if template exists
    if (!(await fs.pathExists(templateDir))) {
      throw new Error(`Template not found: ${templatePath}`);
    }

    // Create target directory and copy template
    await fs.mkdirp(targetDir);
    await copyTemplate(templateDir, targetDir);

    // Copy .env.example to .env
    const envExamplePath = path.join(targetDir, '.env.example');
    const envPath = path.join(targetDir, '.env');
    if (await fs.pathExists(envExamplePath)) {
      await fs.copy(envExamplePath, envPath);
    }

    spinner.succeed(chalk.green('Project structure created!'));

    // Initialize git repository
    if (answers.git) {
      spinner.start('Initializing Git repository...');
      try {
        execSync('git init', { cwd: targetDir, stdio: 'ignore' });
        spinner.succeed(chalk.green('Git repository initialized!'));
      } catch (error) {
        spinner.warn(chalk.yellow('Git initialization failed (git may not be installed)'));
      }
    }

    // Install dependencies
    if (answers.install) {
      spinner.start('Installing dependencies (this may take a while)...');
      try {
        execSync('npm install', { cwd: targetDir, stdio: 'inherit' });
        spinner.succeed(chalk.green('Dependencies installed!'));
      } catch (error) {
        spinner.fail(chalk.red('Failed to install dependencies'));
        console.log(chalk.yellow('\nYou can install them manually by running:'));
        console.log(chalk.cyan(`  cd ${name} && npm install\n`));
      }
    }

    // Success message
    console.log(chalk.green('\nProject created successfully!\n'));
    console.log(chalk.cyan('Next steps:'));
    console.log(chalk.white(`  cd ${name}`));
    if (!answers.install) {
      console.log(chalk.white('  npm install'));
    }
    console.log(chalk.yellow('  Edit .env file with your database credentials'));
    console.log(chalk.white('  npm run dev\n'));

  } catch (error) {
    spinner.fail(chalk.red('Failed to create project'));
    console.error(chalk.red(`\nError: ${error instanceof Error ? error.message : error}`));
    process.exit(1);
  }
}
