module.exports = {
  extends: ["next", "prettier"], // 同時繼承 Next.js 和 Prettier 的規則
  settings: {
    next: {
      rootDir: ["apps/client/"], // 告訴 ESLint Next.js 專案在哪
    },
  },
  rules: {
    // 在這裡加入你們團隊的自訂規則，例如：
    "react/no-unescaped-entities": "warn",
  },
};
