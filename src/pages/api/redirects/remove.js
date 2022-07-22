const { initOctokit } = require('@lib/octokit');
const { isAuthenticated, getAccessTokenFromRequest } = require('@lib/auth');
const { getFileData, updateFileData } = require('@lib/files');

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

    const { source: sourceToRemove } = req.body;

    if ( typeof sourceToRemove !== 'string' ) {
      throw new Error('Can not delete redirect, missing source!')
    }

    // Get the original source redirects

    const { data: originalFileData } = await getFileData({
      path: 'vercel.json'
    });
    const { redirects: originalRedirects } = originalFileData;

    // Remove the redirect by the given source, using a new empty object in the event
    // we don't have any existing redirects

    const redirects = ( originalRedirects || [] ).filter(({ source }) => source !== sourceToRemove);

    // Finally update the file with the new redirects data set

    await updateFileData({
      data: {
        ...originalFileData,
        redirects
      },
      path: 'vercel.json',
      message: 'Redirect removed from web app from vercel.json'
    });

    res.status(200).json({
      redirects
    });
  } catch(e) {
    console.log(`Failed to remove redirect: ${e.message}`);
    res.status(500).json({
      error: `Failed to remove redirect: ${e.message}`
    });
  }
}