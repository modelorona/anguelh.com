/** @type {import("prettier").Config} */
export default {
  plugins: ["prettier-plugin-astro"],
  overrides: [
    {
      files: "*.astro",
      options: {
        parser: "astro",
      },
    },
    {
      files: ["*.js", "*.jsx", "*.ts", "*.tsx"],
      options: {
        parser: "babel",
        singleQuote: false,
        semi: true,
        tabWidth: 4,
      },
    },
    {
      files: ["*.css", "*.scss"],
      options: {
        parser: "css",
        singleQuote: false,
      },
    },
  ],
  printWidth: 100,
  trailingComma: "es5",
  bracketSpacing: true,
  arrowParens: "avoid",
};
