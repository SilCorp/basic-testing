import axios from 'axios';
import { throttledGetDataFromApi } from './index';

jest.mock('axios');
jest.mock('lodash', () => {
  const originalModule = jest.requireActual('lodash');

  return {
    __esModule: true,
    ...originalModule,
    throttle: jest.fn((cb) => cb),
  };
});
const mockAxios = axios as jest.Mocked<typeof axios>;

describe('throttledGetDataFromApi', () => {
  beforeEach(() => {
    mockAxios.create.mockReturnThis();
  });

  test('should create instance with provided base url', async () => {
    const spyAxiosCreate = jest.spyOn(mockAxios, 'create');
    const baseURL = 'https://jsonplaceholder.typicode.com';

    // Throw error as we did not mock axios.get
    await expect(throttledGetDataFromApi('')).rejects.toThrow();

    expect(spyAxiosCreate).toHaveBeenCalledTimes(1);
    expect(spyAxiosCreate).toHaveBeenCalledWith(
      expect.objectContaining({ baseURL }),
    );
  });

  test('should perform request to correct provided url', async () => {
    const spyAxiosGet = jest.spyOn(mockAxios, 'get');
    const relativePath = '/posts';

    // Throw error as we did not mock axios.get
    await expect(throttledGetDataFromApi(relativePath)).rejects.toThrow();

    expect(spyAxiosGet).toHaveBeenCalledTimes(1);
    expect(spyAxiosGet).toHaveBeenCalledWith(relativePath);
  });

  test('should return response data', async () => {
    const mockResponse = { data: [{ id: 1 }] };
    mockAxios.get.mockResolvedValue(mockResponse);

    await expect(throttledGetDataFromApi('/posts')).resolves.toEqual(
      mockResponse.data,
    );
  });
});
