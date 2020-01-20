module.exports = function() {
  return {
    files: ["**/*", "!**/*.test.js", "!node_modules/**/*"],

    tests: ["**/*.test.js", "!node_modules/**/*"],

    setup: wallaby => {
      const chai = require("chai");

      chai.use(require("sinon-chai"));

      global.expect = require("chai").expect;
    },

    testFramework: "mocha",

    env: {
      type: "node",
      runner: "node"
    },

    workers: { recycle: true }
  };
};
