const { Octokit } = require('@octokit/rest');

let _octokit;

/**
 * getOctokit
 */

export function getOctokit() {
  if ( !_octokit ) {
    throw new Error('Failed to get Octokit: you must first initialize Octokit.')
  }
  return _octokit;
}

/**
 * initOctokit
 */

export function initOctokit({ accessToken }) {
  if ( _octokit ) return _octokit;

  _octokit = new Octokit({
    auth: process.env.GITHUB_ACCESS_TOKEN || accessToken
  });

  return _octokit;
}