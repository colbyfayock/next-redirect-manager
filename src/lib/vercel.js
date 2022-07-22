const VERCEL_API_ENDPOINT = 'https://api.vercel.com';

/**
 * getFileData
 */

export async function getDeployments({ team = process.env.VERCEL_TEAM_ID } = {}) {

  let endpoint = `${VERCEL_API_ENDPOINT}/v6/deployments`;

  if ( team ) {
    endpoint = `${endpoint}?teamId=${team}`;
  }

  const { deployments } = await fetch(endpoint, {
    headers: {
      Authorization: `Bearer ${process.env.VERCEL_ACCESS_TOKEN}`
    }
  }).then(r => r.json());

  return deployments;
}