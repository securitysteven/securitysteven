const { Octokit } = require('@octokit/rest');

function getClient(token) {
  return new Octokit({ auth: token });
}

async function fetchBasicStats(octokit, username) {
  const { data: user } = await octokit.users.getByUsername({ username });
  const { data: repos } = await octokit.repos.listForUser({ username, per_page: 100 });
  const totalStars = repos.reduce((s, r) => s + r.stargazers_count, 0);
  const topRepos = repos
    .filter(r => !r.fork)
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, 3)
    .map(r => ({ name: r.name, stars: r.stargazers_count }));

  return {
    name: user.name || user.login,
    avatar: user.avatar_url,
    public_repos: user.public_repos,
    followers: user.followers,
    totalStars,
    topRepos
  };
}

module.exports = { getClient, fetchBasicStats };
