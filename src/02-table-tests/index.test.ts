import { simpleCalculator, Action } from './index';

const testCases = [
  { a: 1, b: 2, action: Action.Add, expected: 3 },
  { a: 2, b: 2, action: Action.Add, expected: 4 },
  { a: 3, b: 2, action: Action.Add, expected: 5 },

  { a: 1, b: 2, action: Action.Subtract, expected: -1 },
  { a: 2, b: -2, action: Action.Subtract, expected: 4 },
  { a: 6, b: 6, action: Action.Subtract, expected: 0 },

  { a: 6, b: 6, action: Action.Divide, expected: 1 },
  { a: 10, b: 5, action: Action.Divide, expected: 2 },
  { a: 3, b: -1, action: Action.Divide, expected: -3 },

  { a: 2, b: 2, action: Action.Multiply, expected: 4 },
  { a: 3, b: 0, action: Action.Multiply, expected: 0 },
  { a: 3, b: -1, action: Action.Multiply, expected: -3 },

  { a: 2, b: 8, action: Action.Exponentiate, expected: 256 },
  { a: 3, b: 3, action: Action.Exponentiate, expected: 27 },
  { a: 5, b: 2, action: Action.Exponentiate, expected: 25 },

  { a: 5, b: 2, action: 'invalid', expected: null },
  { a: 5, b: 2, action: '123', expected: null },
  { a: 5, b: 2, action: 'xxx', expected: null },

  { a: 5, b: null, action: Action.Exponentiate, expected: null },
  { a: 'invalid', b: 2, action: Action.Add, expected: null },
  { a: 'invalid', b: undefined, action: Action.Subtract, expected: null },
  // continue cases for other actions
];

describe('simpleCalculator', () => {
  test.each(testCases)(
    '({ a: $a, b: $b, action: $action }) should return $expected',
    ({ a, b, action, expected }) => {
      expect(simpleCalculator({ a, b, action })).toBe(expected);
    },
  );
  // Consider to use Jest table tests API to test all cases above
});
