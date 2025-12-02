import inquirer from 'inquirer';

export interface InitPromptAnswers {
  dbType: 'SQL' | 'NoSQL' | 'Hybrid';
  sqlOrm?: 'Prisma' | 'Sequelize';
  git: boolean;
  install: boolean;
}

export const initPrompts = async (): Promise<InitPromptAnswers> => {
  const dbTypeAnswer = await inquirer.prompt<{ dbType: 'SQL' | 'NoSQL' | 'Hybrid' }>([
    {
      type: 'list',
      name: 'dbType',
      message: 'Choose database type:',
      choices: ['SQL', 'NoSQL', 'Hybrid'],
      default: 'SQL',
    },
  ]);

  let sqlOrm: 'Prisma' | 'Sequelize' | undefined;

  // Ask for SQL ORM choice if SQL or Hybrid mode
  if (dbTypeAnswer.dbType === 'SQL' || dbTypeAnswer.dbType === 'Hybrid') {
    const ormChoice = await inquirer.prompt<{ sqlOrm: 'Prisma' | 'Sequelize' }>([
      {
        type: 'list',
        name: 'sqlOrm',
        message: 'Choose SQL ORM:',
        choices: ['Prisma', 'Sequelize'],
        default: 'Prisma',
      },
    ]);
    sqlOrm = ormChoice.sqlOrm;
  }

  const finalAnswers = await inquirer.prompt<{ git: boolean; install: boolean }>([
    {
      type: 'confirm',
      name: 'git',
      message: 'Initialize Git repository?',
      default: true,
    },
    {
      type: 'confirm',
      name: 'install',
      message: 'Install dependencies now?',
      default: false,
    },
  ]);

  return {
    dbType: dbTypeAnswer.dbType,
    sqlOrm,
    git: finalAnswers.git,
    install: finalAnswers.install,
  };
};
