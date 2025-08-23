import eslintPluginAstro from "eslint-plugin-astro";
import jsxA11y from "eslint-plugin-jsx-a11y";

export default [
  ...eslintPluginAstro.configs.recommended,
  {
    files: ["**/*.{jsx,tsx,astro}"],
    plugins: { "jsx-a11y": jsxA11y },
    rules: { ...jsxA11y.configs.recommended.rules },
  },
  {
    ignores: ["dist/**", ".netlify/**"],
  },
];
