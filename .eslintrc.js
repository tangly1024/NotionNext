module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  extends: [
    'plugin:react/jsx-runtime',
    'plugin:react/recommended',
    'plugin:@next/next/recommended',
    'standard',
    'prettier',
    'plugin:@typescript-eslint/recommended', // 添加 TypeScript 推荐规则
    'plugin:@typescript-eslint/recommended-requiring-type-checking' // 添加需要类型检查的规则
  ],
  parser: '@typescript-eslint/parser', // 使用 TypeScript 解析器
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 12,
    sourceType: 'module',
    project: './tsconfig.json' // 指定 tsconfig.json 的路径
  },
  plugins: [
    'react',
    'react-hooks',
    'prettier',
    '@typescript-eslint' // 添加 TypeScript 插件
  ],
  settings: {
    react: {
      version: 'detect'
    }
  },
  rules: {
    semi: 0,
    'react/no-unknown-property': 'off', // <style jsx>
    'react/prop-types': 'off',
    'space-before-function-paren': 0,
    'react-hooks/rules-of-hooks': 'error', // Checks rules of Hooks
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }], // 确保未使用的变量报错
    '@typescript-eslint/explicit-function-return-type': 'off' // 关闭强制函数返回类型声明
  },
  globals: {
    React: true
  }
}
