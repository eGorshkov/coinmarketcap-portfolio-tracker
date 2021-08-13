import * as fs from 'fs';
import * as path from 'path';
import { BUILD_DIR } from './constants';

function getDirrectory(parent = '') {
  return (acc, current) => {
    const _path = [parent, current].filter(Boolean).join('/');
    const _currentath = path.join(BUILD_DIR, _path);
    const newPath = fs.lstatSync(_currentath).isDirectory()
      ? fs.readdirSync(_currentath).reduce(getDirrectory(_path), {})
      : { [_path]: _path };
    return { ...acc, ...newPath };
  };
}

const build = fs.readdirSync(BUILD_DIR).reduce(getDirrectory(), {});

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
