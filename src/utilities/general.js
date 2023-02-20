export function orderObject(unordered, recursive = false) {
  const collator = new Intl.Collator("en", { numeric: true, sensitivity: "base" });
  return Object.keys(unordered)
    .sort((a, b) => collator.compare(a, b))
    .reduce((obj, key) => {
      if (recursive && typeof unordered[key] === "object" && !Array.isArray(unordered[key])) {
        obj[key] = orderObject(unordered[key], recursive);
      } else {
        obj[key] = unordered[key];
      }
      return obj;
    }, {});
}
