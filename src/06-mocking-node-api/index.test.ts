import { readFileAsynchronously, doStuffByTimeout, doStuffByInterval } from '.';
import path from 'node:path';
import fs from 'fs';
import fsPromises from 'fs/promises';

jest.mock('fs');
jest.mock('fs/promises');

const mockFS = fs as jest.Mocked<typeof fs>;
const mockFSPromises = fsPromises as jest.Mocked<typeof fsPromises>;

describe('doStuffByTimeout', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set timeout with provided callback and timeout', () => {
    const spySetTimeout = jest.spyOn(global, 'setTimeout');

    const callback = jest.fn();
    const timeout = 1000;

    doStuffByTimeout(callback, timeout);

    expect(spySetTimeout).toHaveBeenCalledTimes(1);
    expect(spySetTimeout).toHaveBeenLastCalledWith(callback, timeout);
  });

  test('should call callback only after timeout', () => {
    const callback = jest.fn();
    const timeout = 1000;

    doStuffByTimeout(callback, timeout);
    expect(callback).not.toHaveBeenCalled();
    jest.runAllTimers();
    expect(callback).toHaveBeenCalledTimes(1);
  });
});

describe('doStuffByInterval', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set interval with provided callback and timeout', () => {
    const spySetInterval = jest.spyOn(global, 'setInterval');

    const callback = jest.fn();
    const interval = 1000;

    doStuffByInterval(callback, interval);

    expect(spySetInterval).toHaveBeenCalledTimes(1);
    expect(spySetInterval).toHaveBeenLastCalledWith(callback, interval);
  });

  test('should call callback multiple times after multiple intervals', () => {
    const callback = jest.fn();
    const interval = 1000;

    doStuffByInterval(callback, interval);
    jest.advanceTimersByTime(interval * 3);
    expect(callback).toHaveBeenCalledTimes(3);
  });
});

describe('readFileAsynchronously', () => {
  test('should call join with pathToFile', async () => {
    const spyJoin = jest.spyOn(path, 'join');
    const pathToFile = 'path/to/file';

    await readFileAsynchronously(pathToFile);

    expect(spyJoin).toHaveBeenCalled();
    expect(spyJoin).toHaveBeenCalledWith(expect.anything(), pathToFile);
  });

  test('should return null if file does not exist', async () => {
    const pathToFile = 'path/to/not-existed-file';

    await expect(readFileAsynchronously(pathToFile)).resolves.toBeNull();
  });

  test('should return file content if file exists', async () => {
    const fileContent = 'file content';
    mockFS.existsSync.mockReturnValue(true);
    mockFSPromises.readFile.mockResolvedValue(fileContent);

    const pathToFile = 'path/to/file';

    await expect(readFileAsynchronously(pathToFile)).resolves.toBe(fileContent);
  });
});
