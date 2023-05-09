#!/usr/bin/env node
import { Command } from 'commander';
import { readFileSync } from 'fs';
import pageLoader from '../src/index.js';

const { version } = JSON.parse(readFileSync(new URL('../package.json', import.meta.url)));

const program = new Command();

program
  .version(version, '-V, --version', 'output the version number')
  .description('Page-loader utility')
  .option('-o, --output [dir]', 'output dir (default: "/home/user/current-dir")', process.cwd())
  .arguments('<url>')
  .action((url, { output }) => pageLoader(url, output)
    .then((filePath) => console.log(filePath))
    .catch((error) => {
      console.error(error.message);
      process.exit(1);
    }))
  .parse(process.argv);
