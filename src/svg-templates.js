function simpleCard({ name, avatar, public_repos, followers, totalStars, topRepos }) {
  const reposHtml = topRepos.map((r, i) => `
    <g transform="translate(0, ${i * 20})">
      <text class="stat" x="0" y="0">${r.name}</text>
      <text class="muted" x="160" y="0">★ ${r.stars}</text>
    </g>
  `).join('');

  return `
<svg xmlns="http://www.w3.org/2000/svg" width="480" height="200" viewBox="0 0 480 200" fill="none" role="img" aria-label="GitHub Profile Metrics">
  <style>
    .header { font: 600 18px 'Segoe UI', Ubuntu, Sans-Serif; fill: #58a6ff; animation: fadeIn 0.8s ease-in-out; }
    .stat { font: 600 14px 'Segoe UI', Ubuntu, Sans-Serif; fill: #c9d1d9; }
    .muted { font: 400 12px 'Segoe UI', Ubuntu, Sans-Serif; fill: #8b949e; }
    .bold { font-weight: 700; fill: #ffffff; }
    .avatar { clip-path: circle(35px at 35px 35px); }
    
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes slideIn { from { transform: translateX(-10px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
    
    .item { animation: slideIn 0.5s ease-in-out forwards; opacity: 0; }
    .item:nth-child(1) { animation-delay: 0.2s; }
    .item:nth-child(2) { animation-delay: 0.4s; }
    .item:nth-child(3) { animation-delay: 0.6s; }
  </style>

  <rect x="0.5" y="0.5" width="479" height="199" rx="10" fill="#0d1117" stroke="#30363d"/>
  
  <g transform="translate(25, 25)">
    <g class="header">
      <image href="${avatar}" x="0" y="0" width="70" height="70" class="avatar"/>
      <text x="85" y="30" class="header">${name}</text>
      <text x="85" y="55" class="muted">GitHub Enthusiast</text>
    </g>

    <g transform="translate(0, 95)">
      <g class="item" transform="translate(0, 0)">
        <text class="muted" x="0" y="0">Public Repos</text>
        <text class="stat bold" x="0" y="20">${public_repos}</text>
      </g>
      <g class="item" transform="translate(100, 0)">
        <text class="muted" x="0" y="0">Followers</text>
        <text class="stat bold" x="0" y="20">${followers}</text>
      </g>
      <g class="item" transform="translate(200, 0)">
        <text class="muted" x="0" y="0">Total Stars</text>
        <text class="stat bold" x="0" y="20">${totalStars}</text>
      </g>
    </g>

    <g transform="translate(300, 95)" class="item">
      <text class="muted" x="0" y="0">Top Repositories</text>
      <g transform="translate(0, 20)">
        ${reposHtml}
      </g>
    </g>
  </g>
</svg>`;
}

module.exports = { simpleCard };
