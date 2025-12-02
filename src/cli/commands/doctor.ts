import chalk from 'chalk';
import { execSync } from 'child_process';

export default function doctor() {
  console.log(chalk.blue('\nRunning system health checks...\n'));

  const checks = [
    { name: 'Node.js', command: 'node --version', required: true },
    { name: 'npm', command: 'npm --version', required: true },
    { name: 'Git', command: 'git --version', required: false },
    { name: 'TypeScript', command: 'tsc --version', required: false },
  ];

  let allPassed = true;

  checks.forEach((check) => {
    try {
      const version = execSync(check.command, { encoding: 'utf-8' }).trim();
      console.log(chalk.green(`✓ ${check.name}: ${version}`));
    } catch (error) {
      if (check.required) {
        console.log(chalk.red(`✗ ${check.name}: Not found (REQUIRED)`));
        allPassed = false;
      } else {
        console.log(chalk.yellow(`⚠ ${check.name}: Not found (optional)`));
      }
    }
  });

  console.log();

  if (allPassed) {
    console.log(chalk.green('Success: All required dependencies are installed!\n'));
  } else {
    console.log(chalk.red('Error: Some required dependencies are missing.\n'));
    process.exit(1);
  }
}
