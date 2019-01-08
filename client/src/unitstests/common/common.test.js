const CommonApi = require('../../modules/common/components/CommonGlobalFunctions');

test('isString', () => {
  expect(CommonApi.isString('f')).toBe(true);
  expect(CommonApi.isString("f")).toBe(true);
  expect(CommonApi.isString(true)).toBe(false);
  expect(CommonApi.isString("true")).toBe(true);
  expect(CommonApi.isString(() => {})).toBe(false);
  expect(CommonApi.isString(1)).toBe(false);
  expect(CommonApi.isString(1.1)).toBe(false);
  expect(CommonApi.isString(null)).toBe(false);
})

test('checkIfTrue', () => {
  expect(CommonApi.checkIfTrue(null)).toBe(true);
  expect(CommonApi.checkIfTrue(false)).toBe(false);
  expect(CommonApi.checkIfTrue(true)).toBe(true);
  expect(CommonApi.checkIfTrue("true")).toBe(true);
  expect(CommonApi.checkIfTrue(() => {})).toBe(false);
})

test('checkIfValid', () => {
  expect(CommonApi.checkIfValid(null,"")).toBe(true);
  expect(CommonApi.checkIfValid(false,"")).toBe(false);
  expect(CommonApi.checkIfValid(true,"")).toBe(true);
  expect(CommonApi.checkIfValid("true","")).toBe(true);
  expect(CommonApi.checkIfValid(() => {},"")).toBe(false);
})
