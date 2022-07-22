import { getOctokit } from '@lib/octokit';
import { getApplicationUser, getApplicationUserEmails } from '@lib/users';

/**
 * getFileData
 */

export async function getFileData({ path, ref }) {
  const octokit = getOctokit();
  const user = await getApplicationUser();

  const { data: file } = await octokit.rest.repos.getContent({
    owner: user.login,
    repo: process.env.GITHUB_REPOSITORY,
    path,
    ref
  });

  if ( !file ) {
    throw new Error(`Unable to retrieve file ${path}`);
  }

  return {
    data: JSON.parse(Buffer.from(file.content, 'base64').toString()),
    file
  }
}

/**
 * updateFileData
 */

export async function updateFileData({ data, path, message, createIfNotFound = true }) {
  if ( !message ) {
    throw new Error('Message required for updating file.');
  }

  const octokit = getOctokit();
  const user = await getApplicationUser();
  const emails = await getApplicationUserEmails();
  const userEmail = emails.filter(({ primary, verified }) => !!primary && !!verified)[0]?.email;

  let originalFile;

  try {
    const { file } = await getFileData({ path });
    originalFile = file;
  } catch(e) {
    if ( createIfNotFound ) {
      console.log(`File ${path} missing - creating file.`);

      const content =  Buffer.from(JSON.stringify([], null, 2)).toString('base64');

      const newfile = await octokit.rest.repos.createOrUpdateFileContents({
        owner: user.login,
        repo: process.env.GITHUB_REPOSITORY,
        path,
        message: 'Creating redirects.json',
        content,
        committer: {
          name: user.name,
          email: userEmail
        },
        author: {
          name: user.name,
          email: userEmail
        },
      });

      originalFile = newfile?.data.content;
    } else {
      throw e;
    }
  }

  const content =  Buffer.from(JSON.stringify(data, null, 2)).toString('base64');

  await octokit.rest.repos.createOrUpdateFileContents({
    owner: user.login,
    repo: process.env.GITHUB_REPOSITORY,
    path,
    message,
    content,
    sha: originalFile.sha,
    committer: {
      name: user.name,
      email: userEmail
    },
    author: {
      name: user.name,
      email: userEmail
    },
  });

  return true;
}