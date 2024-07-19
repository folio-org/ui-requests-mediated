import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import {
  renderHook,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';

import useAvailableItems from './useAvailableItems';

const queryClient = new QueryClient();
// eslint-disable-next-line react/prop-types
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);
const data = {
  items: ['test'],
};

describe('useAvailableItems', () => {
  it('should fetch data', async () => {
    useOkapiKy.mockClear().mockReturnValue({
      get: () => ({
        json: () => ({ data }),
      }),
    });

    const { result } = renderHook(() => useAvailableItems('instanceId', true), { wrapper });

    await waitFor(() => {
      expect(result.current.data.data).toEqual(data);
    });
  });
});
