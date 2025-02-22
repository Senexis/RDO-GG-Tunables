/**
 * @see https://prettier.io/docs/en/configuration.html
 * @type {import("prettier").Config}
 */
const config = {
  // For right now, don't actually try to wrap to decrease git diff noise
  printWidth: Number.POSITIVE_INFINITY,

  // Prevent wrapping for sensitive whitespace elements
  htmlWhitespaceSensitivity: "ignore",

  // Don't wrap single-attribute elements
  singleAttributePerLine: false,

  // Use the default line ending
  endOfLine: "auto",

  // Use single quotes for strings
  singleQuote: true,
};

export default config;