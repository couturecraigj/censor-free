module.exports = {
  setupFiles: ['<rootDir>utilities/testing/setupTests.js'],
  globalSetup: '<rootDir>utilities/testing/globalSetup.js',
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
  collectCoverage: true,
  collectCoverageFrom: [
    '**/*.{js,jsx}',
    '!**/node_modules/**',
    '!**/vendor/**',
    '!**/coverage/**',
    '!**/public/**',
    '!**/build/**',
    '!**/static/**',
    '!**/tools/**',
    '!**/test_utilities/**',
    '!**/jest.*.js',
    '!**/dev.*.js',
    '!**/dev.js',
    '!**/mocks.*.js',
    '!**/mocks.js',
    '!postcss.config.js'
  ],
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>utilities/testing/fileTransformer.js',
    '\\.(css|less|sss|scss|sass|styl)$':
      '<rootDir>utilities/testing/fileTransformer.js'
  },
  watchPathIgnorePatterns: [
    '<rootDir>node_modules/',
    '<rootDir>server/',
    '<rootDir>tools/',
    '<rootDir>.circleci/',
    '<rootDir>build/',
    '<rootDir>logs/',
    '<rootDir>public/',
    '<rootDir>static/',
    '<rootDir>*.js',
    '<rootDir>*.json'
  ],
  snapshotSerializers: ['enzyme-to-json/serializer'],
  coverageDirectory: '<rootDir>/coverage',
  coverageReporters: ['json', 'lcov']
};
