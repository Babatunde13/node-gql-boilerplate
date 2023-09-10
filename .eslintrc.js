module.exports = {
    'env': {
        'browser': true,
        'es2021': true,
        'mocha': true,
    },
    'extends': [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended'
    ],
    'parser': '@typescript-eslint/parser',
    'parserOptions': {
        'ecmaVersion': 'latest',
        'sourceType': 'module'
    },
    'plugins': [
        '@typescript-eslint',
        'import',
        'no-only-tests'
    ],
    'rules': {
        'indent': ['error', 4],
        'linebreak-style': ['error', 'unix'],
        'quotes': ['error', 'single'],
        'semi': ['error', 'never'],
        '@typescript-eslint/no-explicit-any': 'warn',
        '@typescript-eslint/no-unused-vars': 'error',
        'import/first': 'error',
        'import/exports-last': 'error',
        'import/no-duplicates': 'error',
        'no-case-declarations': 'off',
        'eol-last': ['error', 'always'],
        'no-only-tests/no-only-tests': ['error', {
            'block': ['it', 'describe', 'test'],
            focus: ['skip', 'only'],
            fix: true,
        }]
    },
}
