const tap = require('tap')
const { getLocaleProperty } = require('../server/utils/getLocaleProperty.js')

tap.test('getLocaleProperty', function (test) {
  const testData = {
    summary: 'Test!'
  }
  const result = getLocaleProperty(testData, 'summary')
  test.equals(result, 'Test!')
  test.end()
})

tap.test('getLocaleProperty - map', function (test) {
  const testData = {
    summaryMap: {
      en: 'Test!'
    }
  }
  const result = getLocaleProperty(testData, 'summary')
  test.equals(result, 'Test!')
  test.end()
})

tap.test('getLocaleProperty - nothing local', function (test) {
  const testData = {
    summaryMap: {
      is: 'Prófa!'
    }
  }
  const result = getLocaleProperty(testData, 'summary')
  test.notOk(result)
  test.end()
})
