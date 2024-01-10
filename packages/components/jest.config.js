module.exports = {
  collectCoverage: true,
  verbose: true,
  testEnvironment: "jsdom",
  /* moduleNameMapper: {
    "\\.(css|less|scss|sss|styl)$": "jest-css-modules",
  }, */
  setupFilesAfterEnv: ["./jest.setup.js"],
};
