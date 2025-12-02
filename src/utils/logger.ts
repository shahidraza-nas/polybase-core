import ora from 'ora';
import chalk from 'chalk';

export class Logger {
  static spinner = ora();

  static info(message: string) {
    console.log(chalk.blue(message));
  }

  static success(message: string) {
    console.log(chalk.green(message));
  }

  static error(message: string) {
    console.log(chalk.red(message));
  }

  static warn(message: string) {
    console.log(chalk.yellow(message));
  }

  static startSpinner(message: string) {
    this.spinner = ora(message).start();
  }

  static stopSpinner(success: boolean, message: string) {
    if (success) {
      this.spinner.succeed(chalk.green(message));
    } else {
      this.spinner.fail(chalk.red(message));
    }
  }
}
