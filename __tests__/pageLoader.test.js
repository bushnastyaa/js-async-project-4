import nock from 'nock';
import fs from 'fs/promises';
import os from 'os';
import path from 'path';
import pageLoader from '../src/index.js';

const assets = [
  {
    fileSrc: '/assets/professions/nodejs.png',
    filePath: 'ru-hexlet-io-courses_files/ru-hexlet-io-assets-professions-nodejs.png',
  },
  {
    fileSrc: '/packs/js/runtime.js',
    filePath: 'ru-hexlet-io-courses_files/ru-hexlet-io-packs-js-runtime.js',
  },
  {
    fileSrc: '/assets/application.css',
    filePath: 'ru-hexlet-io-courses_files/ru-hexlet-io-assets-application.css',
  },
  {
    fileSrc: '/courses',
    filePath: 'ru-hexlet-io-courses_files/ru-hexlet-io-courses.html',
  },
];

describe('Loading pages with commander', () => {
  let output;

  beforeAll(async () => {
    const server = nock('https://ru.hexlet.io').persist();
    assets.forEach((item) => {
      server
        .get(item.fileSrc)
        .replyWithFile(200, path.join('__fixtures__', item.filePath));
    });

    output = await fs.mkdtemp(path.join(os.tmpdir(), 'page-loader-'));
    const pageUrl = new URL('/courses', 'https://ru.hexlet.io');
    await pageLoader(pageUrl.toString(), output);
  });

  test('Should return path with url', async () => {
    const fileName = 'ru-hexlet-io-courses.html';
    const received = await fs.readFile(path.join(output, fileName), 'utf-8');
    const expected = await fs.readFile(path.join('__fixtures__', fileName), 'utf-8');

    expect(received).toBe(expected);
  });

  test.each(assets)('Should return path with url and arguments', async ({ filePath }) => {
    const received = await fs.readFile(path.join(output, filePath), 'utf-8');
    const expected = await fs.readFile(path.join('__fixtures__', filePath), 'utf-8');

    expect(received).toBe(expected);
  });
});
