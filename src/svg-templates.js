function simpleCard({ name, avatar, public_repos, followers, totalStars, topRepos }) {
  const reposHtml = topRepos.map(r => `<tspan x="140" dy="1.1em">${r.name} — ★${r.stars}</tspan>`).join('');
  return `
<svg xmlns="http://www.w3.org/2000/svg" width="540" height="140" viewBox="0 0 540 140" role="img" aria-label="Profile metrics">
  <style>
    .bg{fill:#0b1226}
    .card{fill:#0f1724; stroke:#1f2937; rx:12; ry:12}
    .muted{fill:#9ca3af; font-size:12px}
    .title{fill:#fff; font-size:18px; font-weight:600}
    .stat{fill:#fff; font-size:14px}
  </style>
  <rect class="bg" width="100%" height="100%"></rect>
  <g transform="translate(12,12)">
    <rect class="card" width="516" height="116" rx="10" />
    <image href="${avatar}" x="18" y="18" width="64" height="64" clip-path="circle(32px at 50% 50%)"/>
    <text x="100" y="36" class="title">${name}</text>
    <text x="100" y="56" class="muted">Public repos: <tspan class="stat">${public_repos}</tspan></text>
    <text x="100" y="76" class="muted">Followers: <tspan class="stat">${followers}</tspan></text>
    <text x="18" y="100" class="muted">Total stars: <tspan class="stat">${totalStars}</tspan></text>
    <g transform="translate(140,20)" class="muted">
      ${reposHtml}
    </g>
  </g>
</svg>`;
}

module.exports = { simpleCard };
