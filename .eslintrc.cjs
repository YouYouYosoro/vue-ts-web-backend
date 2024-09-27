/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  'extends': [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/eslint-config-typescript',
    '@vue/eslint-config-prettier/skip-formatting'
  ],
  rules: {
    'no-var': 'off',
    //全局配置忽略prefer-const报错
    'prefer-const': 'off',
    //全局忽略template标签的报错
    'vue/multi-word-component-names': 'off',
    //忽略递归时在文件内部调用自己export自己的报错
    'vue/no-reserved-component-names': 'off',
    //忽略某些变量未被使用的错误
    "vue/no-unused-vars": "off",
    //禁用 vue/valid-attribute-name 规则
    'vue/valid-attribute-name': 'off',
    'vue/prefer-import-from-vue': 'off', // 禁用 vue/prefer-import-from-vue 规则
  },
  parserOptions: {
    ecmaVersion: 'latest'
  }
}
