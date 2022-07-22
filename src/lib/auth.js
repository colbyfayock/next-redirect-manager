import { getToken } from 'next-auth/jwt';

/**
 * isAuthenticated
 */

export async function isAuthenticated({ request }) {
  const accessToken = await getAccessTokenFromRequest(request);
  return !!accessToken;
}

/**
 * getAccessTokenFromRequest
 */

export async function getAccessTokenFromRequest(request) {
  const { accessToken } = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET
  }) || {};

  return accessToken;
}