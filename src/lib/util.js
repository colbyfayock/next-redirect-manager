/**
 * sortArrayByKey
 */

export function sortArrayByKey(array, key, { sortOrder = 'asc' } = {}) {
  const newArray = [...array].sort((a, b) => {
    const aValue = typeof a[key] === 'string' && a[key].toLowerCase();
    const bValue = typeof b[key] === 'string' && b[key].toLowerCase();
    return aValue > bValue ? 1 : -1;
  });

  if (sortOrder === 'asc') {
    return newArray;
  } else if (sortOrder === 'desc') {
    return newArray.reverse();
  }
}