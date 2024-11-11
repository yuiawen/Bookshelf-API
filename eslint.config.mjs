import globals from "globals";
import pluginJs from "@eslint/js";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ["**/*.js"],
    languageOptions: {
      sourceType: "commonjs",
      globals: globals.node,
    },
    env: {
      node: true,
      commonjs: true,
      es2021: true,
    },
    extends: [
      "airbnb-base",
    ],
    parserOptions: {
      ecmaVersion: "latest",
    },
    rules: {
      "linebreak-style": "off",
      "no-console": "off",
    },
  },
  pluginJs.configs.recommended,
];
