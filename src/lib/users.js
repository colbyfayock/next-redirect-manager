import { getOctokit } from '@lib/octokit';

let applicationUser;

/**
 * getApplicationUser
 */

export async function getApplicationUser() {
  const octokit = getOctokit();

  const { data: user } = await octokit.rest.users.getAuthenticated();

  if ( !user?.login ) {
    throw new Error('Unable to retrieve GitHub application user.');
  }

  return user;
}

/**
 * getApplicationUserEmails
 */

export async function getApplicationUserEmails() {
  const octokit = getOctokit();

  const { data: emails } = await octokit.rest.users.listEmailsForAuthenticatedUser();

  if ( !emails ) {
    throw new Error('Unable to retrieve GitHub application user email list.');
  }

  return emails;
}

/**
 * getPermittedUsers
 */

export async function getPermittedUsers() {
  const octokit = getOctokit();
  const user = await getApplicationUser();

  const { data: users } = await octokit.rest.repos.listCollaborators({
    owner: user.login,
    repo: process.env.GITHUB_REPOSITORY,
  });

  return users;
}