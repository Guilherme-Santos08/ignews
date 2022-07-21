module.exports = {
  // Pasta que eu quero ignorar
  testPathIgnorePatterns: ['/node_modules/', '/.next/'],
  // Arquivos que o jest vai execultar antes de iniciar os tests
  setupFilesAfterEnv: ['<rootDir>/src/tests/setupTests.ts'],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': '<rootDir>/node_modules/babel-jest',
  },

  // todos arquivo que termina com .css/scss|sass vamos usar a a lib identity-obj-proxy que vai converter nosso código de uma maneira que o jest consiga entender
  moduleNameMapper: {
    '\\.(scss|css|sass)$': 'identity-obj-proxy',
  },

  // testEnvironment: 'jsdom',
}
