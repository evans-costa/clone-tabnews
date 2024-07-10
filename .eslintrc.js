module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    "eslint:recommended",
    "prettier",
    "next/core-web-vitals",
    "plugin:jest/recommended",
  ],
  plugins: ["jest"],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
};
