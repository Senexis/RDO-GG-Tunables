export function orderObject(unordered, recursive = false) {
  const collator = new Intl.Collator('en', { numeric: true, sensitivity: 'base' });
  return Object.keys(unordered)
    .sort((a, b) => collator.compare(a, b))
    .reduce((obj, key) => {
      if (recursive && typeof unordered[key] === 'object' && !Array.isArray(unordered[key]) && unordered[key] !== null) {
        obj[key] = orderObject(unordered[key], recursive);
      } else {
        obj[key] = unordered[key];
      }
      return obj;
    }, {});
}

export function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
