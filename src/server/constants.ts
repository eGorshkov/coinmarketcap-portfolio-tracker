import * as path from 'path';
import { config } from 'dotenv';
config({ path: '.env' });

export const SQLITE_DIR = path.join('__sqlite-data', 'data.db');
export const BUILD_DIR = path.join(process.env.PUBLIC_PATH);
