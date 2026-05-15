import { mkdir, writeFile } from 'fs/promises';
import path from 'path';
import { getClient, fetchBasicStats } from './github.js';
import { simpleCard } from './svg-templates.js';

const token = process.env.GITHUB_TOKEN || process.env.INPUT_GITHUB_TOKEN;
const outputPath = process.env.INPUT_OUTPUT_PATH || 'assets/metrics.svg';
const username = process.env.INPUT_USERNAME || process.env.GITHUB_ACTOR;

if (!token) throw new Error('GITHUB_TOKEN required');
if (!username) throw new Error('username required');

async function run(){
  const octokit = getClient(token);
  const stats = await fetchBasicStats(octokit, username);
  const svg = simpleCard(stats);

  const fullPath = path.resolve(process.cwd(), outputPath);
  await mkdir(path.dirname(fullPath), { recursive: true });
  await writeFile(fullPath, svg, 'utf8');

  console.log(`Metrics written to ${outputPath}`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  run().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
