import { readFile, mkdir, writeFile } from 'fs/promises';
import path from 'path';

const escapeXml = (value) => String(value ?? '')
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&apos;');

function metricsCard({ name, avatar, public_repos, followers, totalStars, topRepos = [] }) {
  const repos = topRepos.slice(0, 3).map((repo, index) => {
    const repoName = String(repo.name ?? 'Repository');
    const label = repoName.length > 44 ? `${repoName.slice(0, 41)}…` : repoName;
    const y = 277 + index * 23;
    return `
      <g transform="translate(40 ${y})">
        <circle cx="4" cy="-4" r="3" fill="#8b7bff" />
        <text class="repo" x="18" y="0">${escapeXml(label)}</text>
        <text class="stars" x="680" y="0" text-anchor="end">★ ${escapeXml(repo.stars ?? 0)}</text>
      </g>`;
  }).join('');

  const stats = [
    { label: 'PUBLIC REPOSITORIES', value: public_repos },
    { label: 'FOLLOWERS', value: followers },
    { label: 'TOTAL STARS', value: totalStars },
  ];
  const statCards = stats.map(({ label, value }, index) => {
    const x = 36 + index * 231;
    return `
      <g transform="translate(${x} 143)">
        <rect width="216" height="70" rx="14" fill="#111a2e" stroke="#26324b" />
        <text class="label" x="16" y="27">${label}</text>
        <text class="value" x="16" y="54">${escapeXml(value ?? 0)}</text>
      </g>`;
  }).join('');

  const safeAvatar = escapeXml(avatar || '');
  const safeName = escapeXml(name || 'GitHub user');

  return `<svg xmlns="http://www.w3.org/2000/svg" width="760" height="360" viewBox="0 0 760 360" fill="none" role="img" aria-label="GitHub profile metrics for ${safeName}">
  <defs>
    <linearGradient id="background" x1="0" y1="0" x2="760" y2="360" gradientUnits="userSpaceOnUse">
      <stop stop-color="#0c1222" />
      <stop offset="1" stop-color="#10172a" />
    </linearGradient>
    <linearGradient id="accent" x1="0" y1="0" x2="1" y2="1">
      <stop stop-color="#8b7bff" />
      <stop offset="1" stop-color="#43d9c5" />
    </linearGradient>
    <clipPath id="avatar-clip"><circle cx="78" cy="76" r="38" /></clipPath>
  </defs>
  <rect x="0.5" y="0.5" width="759" height="359" rx="22" fill="url(#background)" stroke="#29334a" />
  <circle cx="704" cy="44" r="80" fill="#8b7bff" fill-opacity=".08" />
  <rect x="36" y="35" width="84" height="84" rx="42" fill="#1a2440" stroke="url(#accent)" stroke-width="2" />
  <image href="${safeAvatar}" x="40" y="38" width="76" height="76" clip-path="url(#avatar-clip)" />
  <text class="name" x="140" y="68">${safeName}</text>
  <text class="subtitle" x="140" y="94">CYBERSECURITY · AUTOMATION · OPEN SOURCE</text>
  <rect x="140" y="105" width="70" height="3" rx="1.5" fill="url(#accent)" />
  ${statCards}
  <text class="section" x="40" y="250">TOP REPOSITORIES</text>
  ${repos || '<text class="empty" x="40" y="279">More projects coming soon.</text>'}
  <text class="footer" x="720" y="337" text-anchor="end">UPDATED DAILY · GITHUB</text>
  <style>
    text { font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
    .name { fill: #f3f5ff; font-size: 25px; font-weight: 700; }
    .subtitle { fill: #9ca9c4; font-size: 11px; font-weight: 600; letter-spacing: 1.15px; }
    .label { fill: #9ca9c4; font-size: 10px; font-weight: 700; letter-spacing: 1px; }
    .value { fill: #f3f5ff; font-size: 23px; font-weight: 700; }
    .section { fill: #cbd4e8; font-size: 10px; font-weight: 700; letter-spacing: 1.3px; }
    .repo { fill: #eef1fa; font-size: 12px; font-weight: 600; }
    .stars, .empty, .footer { fill: #8996b0; font-size: 11px; }
    .footer { font-size: 9px; letter-spacing: 1px; }
  </style>
</svg>`;
}

export default async function run() {
  const statsFile = process.env.STATS_FILE || 'stats.json';
  const outputPath = process.env.INPUT_OUTPUT_PATH || 'assets/metrics.svg';

  const raw = await readFile(path.resolve(process.cwd(), statsFile), 'utf8');
  const stats = JSON.parse(raw);
  const svg = metricsCard(stats);

  const fullPath = path.resolve(process.cwd(), outputPath);
  await mkdir(path.dirname(fullPath), { recursive: true });
  await writeFile(fullPath, svg, 'utf8');
  console.log(`Metrics written to ${outputPath}`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  run().catch(err => { console.error(err); process.exit(1); });
}
