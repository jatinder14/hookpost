import * as fs from 'fs';
import * as path from 'path';

const getProjects = () => {
  const apps = fs.readdirSync(path.join(__dirname, 'apps'))
    .filter(dir => fs.existsSync(path.join(__dirname, 'apps', dir, 'jest.config.ts')))
    .map(dir => `<rootDir>/apps/${dir}`);
  const libs = fs.readdirSync(path.join(__dirname, 'libraries'))
    .filter(dir => fs.existsSync(path.join(__dirname, 'libraries', dir, 'jest.config.ts')))
    .map(dir => `<rootDir>/libraries/${dir}`);
  return [...apps, ...libs];
};

export default {
  projects: getProjects(),
};
