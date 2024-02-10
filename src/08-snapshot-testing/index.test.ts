// Uncomment the code below and write your tests
import { generateLinkedList } from './index';

describe('generateLinkedList', () => {
  // Check match by expect(...).toStrictEqual(...)
  test('should generate linked list from values 1', () => {
    const snapshot = {
      next: {
        next: null,
        value: null,
      },
      value: 1,
    };
    const list = generateLinkedList([1]);

    expect(list).toStrictEqual(snapshot);
  });

  // Check match by comparison with snapshot
  test('should generate linked list from values 2', () => {
    const list = generateLinkedList([1, 2, 3, 4, 5]);

    expect(list).toMatchSnapshot();
  });
});
