import { useState } from 'react';
import Fuse from 'fuse.js';

import { sortArrayByKey } from '@lib/util';

export default function useSearch({ data, keys, sortBy } = {}) {
  const [query, updateQuery] = useState();

  if ( !Array.isArray(data) ) {
    throw new Error('<data> must be an Array in useSearch');
  }

  let results;

  if ( data && typeof query === 'string' && query.length > 0 ) {
    const fuse = new Fuse(data, {
      keys
    });

    results = fuse.search(query).map(({ item }) => item);
  } else {
    results = data;
  }

  if ( results && sortBy ) {
    results = results && sortArrayByKey(results, sortBy);
  }

  return {
    query,
    updateQuery,
    results
  }
}