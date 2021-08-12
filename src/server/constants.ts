import path from 'path';

export const SQLITE_DIR = path.join(
  __dirname,
  '..',
  '..',
  '__sqlite-data',
  'data.copy.db'
);
export const BUILD_DIR = path.join(__dirname, '..', '..', 'public');
