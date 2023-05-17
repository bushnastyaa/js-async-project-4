import fsp from 'fs/promises';
import path from 'path';
import { cwd } from 'node:process';
import axios from 'axios';
import Listr from 'listr';
import { downloadAssets, replaceName, loadingLinks } from './utils.js';

export default (url, output = cwd()) => {
  const fileName = replaceName(url);
  const assetsDir = `${fileName}_files`;
  const outPath = path.join(output, assetsDir);
  const htmlFilePath = path.join(output, `${fileName}.html`);
  const { origin } = new URL(url);

  return axios.get(url)
    .then((response) => fsp.mkdir(outPath)
      .then(() => (response.data)))
    .then((response) => {
      const { html, assets } = loadingLinks(response, assetsDir, origin);
      const tasks = assets.map(([assetsUrl, assetsFilePath]) => {
        const { href } = new URL(assetsUrl, origin);
        return {
          title: href,
          task: () => downloadAssets(href, path.join(output, assetsFilePath)),
        };
      });
      const task = new Listr(tasks, { concurrent: true, exitOnError: false });

      return task.run(html);
    })
    .then((response) => fsp.writeFile(htmlFilePath, response))
    .then(() => htmlFilePath);
};
