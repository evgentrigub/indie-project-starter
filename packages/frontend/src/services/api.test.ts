import { vi, describe, it, expect, beforeEach, type Mocked } from 'vitest';
import axios, { type AxiosRequestConfig, type AxiosResponse, type AxiosError } from 'axios';

// Mock axios library - This is hoisted
vi.mock('axios');

// --- Mock localStorage (Keep global) --- //
const localStorageMock = (() => {
  let store: { [key: string]: string } = {};
  return {
    getItem: vi.fn((key: string): string | null => store[key] || null),
    setItem: vi.fn((key: string, value: string): void => {
      store[key] = value.toString();
    }),
    removeItem: vi.fn((key: string): void => {
      delete store[key];
    }),
    clear: vi.fn((): void => {
      store = {};
    }),
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// --- Mock window.location (Keep global) --- //
type MockLocation = {
  href: string;
  pathname: string;
};
const locationMock: MockLocation = {
  href: '',
  pathname: '',
};
Object.defineProperty(window, 'location', {
  writable: true,
  value: locationMock,
});
// -------------------------------------- //

describe('API Service', () => {
  // Variables to hold interceptors captured in beforeEach
  let requestInterceptorSuccess: (config: AxiosRequestConfig) => AxiosRequestConfig | Promise<AxiosRequestConfig>;
  let requestInterceptorError: (error: any) => any;
  let responseInterceptorSuccess: (response: AxiosResponse) => AxiosResponse | Promise<AxiosResponse>;
  let responseInterceptorError: (error: AxiosError) => Promise<AxiosError>;

  beforeEach(async () => {
    // 1. Reset modules to ensure api.ts runs fresh
    vi.resetModules();

    // 2. Re-acquire mocked axios reference (needed after resetModules)
    const mockedAxios = (await import('axios')).default as Mocked<typeof axios>;

    // 3. Define fresh spies and mock instance structure for this test
    const requestUseSpy = vi.fn();
    const responseUseSpy = vi.fn();
    const mockInstance = {
        interceptors: {
            request: { use: requestUseSpy, eject: vi.fn(), clear: vi.fn() },
            response: { use: responseUseSpy, eject: vi.fn(), clear: vi.fn() }
        },
        get: vi.fn(),
        post: vi.fn(),
    } as any;

    // 4. Configure mocked axios.create BEFORE importing api.ts
    mockedAxios.create.mockReturnValue(mockInstance);

    // 5. Dynamically import api.ts AFTER mock is configured
    // This ensures it uses the mockInstance defined above
    await import('./api');

    // 6. Capture interceptors from the spies that should have been called by api.ts
    if (requestUseSpy.mock.calls.length > 0) {
      [requestInterceptorSuccess, requestInterceptorError] = requestUseSpy.mock.calls[0];
    } else {
      console.error("CRITICAL: Request interceptor's use method still not called after dynamic import.");
      requestInterceptorSuccess = config => config;
      requestInterceptorError = error => Promise.reject(error);
    }

    if (responseUseSpy.mock.calls.length > 0) {
      [responseInterceptorSuccess, responseInterceptorError] = responseUseSpy.mock.calls[0];
    } else {
      console.error("CRITICAL: Response interceptor's use method still not called after dynamic import.");
      responseInterceptorSuccess = response => response;
      responseInterceptorError = error => Promise.reject(error);
    }

    // 7. Reset localStorage and location for the test
    localStorageMock.clear();
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
    localStorageMock.removeItem.mockClear();
    locationMock.href = '';
    locationMock.pathname = '';
  });

  it('should add auth token to requests', () => {
    const token = 'test-token-123';
    localStorageMock.setItem('token', token);
    const config: AxiosRequestConfig = {
      headers: {} as any,
    };
    // This should now execute the actual logic captured from api.ts
    const updatedConfig = requestInterceptorSuccess(config) as AxiosRequestConfig;
    expect(localStorageMock.getItem).toHaveBeenCalledWith('token');
    expect(updatedConfig.headers).toBeDefined();
    expect(updatedConfig.headers?.Authorization).toBe(`Bearer ${token}`);
  });

  it('should handle 401 responses by clearing token and redirecting', async () => {
    localStorageMock.setItem('token', 'some-token');
    locationMock.pathname = '/dashboard';
    const error: Partial<AxiosError> = {
      response: { 
        status: 401,
        data: {},
        statusText: 'Unauthorized',
        headers: {},
        config: {} as AxiosRequestConfig,
      },
      isAxiosError: true,
      name: 'AxiosError',
      message: 'Request failed with status code 401',
      config: {} as AxiosRequestConfig,
    };
    await expect(responseInterceptorError(error as AxiosError)).rejects.toEqual(error);
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('token');
    expect(locationMock.href).toBe('/login');
  });

  it('should not redirect on 401 if already on login page', async () => {
    localStorageMock.setItem('token', 'some-token');
    locationMock.pathname = '/login';
    const error: Partial<AxiosError> = {
      response: { 
        status: 401,
        data: {},
        statusText: 'Unauthorized',
        headers: {},
        config: {} as AxiosRequestConfig,
      },
      isAxiosError: true,
      name: 'AxiosError',
      message: 'Request failed with status code 401',
      config: {} as AxiosRequestConfig,
    };
    await expect(responseInterceptorError(error as AxiosError)).rejects.toEqual(error);
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('token');
    expect(locationMock.href).toBe('');
  });

  it('should handle other error responses without clearing token or redirecting', async () => {
    localStorageMock.setItem('token', 'some-token');
    locationMock.pathname = '/dashboard';
    const error: Partial<AxiosError> = {
      response: { 
        status: 500,
        data: {},
        statusText: 'Internal Server Error',
        headers: {},
        config: {} as AxiosRequestConfig,
      },
      isAxiosError: true,
      name: 'AxiosError',
      message: 'Request failed with status code 500',
      config: {} as AxiosRequestConfig,
    };
    await expect(responseInterceptorError(error as AxiosError)).rejects.toEqual(error);
    expect(localStorageMock.removeItem).not.toHaveBeenCalled();
    expect(locationMock.href).toBe('');
  });
}); 