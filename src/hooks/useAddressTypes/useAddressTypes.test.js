import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import {
  renderHook,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';

import useAddressTypes from './useAddressTypes';

const queryClient = new QueryClient();
// eslint-disable-next-line react/prop-types
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);
const data = {
  addressTypes: ['test'],
};

describe('useAddressTypes', () => {
  it('should fetch data', async () => {
    useOkapiKy.mockClear().mockReturnValue({
      get: () => ({
        json: () => ({ data }),
      }),
    });

    const { result } = renderHook(() => useAddressTypes(), { wrapper });

    await waitFor(() => {
      expect(result.current.addressTypes.data).toEqual(data);
    });
  });
});
