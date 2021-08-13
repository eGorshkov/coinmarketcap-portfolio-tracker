import * as fs from 'fs';
import * as path from 'path';
import { BUILD_DIR } from './constants';

const build = fs
  .readdirSync(BUILD_DIR)
  .reduce((acc, x) => ({ ...acc, [x]: x }), {});

export function responseStatic(request, response) {
  const findBuildFile = build[request.url.slice(1)];

  if (request.url === '/') {
    response.end(
      fs.readFileSync(path.join(BUILD_DIR, build['index.html'])).toString()
    );
  } else if (findBuildFile) {
    response.end(
      fs.readFileSync(path.join(BUILD_DIR, findBuildFile)).toString()
    );
  }
}
export default responseStatic;
