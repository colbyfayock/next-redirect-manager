import useSWR from 'swr';

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function useRedirects({ refreshInterval } = {}) {
  const { data: redirectsData } = useSWR('/api/redirects/list', fetcher, {
    refreshInterval
  });

  const { redirects = [] } = redirectsData || {};

  return {
    redirects
  }
}