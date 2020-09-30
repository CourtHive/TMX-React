module.exports = {
  testRegex: '/*.test.js$',
  collectCoverage: true,
  coverageReporters: ['lcov'],
  coverageDirectory: 'test-coverage',
  // "moduleDirectories": ["src/engines/drawEngine"],
  // "roots": ["<rootDir>/src/engines"],
  transform: {
    '^.+\\.jsx?$': 'babel-jest'
  }
};
