import fs from 'fs-extra';

export async function copyTemplate(src: string, dest: string): Promise<void> {
  try {
    await fs.copy(src, dest, {
      overwrite: false,
      errorOnExist: false,
    });
  } catch (error) {
    throw new Error(`Failed to copy template: ${error}`);
  }
}
