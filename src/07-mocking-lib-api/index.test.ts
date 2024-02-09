import axios from 'axios';
import { throttledGetDataFromApi } from './index';

jest.mock('axios');
jest.mock('./index', () => {
  const originalModule = jest.requireActual('./index');

  return {
    __esModule: true,
    ...originalModule,
    THROTTLE_TIME: undefined,
  };
});

describe('throttledGetDataFromApi', () => {
  test('should create instance with provided base url', async () => {
    jest.spyOn(axios, 'create').mockReturnThis();
    const baseURL = 'https://jsonplaceholder.typicode.com';

    // Throw error as we did not mock axios.get
    await expect(throttledGetDataFromApi('')).rejects.toThrow();

    expect(axios.create).toHaveBeenCalledTimes(1);
    expect(axios.create).toHaveBeenCalledWith(
      expect.objectContaining({ baseURL }),
    );
  });

  test('should perform request to correct provided url', async () => {
    const axiosMock = axios;
    axiosMock.create = jest.fn();
    (axiosMock.create as jest.Mock).mockReturnValue(axiosMock);

    jest.spyOn(axiosMock, 'get');
    const relativePath = '/posts';

    // Throw error as we did not mock axios.get
    await expect(throttledGetDataFromApi(relativePath)).rejects.toThrow();

    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith(relativePath);
  });

  test('should return response data', async () => {
    const axiosMock = axios;
    axiosMock.create = jest.fn();
    (axiosMock.create as jest.Mock).mockReturnValue(axiosMock);

    const mockResponse = { data: [{ id: 1 }] };
    (axiosMock.get as jest.Mock).mockResolvedValue(mockResponse);

    await expect(throttledGetDataFromApi('/posts')).resolves.toEqual(
      mockResponse.data,
    );
  });
});
