module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  setupFiles: [],
  rootDir: '.',
  roots: ['./src'],
  testRegex: 'src/.+(test)\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': [
      'ts-jest',
      {
        isolatedModules: true,
        module: 'NodeNext'
      }
    ]
  },
  compilerOptions: {
    module: 'NodeNext'
  },
  coverageDirectory: 'coverage',
  coveragePathIgnorePatterns: [],
  coverageReporters: ['text-summary', 'text', 'html'],
  coverageThreshold: {
    global: {
      lines: 80,
      functions: 50,
      branches: 80,
      statements: 80
    }
  },
  testEnvironment: 'node',
  testTimeout: 99999
};
