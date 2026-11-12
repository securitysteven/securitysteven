import { readFile, mkdir, writeFile } from 'fs/promises';
import path from 'path';

const escapeXml = (value) => String(value ?? '')
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&apos;');

function wrapRepositories(repositories, maxWidth = 475) {
  const lines = [];
  let line = [];
  let lineWidth = 0;

  for (const repository of repositories) {
    const name = String(repository.name ?? 'Repository');
    const itemWidth = name.length * 5.5;
    const separatorWidth = line.length ? 11 : 0;

    if (line.length && lineWidth + separatorWidth + itemWidth > maxWidth) {
      lines.push(line);
      line = [];
      lineWidth = 0;
    }

    line.push(repository);
    lineWidth += (line.length > 1 ? 11 : 0) + itemWidth;
  }

  if (line.length) lines.push(line);
  return lines;
}

function profileSvg({ name, username, public_repos, followers, totalStars, sections = [] }) {
  const safeName = escapeXml(name || 'GitHub user');
  const safeUsername = String(username || 'securitysteven');
  const headerUrl = `https://raw.githubusercontent.com/${encodeURIComponent(safeUsername)}/${encodeURIComponent(safeUsername)}/main/assets/profile-header.svg`;

  const stats = [
    { label: 'PUBLIC REPOSITORIES', value: public_repos },
    { label: 'FOLLOWERS', value: followers },
    { label: 'TOTAL STARS', value: totalStars },
  ];
  const statCards = stats.map(({ label, value }, index) => {
    const x = 36 + index * 231;
    return `
      <g transform="translate(${x} 393)">
        <rect width="216" height="72" rx="14" fill="#111a2e" stroke="#26324b" />
        <text class="label" x="16" y="28">${label}</text>
        <text class="value" x="16" y="57">${escapeXml(value ?? 0)}</text>
      </g>`;
  }).join('');

  let rowY = 546;
  const tableRows = sections.map(({ name: sectionName, repositories = [] }, index) => {
    const lines = wrapRepositories(repositories);
    const rowHeight = Math.max(36, 14 + lines.length * 15);
    const rowTop = rowY;
    const repoLines = lines.map((line, lineIndex) => {
      const links = line.map((repo, repoIndex) => {
        const separator = repoIndex ? '<tspan class="separator">, </tspan>' : '';
        const repositoryUrl = repo.url || `https://github.com/${encodeURIComponent(safeUsername)}/${encodeURIComponent(repo.name)}`;
        return `${separator}<a href="${escapeXml(repositoryUrl)}">${escapeXml(repo.name)}</a>`;
      }).join('');
      return `<text class="repository" x="226" y="${rowTop + 19 + lineIndex * 15}">${links}</text>`;
    }).join('\n');

    rowY += rowHeight;
    return `
      <g>
        <rect x="40" y="${rowTop}" width="680" height="${rowHeight}" fill="${index % 2 ? '#0e1729' : '#111a2e'}" />
        <text class="category" x="54" y="${rowTop + Math.min(rowHeight / 2 + 3, 21)}">${escapeXml(sectionName)}</text>
        ${repoLines || `<text class="repository muted" x="226" y="${rowTop + 21}">No public repositories listed</text>`}
        <line x1="40" y1="${rowTop + rowHeight}" x2="720" y2="${rowTop + rowHeight}" class="table-rule" />
      </g>`;
  }).join('');

  const footerY = rowY + 36;
  const height = footerY + 36;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="760" height="${height}" viewBox="0 0 760 ${height}" fill="none" role="img" aria-labelledby="title description">
  <title id="title">${safeName} — cybersecurity, automation, and open source</title>
  <desc id="description">Profile header, interests, GitHub statistics, and a table of public repositories grouped by section for ${safeName}.</desc>
  <defs>
    <linearGradient id="background" x1="0" y1="0" x2="760" y2="${height}" gradientUnits="userSpaceOnUse">
      <stop stop-color="#0c1222" />
      <stop offset="1" stop-color="#10172a" />
    </linearGradient>
  </defs>
  <rect x="0.5" y="0.5" width="759" height="${height - 1}" rx="22" fill="url(#background)" stroke="#29334a" />
  <image href="${escapeXml(headerUrl)}" x="40" y="30" width="680" height="170" preserveAspectRatio="xMidYMid meet" />

  <rect x="0.5" y="0.5" width="759" height="619" rx="22" fill="url(#background)" stroke="#29334a" />
  <circle cx="704" cy="44" r="80" fill="#8b7bff" fill-opacity=".08" />
  <rect x="36" y="35" width="84" height="84" rx="42" fill="#1a2440" stroke="url(#accent)" stroke-width="2" />
  <image href="${safeAvatar}" x="40" y="38" width="76" height="76" clip-path="url(#avatar-clip)" />
  <text class="name" x="140" y="67">${safeName}</text>
  <text class="subtitle" x="140" y="92">CYBERSECURITY · AUTOMATION · OPEN SOURCE</text>
  <text class="intro" x="140" y="119">Curious about how things work—and how to make them safer, smarter, and more useful.</text>
  <rect x="140" y="133" width="70" height="3" rx="1.5" fill="url(#accent)" />
  
  <text class="section" x="40" y="236">A LITTLE ABOUT ME</text>
  <circle cx="44" cy="263" r="2.5" fill="#8b7bff" />
  <text class="about" x="56" y="267">Interested in security research, penetration testing, and secure coding</text>
  <circle cx="44" cy="288" r="2.5" fill="#8b7bff" />
  <text class="about" x="56" y="292">I enjoy turning repetitive work into useful automation</text>
  <circle cx="44" cy="313" r="2.5" fill="#8b7bff" />
  <text class="about" x="56" y="317">Exploring AI assistants and agents, machine learning operations, and infrastructure</text>
  <circle cx="44" cy="338" r="2.5" fill="#8b7bff" />
  <text class="about" x="56" y="342">Always happy to learn from and contribute to the open-source community</text>

  <text class="section" x="40" y="374">GITHUB SNAPSHOT</text>
  ${statCards}
  <text class="section" x="40" y="518">PUBLIC REPOSITORIES BY SECTION</text>
  <rect x="40" y="522" width="680" height="24" rx="4" fill="#202b42" />
  <text class="table-header" x="54" y="538">SECTION</text>
  <text class="table-header" x="226" y="538">REPOSITORIES</text>
  <line x1="212" y1="522" x2="212" y2="${rowY}" class="table-rule" />
  ${tableRows || '<text class="repository muted" x="54" y="570">No public repositories listed.</text>'}
  <a href="https://github.com/${escapeXml(safeUsername)}" aria-label="Explore Steven’s GitHub profile">
    <text class="link" x="40" y="${footerY}">GITHUB.COM/${escapeXml(safeUsername.toUpperCase())}</text>
  </a>
  <text class="footer" x="720" y="${footerY}" text-anchor="end">METRICS REFRESH DAILY</text>
  <style>
    text { font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
    .section { fill: #9ca9c4; font-size: 10px; font-weight: 700; letter-spacing: 1.3px; }
    .about { fill: #eef1fa; font-size: 12px; }
    .label { fill: #9ca9c4; font-size: 10px; font-weight: 700; letter-spacing: 1px; }
    .value { fill: #f3f5ff; font-size: 23px; font-weight: 700; }
    .table-header { fill: #b7c3dc; font-size: 9px; font-weight: 700; letter-spacing: 1px; }
    .category { fill: #eef1fa; font-size: 10px; font-weight: 600; }
    .repository { fill: #cbd4e8; font-size: 10px; font-weight: 500; }
    .repository a { fill: #cbd4e8; text-decoration: underline; }
    .separator { fill: #71809c; }
    .muted { fill: #8996b0; }
    .table-rule { stroke: #26324b; stroke-width: 1; }
    .footer, .link { fill: #8996b0; font-size: 9px; letter-spacing: 1px; }
    .link { fill: #9ca9c4; }
  </style>
</svg>`;
}

export default async function run() {
  const statsFile = process.env.STATS_FILE || 'stats.json';
  const outputPath = process.env.INPUT_OUTPUT_PATH || 'assets/metrics.svg';
  const raw = await readFile(path.resolve(process.cwd(), statsFile), 'utf8');
  const stats = JSON.parse(raw);
  const svg = profileSvg(stats);
  const fullPath = path.resolve(process.cwd(), outputPath);
  await mkdir(path.dirname(fullPath), { recursive: true });
  await writeFile(fullPath, svg, 'utf8');
  console.log(`Profile SVG written to ${outputPath}`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  run().catch(err => { console.error(err); process.exit(1); });
}
