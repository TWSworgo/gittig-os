const GITEA_URL = 'http://localhost:3001/api/v1';
const AUTH_HEADER = 'Basic ' + Buffer.from('gittig_admin:gittig_admin_pass_2026').toString('base64');

export async function createGitRepository(name: string, description: string = '', isPrivate: boolean = false) {
  const response = await fetch(`${GITEA_URL}/user/repos`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': AUTH_HEADER
    },
    body: JSON.stringify({
      name,
      description,
      private: isPrivate,
      auto_init: true,
      default_branch: 'main'
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Git Engine Error: ${errorText}`);
  }

  return await response.json();
}

export async function createGitPullRequest(repoName: string, title: string, head: string, base: string = 'main') {
  const response = await fetch(`${GITEA_URL}/repos/gittig_admin/${repoName}/pulls`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': AUTH_HEADER
    },
    body: JSON.stringify({
      title,
      head,
      base
    })
  });

  return await response.json();
}
