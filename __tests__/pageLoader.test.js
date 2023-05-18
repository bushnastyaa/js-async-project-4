import nock from 'nock';
import fs from 'fs/promises';
import os from 'os';
import path from 'path';
import pageLoader from '../src/index.js';

nock.disableNetConnect();

const assets = [
  {
    fileSrc: '/assets/professions/nodejs.png',
    filePath: 'ru-hexlet-io-courses_files/ru-hexlet-io-assets-professions-nodejs.png',
  },
  {
    fileSrc: '/script.js',
    filePath: 'ru-hexlet-io-courses_files/ru-hexlet-io-script.js',
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
  const pageUrl = new URL('/courses', 'https://ru.hexlet.io');
  let output;

  beforeAll(async () => {
    output = await fs.mkdtemp(path.join(os.tmpdir(), 'page-loader-'));
    assets.forEach((el) => {
      nock('https://ru.hexlet.io').persist()
        .get(el.fileSrc)
        .replyWithFile(200, path.join('__fixtures__', el.filePath));
    });

    await pageLoader(pageUrl.toString(), output);
  });

  test.each(assets)('Should download file $fileSrc', async ({ filePath }) => {
    const received = await fs.readFile(path.join(output, filePath), 'utf-8');
    const expected = await fs.readFile(path.join('__fixtures__', filePath), 'utf-8');

    expect(received).toBe(expected);
  });

  test('Should download html file', async () => {
    const fileName = 'ru-hexlet-io-courses.html';
    const received = await fs.readFile(path.join(output, fileName), 'utf-8');
    const expected = await fs.readFile(path.join('__fixtures__', fileName), 'utf-8');

    expect(received).toBe(expected);
  });
});
