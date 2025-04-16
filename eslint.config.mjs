import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals"),
  {
    rules: {
      // TypeScript-specific rules
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { 
          "argsIgnorePattern": "^_",
          "varsIgnorePattern": "^_",
          "caughtErrorsIgnorePattern": "^_"
        }
      ],
      
      // React-specific rules
      "react/no-unescaped-entities": "off",
      
      // Next.js-specific rules
      "@next/next/no-html-link-for-pages": "error",
      
      // General JavaScript rules
      "no-console": "warn",
    },
  },
  {
    // Apply to TypeScript files only
    files: ["**/*.ts", "**/*.tsx"],
    rules: {
      // Allow unused types that start with underscore
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { 
          "argsIgnorePattern": "^_",
          "varsIgnorePattern": "^_",
          "caughtErrorsIgnorePattern": "^_",
          "vars": "all",
          "args": "after-used",
          "ignoreRestSiblings": true
        }
      ],
    },
  },
];

export default eslintConfig;