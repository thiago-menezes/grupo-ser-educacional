import {
  setupIntegrationTest,
  INTEGRATION_TEST_TIMEOUT,
  INTEGRATION_WAIT_OPTIONS,
} from '@/libs/testing/integration-test-setup';
import { render, screen, waitFor } from '@/libs/testing/testing-wrapper';

// Setup Prism integration with debug
setupIntegrationTest();

describe('ProductList Integration Tests (Simplified)', () => {
  it(
    'fetches and renders products from Prism mock server',
    async () => {
      // Import component after mock is set up
      const { ProductList } = await import('./index');

      render(<ProductList />);

      // Wait for products to load from Prism
      await waitFor(() => {
        expect(screen.getByText('Products')).toBeInTheDocument();
      }, INTEGRATION_WAIT_OPTIONS);

      expect(screen.queryByText('Loading products…')).not.toBeInTheDocument();
      expect(
        screen.queryByText('Failed to load products.'),
      ).not.toBeInTheDocument();
    },
    INTEGRATION_TEST_TIMEOUT,
  );

  it(
    'handles API errors',
    async () => {
      // Reset and setup error mock
      vi.resetModules();
      setupIntegrationTest({ mockError: true });

      const { ProductList: ErrorProductList } = await import('./index');
      render(<ErrorProductList />);

      await waitFor(() => {
        expect(
          screen.getByText('Failed to load products.'),
        ).toBeInTheDocument();
      }, INTEGRATION_WAIT_OPTIONS);
    },
    INTEGRATION_TEST_TIMEOUT,
  );
});
