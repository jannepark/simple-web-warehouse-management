import globals from "globals";
import pluginJs from "@eslint/js";

/** @type {import('eslint').Linter.Config[]} */
export default [
  { languageOptions: { globals: globals.node } },
  pluginJs.configs.recommended,
  {
    rules: {
      'indent': ['error', 2],
      // 'no-console': 'error',
    },
  },
  {
    files: ['tests/*.js'], 
    rules: {
      'no-console': 'off', // Disable the no-console rule for test files
    },
  },
];