export function provisionLiveDeployment(repoName: string) {
  return {
    deploymentId: 'dpl_' + Date.now().toString(36),
    repoName,
    status: 'ACTIVE',
    previewUrl: `https://${repoName}-live-preview.gittig.live`,
    region: 'Edge Sandbox (SSL Secure)',
    deployedAt: new Date().toLocaleTimeString()
  };
}
