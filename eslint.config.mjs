// eslint.config.mjs
import next from '@next/eslint-plugin-next';
import tseslint from 'typescript-eslint';
import js from '@eslint/js';

export default tseslint.config(
  {
    // Base JavaScript configuration (recommended rules)
    ...js.configs.recommended,
    
    // TypeScript configuration
    ...tseslint.configs.recommended,
    
    // Next.js configuration
    ...next.configs.recommended,
    
    // Your custom settings
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      '@next/next': next,
    },
    rules: {
      // Your custom rules
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      
      // Additional recommended rules
      '@typescript-eslint/consistent-type-imports': 'warn',
      '@next/next/no-html-link-for-pages': 'error',
      
      // React specific rules
      'react-hooks/exhaustive-deps': 'warn',
    },
    settings: {
      next: {
        rootDir: import.meta.dirname,
      },
    },
  },
  
  // Optional: Additional configurations for specific file types
  {
    files: ['**/*.stories.tsx'],
    rules: {
      'react-hooks/rules-of-hooks': 'off',
    },
  }
);