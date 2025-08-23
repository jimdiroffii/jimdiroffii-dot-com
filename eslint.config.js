// eslint.config.js
import eslintPluginAstro from "eslint-plugin-astro";
import jsxA11y from "eslint-plugin-jsx-a11y";
import tsParser from "@typescript-eslint/parser";

export default [
  // Astro: recommended rules for .astro files
  ...eslintPluginAstro.configs.recommended,

  // Parse TypeScript (incl. TSX)
  {
    files: ["**/*.{ts,tsx,mts,cts}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: { jsx: true },
      },
    },
  },

  // Enable JSX parsing + a11y rules for JSX/TSX
  {
    files: ["**/*.{jsx,tsx}"],
    languageOptions: {
      parser: tsParser, // keeps JSX parsing consistent across JS/TS
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: { "jsx-a11y": jsxA11y },
    rules: { ...jsxA11y.configs.recommended.rules },
  },

  // Housekeeping
  {
    ignores: ["dist/**", ".netlify/**"],
  },
];
