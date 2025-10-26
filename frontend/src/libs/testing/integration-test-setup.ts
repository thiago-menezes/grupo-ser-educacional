/**
 * Integration test utilities for mocked axios client
 */

/**
 * Sets up Prism integration by mocking the axios client
 * Call this at the top of your integration test files
 * @param _baseUrl - Override the default Prism server URL
 */
export function setupPrismIntegration() {
  vi.doMock('@/libs/api/axios', () => ({
    query: async (url: string) => {
      // For integration tests, return mock data based on the endpoint
      if (url === '/products/search') {
        return {
          results: [
            {
              id: 'prod_123',
              name: 'Premium Coffee Beans',
              price: 24.99,
              description: 'Single origin coffee beans from Brazil',
              category: 'coffee',
              inStock: true,
              rating: 4.8,
              images: ['/images/coffee-brazil.jpg'],
              tags: ['single-origin', 'premium'],
            },
            {
              id: 'prod_124',
              name: 'French Press',
              price: 35.99,
              description: 'High quality French press for perfect coffee',
              category: 'equipment',
              inStock: true,
              rating: 4.6,
              images: ['/images/french-press.jpg'],
              tags: ['equipment', 'brewing'],
            },
          ],
          total: 2,
          page: 1,
          totalPages: 1,
        };
      }

      // Default fallback for other endpoints
      throw new Error(`Mock not configured for endpoint: ${url}`);
    },
  }));
}

/**
 * Quick setup for integration tests - just call this one function
 * @param options - Configuration options
 */
export function setupIntegrationTest(options?: {
  baseUrl?: string;
  mockError?: boolean;
  errorMessage?: string;
}) {
  if (options?.mockError) {
    setupPrismIntegrationWithError(options.errorMessage);
  } else {
    setupPrismIntegration();
  }
}

/**
 * Sets up Prism integration with error simulation
 * Useful for testing error handling
 */
export function setupPrismIntegrationWithError(errorMessage = 'Network error') {
  vi.doMock('@/libs/api/axios', () => ({
    query: async () => {
      throw new Error(errorMessage);
    },
  }));
}

/**
 * Default timeout for integration tests
 */
export const INTEGRATION_TEST_TIMEOUT = 15000;

/**
 * Default waitFor options for integration tests
 */
export const INTEGRATION_WAIT_OPTIONS = {
  timeout: 10000,
  interval: 500,
};
