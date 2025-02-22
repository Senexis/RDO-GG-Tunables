import globals from 'globals';
import pluginJs from '@eslint/js';
import pluginVue from 'eslint-plugin-vue';
import eslintConfigPrettier from 'eslint-config-prettier';
import eslintPluginPrettier from 'eslint-plugin-prettier/recommended';
import tailwind from 'eslint-plugin-tailwindcss';

/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ['**/*.{js,mjs,cjs,vue}'] },

  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        IS_DEVELOPMENT: 'readonly',
        SENTRY_DSN: 'readonly',
        SENTRY_RELEASE: 'readonly',
      },
    },
  },

  // Plugins
  pluginJs.configs.recommended,
  ...pluginVue.configs['flat/recommended'],
  ...tailwind.configs['flat/recommended'],
  eslintPluginPrettier,

  {
    rules: {
      'vue/multi-word-component-names': 'off',
      'vue/require-v-for-key': 'warn',

      // While v-html is a security risk, we never use it for user input
      'vue/no-v-html': 'off',

      // Allows us to use '<Content>', '<Menu>' etc. while '<content>' and '<menu>' are reserved HTML elements
      'vue/no-reserved-component-names': [
        'error',
        {
          htmlElementCaseSensitive: true,
        },
      ],

      // Configure unused vars rule to ignore '_vars' and 'props' (using 'props.' is optional)
      'no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
          varsIgnorePattern: '^(?:props|_.*)$',
        },
      ],

      'no-undef': 'warn',
      'no-unused-expressions': 'warn',

      // Saves performance and is broken since we use 'class-[var()]' which is incompatible with this rule
      'tailwindcss/migration-from-tailwind-2': 'off',

      // Ignore custom classnames that are for utility purposes
      'tailwindcss/no-custom-classname': [
        'warn',
        {
          whitelist: [
            'hide-added',
            'hide-deleted',
            'hide-modified',
            'hide-unchanged',
            'hide-meta',
            'hide-content',
            'hide-quick-view',
            'hide-sales',
            'hide-tunables',
            'hide-verbose',
            'v-popper--has-tooltip',
          ],
        },
      ],

      // Prettier integration
      'prettier/prettier': 'warn',
    },
  },

  // Ensure Prettier is last to override conflicting rules
  eslintConfigPrettier,
];
