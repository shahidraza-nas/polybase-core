import inquirer from 'inquirer';

export const initPrompts = async () => {
  const answers: any = await inquirer.prompt([
    {
      type: 'list',
      name: 'dbType',
      message: 'Choose database type:',
      choices: ['SQL', 'NoSQL', 'Hybrid'],
      default: 'SQL'
    }
  ]);

  // Ask for SQL ORM choice if SQL or Hybrid mode
  if (answers.dbType === 'SQL' || answers.dbType === 'Hybrid') {
    const ormChoice = await inquirer.prompt([
      {
        type: 'list',
        name: 'sqlOrm',
        message: 'Choose SQL ORM:',
        choices: ['Prisma', 'Sequelize'],
        default: 'Prisma'
      }
    ]);
    answers.sqlOrm = ormChoice.sqlOrm;
  }

  const finalAnswers = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'git',
      message: 'Initialize Git repository?',
      default: true
    },
    {
      type: 'confirm',
      name: 'install',
      message: 'Install dependencies now?',
      default: false
    }
  ]);

  return { ...answers, ...finalAnswers };
};
