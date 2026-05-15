import fs from 'fs';
import path from 'path';
import { getClient, fetchBasicStats } from './github.js';
import { simpleCard } from './svg-templates.js';

async function run() {
  try {
    const token = process.env.INPUT_GITHUB_TOKEN || process.env.GITHUB_TOKEN || process.env['INPUT_GITHUB-TOKEN'];
    const outputPath = process.env.INPUT_OUTPUT_PATH || process.env['INPUT_OUTPUT-PATH'] || 'assets/metrics.svg';
    const username = process.env.INPUT_USERNAME || process.env['INPUT_USERNAME'] || process.env.GITHUB_ACTOR;

    if (!token) throw new Error('GITHUB_TOKEN required');

    const octokit = getClient(token);
    const stats = await fetchBasicStats(octokit, username);

    const svg = simpleCard(stats);

    const fullPath = path.resolve(process.cwd(), outputPath);
    fs.mkdirSync(path.dirname(fullPath), { recursive: true });
    fs.writeFileSync(fullPath, svg, 'utf8');

    console.log(`Metrics written to ${outputPath}`);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) run();
export default run;
