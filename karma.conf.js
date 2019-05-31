/* eslint-disable import/no-extraneous-dependencies */
const createDefaultConfig = require('@open-wc/testing-karma/default-config')
const merge = require('webpack-merge')

module.exports = config => {
  config.set(
    merge(createDefaultConfig(config), {
      // We might temporarily removing Firefox while we figure out a better configuration for testing visibility.
      browsers: ['Firefox'],
      files: [
        // runs all files ending with .test in the test folder,
        // can be overwritten by passing a --grep flag. examples:
        //
        // npm run test -- --grep test/foo/bar.test.js
        // npm run test -- --grep test/bar/*
        { pattern: config.grep ? config.grep : 'test/**/*.test.js', type: 'module' },
        { pattern: 'node_modules/fetch-mock/dist/es5/client-bundle.js', type: 'js' }
      ],
      coverageIstanbulReporter: {
        reports: ['html', 'lcovonly', 'text'],
        dir: 'coverage',
        combineBrowserReports: true,
        skipFilesWithNoCoverage: false,
        thresholds: {
          global: {
            statements: 50,
            branches: 50,
            functions: 50,
            lines: 50
          }
        }
      }

      // you can overwrite/extend the config further
    })
  )
  return config
}
