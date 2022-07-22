const { isAuthenticated, getAccessTokenFromRequest } = require('@lib/auth');
const { initOctokit } = require('@lib/octokit');
const { getFileData, updateFileData } = require('@lib/files');
const { sortArrayByKey } = require('@lib/util');

export default async function handler(req, res) {
  try {
    if ( !(await isAuthenticated({ request: req })) ) {
      return res.status(401).json({
        message: 'Unauthenticated user.'
      });
    }

    const { source, destination, permanent = false } = req.body;

    if ( typeof source !== 'string' ) {
      throw new Error('Invalid redirect - missing source!')
    }
    if ( typeof destination !== 'string' ) {
      throw new Error('Invalid redirect - missing destination!')
    }

    const accessToken = await getAccessTokenFromRequest(req);

    initOctokit({
      accessToken
    });

    // Get the original source redirects

    const { data: originalFileData } = await getFileData({
      path: 'vercel.json'
    });
    const { redirects: originalRedirects } = originalFileData;

    // Construct a new redirect

    const redirect = {
      source,
      destination,
      permanent
    };

    // Merge the existing with the new redirect using an empty array
    // as the original in the event redirects don't exist yet

    let redirects = [
      ...( originalRedirects || [] ),
      redirect
    ];

    // And sort

    redirects = sortArrayByKey(redirects, 'source');

    // Finally update the file with the new redirects data set

    await updateFileData({
      data: {
        ...originalFileData,
        redirects
      },
      path: 'vercel.json',
      message: 'Redirect added from web app to vercel.json'
    });

    res.status(200).json({
      redirects
    });
  } catch(e) {
    console.log(`Failed to add redirect: ${e.message}`);
    res.status(500).json({
      error: `Failed to add redirect: ${e.message}`
    });
  }
}