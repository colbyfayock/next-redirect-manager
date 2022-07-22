const { isAuthenticated, getAccessTokenFromRequest } = require('@lib/auth');
const { initOctokit } = require('@lib/octokit');
const { getFileData } = require('@lib/files');
const { getDeployments } = require('@lib/vercel');

export default async function handler(req, res) {
  try {
    if ( !(await isAuthenticated({ request: req })) ) {
      return res.status(401).json({
        message: 'Unauthenticated user.'
      });
    }

    const accessToken = await getAccessTokenFromRequest(req);

    initOctokit({
      accessToken
    });

    // First get the most recently committed list of redirects

    const { data: committedData } = await getFileData({
      path: 'vercel.json'
    });

    const { redirects: committedRedirects } = committedData;

    // Next get the redirects that are currently deployed so we can
    // determine in the UI what state the redirect is in

    // That means first getting the list of deployments from the
    // Vercel account

    const deployments = await getDeployments();
    const activeDeployment = deployments.filter(({ state }) => state === 'READY')[0];

    if ( !activeDeployment ) {
      throw new Error('Failed to find active deployment from Vercel.');
    }

    // Then using the commit sha from the most recent active deployment
    // get the redirects state, meaning, the redirects that are live in prod

    const { data: deployedData } = await getFileData({
      path: 'vercel.json',
      ref: activeDeployment.meta.githubCommitSha
    });

    const { redirects: deployedRedirects } = deployedData;

    // Then compare both batches of redirects to determine the state

    let redirects = committedRedirects.map(redirect => {
      const deployed = deployedRedirects.find(({ source, destination }) => redirect.source === source && redirect.destination === destination);
      return {
        ...redirect,
        state: deployed ? 'deployed' : 'committed'
      }
    });

    // We also want to know which are in progress of being deleted, so find any that
    // are deployed but not committed, meaning recently removed

    const redirectsInDeletion = deployedRedirects.filter(redirect => {
      return !committedRedirects.find(({ source, destination }) => redirect.source === source && redirect.destination === destination);
    }).map(redirect => {
      return {
        ...redirect,
        state: 'deleted'
      }
    });

    redirects = redirects.concat(redirectsInDeletion);

    res.status(200).json({
      redirects: redirects || []
    });
  } catch(e) {
    console.log(`Failed to list redirects: ${e.message}`);
    res.status(500).json({
      error: `Failed to list redirects: ${e.message}`
    });
  }
}