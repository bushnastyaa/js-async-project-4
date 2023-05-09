import fsp from 'fs/promises';
import path from 'path';
import { cwd } from 'node:process';
import axios from 'axios';

const replaceName = (url) => url.replace(/htt(p|ps):\/\//, '').replace(/\W/g, '-');

export default (url, output = cwd()) => {
  const fileName = replaceName(url);
  const outPath = path.join(output, fileName);
  return axios.get(url)
    .then(({ data }) => fsp.writeFile(`${outPath}.html`, data))
    .catch((e) => { throw new Error(e); });
};
