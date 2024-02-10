import { simpleCalculator, Action } from './index';

describe('simpleCalculator tests', () => {
  test('should add two numbers', () => {
    const sum = simpleCalculator({ a: 1, b: 2, action: Action.Add });
    expect(sum).toEqual(3);
  });

  test('should subtract two numbers', () => {
    const subtraction = simpleCalculator({
      a: 10,
      b: 2,
      action: Action.Subtract,
    });
    expect(subtraction).toEqual(8);
  });

  test('should multiply two numbers', () => {
    const multiplication = simpleCalculator({
      a: 2,
      b: 2,
      action: Action.Multiply,
    });
    expect(multiplication).toEqual(4);
  });

  test('should divide two numbers', () => {
    const division = simpleCalculator({
      a: 10,
      b: 2,
      action: Action.Divide,
    });
    expect(division).toEqual(5);
  });

  test('should exponentiate two numbers', () => {
    const exponentiation = simpleCalculator({
      a: 2,
      b: 8,
      action: Action.Exponentiate,
    });
    expect(exponentiation).toEqual(256);
  });

  test('should return null for invalid action', () => {
    const invalidAction = simpleCalculator({ a: 1, b: 2, action: 'invalid' });
    expect(invalidAction).toBeNull();
  });

  test('should return null for invalid arguments', () => {
    const invalidArguments = simpleCalculator({
      a: 1,
      b: 'invalid',
      action: Action.Add,
    });
    expect(invalidArguments).toBeNull();
  });
});
