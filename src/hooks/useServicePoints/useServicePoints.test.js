import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import {
  renderHook,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';

import useServicePoints from './useServicePoints';

const queryClient = new QueryClient();

// eslint-disable-next-line react/prop-types
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

const data = {
  servicePoints: [],
};

describe('useServicePoints', () => {
  it('should fetch data', async () => {
    useOkapiKy.mockClear().mockReturnValue({
      get: () => ({
        json: () => ({ data }),
      }),
    });

    const { result } = renderHook(() => useServicePoints(), { wrapper });

    await waitFor(() => {
      expect(result.current.servicePoints.data).toEqual(data);
    });
  });
});
